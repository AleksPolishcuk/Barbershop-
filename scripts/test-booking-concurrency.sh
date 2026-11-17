#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
test_dir="$(mktemp -d)"
data_dir="$test_dir/data"
socket_dir="$test_dir/socket"
mkdir -p "$socket_dir"
test_port="$((50000 + RANDOM % 10000))"

cleanup() {
  pg_ctl -D "$data_dir" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$test_dir"
}
trap cleanup EXIT

initdb -D "$data_dir" -A trust -U postgres >/dev/null
pg_ctl -D "$data_dir" -o "-k $socket_dir -p $test_port -c listen_addresses=''" -l "$test_dir/postgres.log" start >/dev/null
export PGHOST="$socket_dir" PGPORT="$test_port" PGUSER=postgres PGDATABASE=postgres
psql -Xq -v ON_ERROR_STOP=1 -f "$repo_dir/db/001_atomic_bookings.sql" >/dev/null

test_day="((now() at time zone 'Europe/Helsinki')::date + 1)"
claim() {
  psql -XAt -v ON_ERROR_STOP=1 -c "select public.claim_booking('$1'::uuid,'$2','$3',$test_day,'$4','$5','$6');"
}

# Both database sessions compete for one barber. Session A holds the exclusion
# constraint transaction open so B must wait and then lose after A commits.
psql -XAt -v ON_ERROR_STOP=1 -c "begin; select public.claim_booking('11111111-1111-4111-8111-111111111111','classic','ali',$test_day,'10:00','First Client','+358401111111'); select pg_sleep(2); commit;" >"$test_dir/first" &
first_pid=$!
sleep 0.3
claim '22222222-2222-4222-8222-222222222222' classic ali '10:00' 'Second Client' '+358402222222' >"$test_dir/second" &
second_pid=$!
wait "$first_pid" "$second_pid"
[[ "$(cat "$test_dir/first")" == *'"status": "confirmed"'* ]]
[[ "$(cat "$test_dir/second")" == *'"status": "unavailable"'* ]]

# Same request key is idempotent, and different payload with the key is rejected.
[[ "$(claim '11111111-1111-4111-8111-111111111111' classic ali '10:00' 'First Client' '+358401111111')" == *'"status": "confirmed"'* ]]
[[ "$(claim '11111111-1111-4111-8111-111111111111' fade ali '10:00' 'First Client' '+358401111111')" == *'"status": "idempotency_mismatch"'* ]]

# 50 minutes from 11:30 overlaps a 12:00 start for the same barber.
[[ "$(claim '33333333-3333-4333-8333-333333333333' fade ali '11:30' 'Third Client' '+358403333333')" == *'"status": "confirmed"'* ]]
[[ "$(claim '44444444-4444-4444-8444-444444444444' classic ali '12:00' 'Fourth Client' '+358404444444')" == *'"status": "unavailable"'* ]]

# A different barber can take the same time. "any" moves to the next free barber.
[[ "$(claim '55555555-5555-4555-8555-555555555555' classic marko '12:00' 'Fifth Client' '+358405555555')" == *'"status": "confirmed"'* ]]
[[ "$(claim '66666666-6666-4666-8666-666666666666' classic any '12:00' 'Sixth Client' '+358406666666')" == *'"barber": "danylo"'* ]]
[[ "$(claim '77777777-7777-4777-8777-777777777777' classic any '12:00' 'Seventh Client' '+358407777777')" == *'"status": "unavailable"'* ]]

# The schema itself rejects an overlapping write that bypasses the function.
if psql -Xq -v ON_ERROR_STOP=1 -c "insert into public.bookings (request_key,service_id,barber_id,customer_name,customer_phone,starts_at,ends_at) values ('99999999-9999-4999-8999-999999999999','classic','ali','Bypass Client','+358409999999',($test_day + time '11:30') at time zone 'Europe/Helsinki',($test_day + time '12:15') at time zone 'Europe/Helsinki');" >"$test_dir/bypass" 2>&1; then
  echo 'FAIL: direct overlapping insert was accepted' >&2
  exit 1
fi

[[ "$(claim 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' unknown ali '10:00' 'Invalid Client' '+358401111111')" == *'"status": "invalid"'* ]]

# Cancelling releases the protected time range.
psql -Xq -v ON_ERROR_STOP=1 -c "update public.bookings set status='cancelled' where request_key='11111111-1111-4111-8111-111111111111';" >/dev/null
[[ "$(claim '88888888-8888-4888-8888-888888888888' classic ali '10:00' 'Eighth Client' '+358408888888')" == *'"status": "confirmed"'* ]]

psql -XAt -v ON_ERROR_STOP=1 -c "select count(*) from public.bookings a join public.bookings b on a.id < b.id and a.barber_id=b.barber_id and a.status='confirmed' and b.status='confirmed' and tstzrange(a.starts_at,a.ends_at,'[)') && tstzrange(b.starts_at,b.ends_at,'[)');" | { read -r overlaps; [[ "$overlaps" == 0 ]]; }
echo 'PASS: concurrent winner, conflict, range overlap, alternate barber, idempotency, invalid input, cancellation'
