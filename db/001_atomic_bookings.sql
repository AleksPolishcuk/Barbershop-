-- A real booking needs one shared, durable source of truth. Apply in PostgreSQL 16+.
-- This migration is not used by the current front-end demo.
create extension if not exists btree_gist;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null unique,
  service_id text not null check (service_id in ('classic', 'fade', 'beard')),
  barber_id text not null check (barber_id in ('ali', 'marko', 'danylo')),
  customer_name text not null,
  customer_phone text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint booking_positive_duration check (ends_at > starts_at),
  constraint booking_no_barber_overlap exclude using gist (
    barber_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status = 'confirmed')
);

create index if not exists bookings_by_start on public.bookings (starts_at) where status = 'confirmed';

-- The database, not WhatsApp delivery order or client-side availability, chooses the winner.
-- A request key makes retries safe. "any" tries each barber in a deterministic order.
create or replace function public.claim_booking(
  p_request_key uuid,
  p_service_id text,
  p_barber_id text,
  p_day date,
  p_time time,
  p_name text,
  p_phone text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing public.bookings%rowtype;
  v_barber text;
  v_start timestamptz;
  v_end timestamptz;
  v_minutes integer;
  v_id uuid;
begin
  select * into v_existing from public.bookings where request_key = p_request_key;
  if found then
    if v_existing.service_id is distinct from p_service_id or
       (p_barber_id is distinct from 'any' and v_existing.barber_id is distinct from p_barber_id) or
       v_existing.starts_at is distinct from ((p_day + p_time) at time zone 'Europe/Helsinki') or
       v_existing.customer_name is distinct from btrim(p_name) or
       v_existing.customer_phone is distinct from btrim(p_phone) then
      return jsonb_build_object('status', 'idempotency_mismatch');
    end if;
    return jsonb_build_object('status', v_existing.status, 'id', v_existing.id, 'barber', v_existing.barber_id);
  end if;

  v_minutes := case p_service_id when 'classic' then 45 when 'fade' then 50 when 'beard' then 65 else null end;
  if p_request_key is null or v_minutes is null or p_barber_id is null or
     p_barber_id not in ('any', 'ali', 'marko', 'danylo') or
     p_day is null or p_time is null or
     p_day < (now() at time zone 'Europe/Helsinki')::date or
     p_day > (now() at time zone 'Europe/Helsinki')::date + 90 or
     p_time not in (time '10:00', time '11:30', time '12:00', time '14:30', time '16:00', time '17:30') or
     p_name is null or p_phone is null or
     length(btrim(p_name)) < 2 or length(btrim(p_name)) > 100 or
     length(btrim(p_phone)) < 6 or length(btrim(p_phone)) > 24 or
     btrim(p_phone) !~ '^\+?[0-9 ()-]{6,24}$' then
    return jsonb_build_object('status', 'invalid');
  end if;

  v_start := (p_day + p_time) at time zone 'Europe/Helsinki';
  if v_start <= now() then
    return jsonb_build_object('status', 'invalid');
  end if;
  v_end := v_start + make_interval(mins => v_minutes);

  for v_barber in select unnest(case when p_barber_id = 'any'
                                    then array['ali', 'marko', 'danylo']
                                    else array[p_barber_id] end) loop
    begin
      insert into public.bookings
        (request_key, service_id, barber_id, customer_name, customer_phone, starts_at, ends_at)
      values
        (p_request_key, p_service_id, v_barber, btrim(p_name), btrim(p_phone), v_start, v_end)
      returning id into v_id;
      return jsonb_build_object('status', 'confirmed', 'id', v_id, 'barber', v_barber);
    exception
      when exclusion_violation then
        -- Another transaction already claimed an overlapping interval for this barber.
        null;
      when unique_violation then
        -- An identical request may have arrived concurrently; return its committed result.
        select * into v_existing from public.bookings where request_key = p_request_key;
        if found then
          if v_existing.service_id is distinct from p_service_id or
             (p_barber_id is distinct from 'any' and v_existing.barber_id is distinct from p_barber_id) or
             v_existing.starts_at is distinct from v_start or
             v_existing.customer_name is distinct from btrim(p_name) or
             v_existing.customer_phone is distinct from btrim(p_phone) then
            return jsonb_build_object('status', 'idempotency_mismatch');
          end if;
          return jsonb_build_object('status', v_existing.status, 'id', v_existing.id, 'barber', v_existing.barber_id);
        end if;
        raise;
    end;
  end loop;
  return jsonb_build_object('status', 'unavailable');
end;
$$;

-- Browser users must never call this function directly or read customer records.
revoke all on public.bookings from public;
revoke all on function public.claim_booking(uuid, text, text, date, time, text, text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on public.bookings from anon';
    execute 'revoke all on function public.claim_booking(uuid, text, text, date, time, text, text) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on public.bookings from authenticated';
    execute 'revoke all on function public.claim_booking(uuid, text, text, date, time, text, text) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.claim_booking(uuid, text, text, date, time, text, text) to service_role';
  end if;
end;
$$;
