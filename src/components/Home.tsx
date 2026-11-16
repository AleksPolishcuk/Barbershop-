"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { business } from "@/lib/site";

type Language = "fi" | "en";

const content = {
  fi: {
    nav: ["PALVELUT", "KÄYNTI", "PARTURIT", "YHTEYSTIEDOT"], book: "VARAA AIKA", location: "PARTURI · TURKU, SUOMI",
    heroTitle: <>Parturi Turussa.<br/><i>Sinun tyylilläsi.</i></>, heroText: <>Tarkat leikkaukset, rauhallinen hetki ja tyyli, joka tuntuu omalta.</>, heroCta: "Varaa aika", heroSecondary: "Katso palvelut ja hinnat", heroPrice: "HIUSTENLEIKKAUKSET ALK. 20 €", serviceBook: "Varaa aika", barberBook: "VARAA AIKA", scroll: "KATSO PALVELUT",
    side: <>EI VAIN HIUSTENLEIKKAUS<br/>VAAN VARMUUTTA OMAAN TYYLIIN</>, introLabel: "01 / MEIDÄN TYYLIMME", introEyebrow: "PERINNETTÄ, JOKA KATSOO ETEENPÄIN", introTitle: <>Tarkka kädenjälki.<br/><i>Varmalla otteella.</i></>, introText: "Hyvä hiustenleikkaus muuttaa ryhtiä. Siksi jokaisella yksityiskohdalla on väliä: ensikonsultaatiosta partaveitsen viimeiseen vetoon.", meetTeam: "TUTUSTU PARTUREIHIN", made: "HARKITEN TEHTY",
    serviceEyebrow: "01 / PALVELUT JA HINNAT", serviceTitle: <>Valitse sinulle<br/><i>sopiva leikkaus.</i></>, serviceNote: <>Hinta ja kesto näkyvät heti.<br/>Varaa suoraan haluamasi palvelu.</>, priceNote: "HINNAT EUROINA", serviceFoot: "VALITSE PALVELU JA VARAA AIKA", manifestoEyebrow: "ÄLÄ SEURAA MUOTIA", manifestoTitle: <>Löydä<br/><i>oma tyylisi.</i></>, manifestoText: "Emme kopioi esikuvia. Kuuntelemme sinua, huomioimme kasvonpiirteesi ja löydämme juuri sinulle sopivan tyylin.", manifestoCta: "Varaa ensimmäinen käynti", teamEyebrow: "03 / PARTURIT", teamTitle: <>Valitse oma<br/><i>parturisi.</i></>, teamText: <>Valitse tuttu tekijä tai tutustu uuteen.<br/>Varaa aika suoraan haluamallesi parturille.</>,
    facts: [{ value: "20 €", label: "LEIKKAUKSET ALKAEN" }, { value: "45–65 min", label: "PALVELUN KESTO" }, { value: "TURKU", label: "LÖYDÄT MEIDÄT" }],
    experienceEyebrow: "02 / NÄIN KÄYNTI ETENEE", experienceTitle: <>Helppo varata.<br/><i>Hyvä tulla.</i></>, experienceText: "Valitse palvelu, parturi ja sinulle sopiva aika. Paikan päällä aloitamme kuuntelemalla, mitä toivot hiuksiltasi.", experienceSteps: [{ title: "Valitse palvelu", text: "Näet hinnan ja keston ennen kuin varaat." }, { title: "Valitse parturi ja aika", text: "Löydä sinulle sopiva tekijä ja ajankohta." }, { title: "Tule omana itsenäsi", text: "Käymme toiveesi läpi ennen leikkausta." }],
    quote: <>“Hyvä tyyli alkaa siitä,<br/><i>että sinua kuunnellaan.”</i></>, quoteAuthor: "BLADE · TURKU", visitEyebrow: "04 / SIJAINTI", visitTitle: <>Nähdään<br/><i>Turussa.</i></>, find: "LÖYDÄ MEIDÄT", route: "REITTI KARTALLA", hours: "AJANVARAUS", weekdays: "Ajat näkyvät varausnäkymässä", sunday: "SUNNUNTAI", visitNote: <>HYVÄT HIUKSET.<br/><i>HYVÄ FIILIS.</i></>, footerTagline: "Parturipalveluita harkiten. Turku, Suomi.", footerNavTitle: "TUTUSTU", socialTitle: "SEURAA MEITÄ", footerMade: "HUOLELLA VIIMEISTELTY", top: "YLÖS",
    step: "VAIHE", bookingTitles: [<>Valitse<br/><i>palvelu.</i></>, <>Valitse<br/><i>sopiva aika.</i></>, <>Lisää<br/><i>yhteystiedot.</i></>], bookingIntro: "Varaat ajan alle minuutissa.", chooseService: "VALITSE PALVELU", chooseBarber: "PARTURI", date: "PÄIVÄ", available: "ESIMERKKIAJAT", next: "Valitse aika", confirmTime: "Lisää yhteystiedot", backService: "← Takaisin palveluihin", backTime: "← Vaihda aikaa", yourName: "NIMESI", namePlaceholder: "Millä nimellä varaamme?", phone: "PUHELINNUMERO", finish: "Näytä varaus", successLabel: "VARAUKSEN ESIMERKKI", seeYou: "Nähdään pian,", friend: "ystävä", successText: "Tämä on varausnäkymän esikatselu. Vahvistusviestit ja tallennetut varaukset lisätään myöhemmin.", great: "Selvä", close: "Sulje", barberRoles: ["Vastaava parturi · 8 vuotta", "Parturi · 5 vuotta", "Parturi · 4 vuotta"], currency: "€", services: [
      { id: "classic", no: "01", title: "Klassinen hiustenleikkaus", en: "KLASSINEN LEIKKAUS", desc: "Ajaton muoto ja hiustesi tekstuuriin sopiva yksilöllinen viimeistely.", price: 20, time: "45 min", image: "photo-1520338661084-680395057c93" },
      { id: "fade", no: "02", title: "Moderni häivytys", en: "TUNNUSOMAINEN FADE", desc: "Tarkat linjat, pehmeä häivytys ja pitkään siistinä pysyvä muoto.", price: 25, time: "50 min", image: "photo-1653875700322-cf550d9a52ff" },
      { id: "beard", no: "03", title: "Hiustenleikkaus & parta", en: "LEIKKAUS + PARTA", desc: "Huoliteltu hiustenleikkaus, parran muotoilu ja viimeistelty kokonaisuus.", price: 35, time: "65 min", image: "photo-1599011176306-4a96f1516d4d" },
    ]
  },
  en: {
    nav: ["SERVICES", "YOUR VISIT", "BARBERS", "CONTACT"], book: "BOOK APPOINTMENT", location: "BARBERSHOP · TURKU, FINLAND",
    heroTitle: <>Barbering in Turku.<br/><i>Made for you.</i></>, heroText: <>Considered cuts, an unhurried moment, and a style that feels like yours.</>, heroCta: "Book Appointment", heroSecondary: "Explore services & prices", heroPrice: "HAIRCUTS FROM €20", serviceBook: "Book", barberBook: "BOOK THIS BARBER", scroll: "VIEW SERVICES",
    side: <>MORE THAN A HAIRCUT<br/>YOUR CONFIDENCE, REFINED</>, introLabel: "01 / OUR APPROACH", introEyebrow: "TRADITION WITH AN EYE ON WHAT’S NEXT", introTitle: <>A steady hand.<br/><i>An exact feeling.</i></>, introText: "A great haircut changes your posture. Every detail matters, from the first conversation to the final pass of the razor.", meetTeam: "MEET THE BARBERS", made: "MADE WITH INTENTION",
    serviceEyebrow: "01 / SERVICES & PRICES", serviceTitle: <>Choose the cut<br/><i>that fits you.</i></>, serviceNote: <>See the price and duration up front.<br/>Book straight from a service.</>, priceNote: "ALL PRICES IN EUROS", serviceFoot: "CHOOSE A SERVICE AND BOOK", manifestoEyebrow: "DON’T FOLLOW THE SHAPE", manifestoTitle: <>Find<br/><i>your own.</i></>, manifestoText: "We don’t copy references. We listen, look at your features and shape a style that feels like yours.", manifestoCta: "Book your first visit", teamEyebrow: "03 / THE BARBERS", teamTitle: <>Find your<br/><i>barber.</i></>, teamText: <>Stay with someone you know or meet someone new.<br/>Book directly with your preferred barber.</>,
    facts: [{ value: "€20", label: "HAIRCUTS FROM" }, { value: "45–65 min", label: "SERVICE LENGTH" }, { value: "TURKU", label: "FIND US IN" }],
    experienceEyebrow: "02 / HOW YOUR VISIT WORKS", experienceTitle: <>Easy to book.<br/><i>Good to be here.</i></>, experienceText: "Choose a service, barber and time that suit you. In the chair, we start by listening to what you want from your cut.", experienceSteps: [{ title: "Choose a service", text: "See the price and duration before you book." }, { title: "Pick a barber and time", text: "Find the right person and a time that works." }, { title: "Come as you are", text: "We talk through your goals before the cut." }],
    quote: <>“Great style begins<br/><i>with listening.”</i></>, quoteAuthor: "BLADE · TURKU", visitEyebrow: "04 / LOCATION", visitTitle: <>See you<br/><i>in Turku.</i></>, find: "FIND US", route: "GET DIRECTIONS", hours: "APPOINTMENTS", weekdays: "See available times in booking", sunday: "SUNDAY", visitNote: <>GOOD HAIR.<br/><i>GOOD ENERGY.</i></>, footerTagline: "Considered grooming. Turku, Finland.", footerNavTitle: "EXPLORE", socialTitle: "FOLLOW ALONG", footerMade: "MADE WITH CARE", top: "BACK TO TOP",
    step: "STEP", bookingTitles: [<>Choose your<br/><i>service.</i></>, <>Find a<br/><i>good time.</i></>, <>Your<br/><i>details.</i></>], bookingIntro: "Book your visit in under a minute.", chooseService: "CHOOSE A SERVICE", chooseBarber: "CHOOSE A BARBER", date: "DATE", available: "SAMPLE TIMES", next: "Choose a time", confirmTime: "Add your details", backService: "← Back to services", backTime: "← Change time", yourName: "YOUR NAME", namePlaceholder: "What should we call you?", phone: "PHONE NUMBER", finish: "Preview booking", successLabel: "BOOKING PREVIEW", seeYou: "See you soon,", friend: "friend", successText: "This is a booking preview. Booking storage and confirmation messages will be connected later.", great: "Sounds good", close: "Close", barberRoles: ["Senior barber · 8 years", "Barber · 5 years", "Barber · 4 years"], currency: "€", services: [
      { id: "classic", no: "01", title: "Classic Haircut", en: "THE CLASSIC", desc: "A timeless cut, shaped around your hair’s own texture.", price: 20, time: "45 min", image: "photo-1520338661084-680395057c93" },
      { id: "fade", no: "02", title: "Modern Fade", en: "THE SIGNATURE FADE", desc: "Clean geometry, a soft blend and a shape that holds its edge.", price: 25, time: "50 min", image: "photo-1653875700322-cf550d9a52ff" },
      { id: "beard", no: "03", title: "Haircut & Beard", en: "CUT + BEARD", desc: "A considered haircut, precise beard shaping and a polished finish.", price: 35, time: "65 min", image: "photo-1599011176306-4a96f1516d4d" },
    ]
  }
} as const;

const barbers = [
  { name: "Ali Khan", image: "photo-1500648767791-00dcc994a43e" },
  { name: "Marko Levchenko", image: "photo-1506794778202-cad84cf45f1d" },
  { name: "Danylo Savchuk", image: "photo-1507003211169-0a1dd7228f2d" },
];
const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
function Mark({ light = false }: { light?: boolean }) { return <a className={`brand ${light ? "brand-light" : ""}`} href="#top" aria-label="BLADE — home"><span>BLADE</span><small>BARBERSHOP · TURKU</small></a>; }

function LanguageSwitch({ language }: { language: Language }) {
  return <nav className="language-switch" aria-label={language === "fi" ? "Valitse kieli" : "Select language"}><Link href="/" hrefLang="fi-FI" lang="fi" className={language === "fi" ? "active" : ""} aria-current={language === "fi" ? "page" : undefined}>FI</Link><span aria-hidden="true"/><Link href="/en" hrefLang="en-FI" lang="en" className={language === "en" ? "active" : ""} aria-current={language === "en" ? "page" : undefined}>EN</Link></nav>;
}

function CalendarIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="m9 15 2 2 4-4"/></svg>;
}

const bookingCopy = {
  fi: {
    steps: ["Palvelu ja parturi", "Päivä ja aika", "Yhteystiedot"],
    heading: ["Valitse palvelu", "Valitse päivä ja aika", "Viimeistele käyntisi"],
    intro: ["Valitse haluamasi palvelu ja tekijä.", "Valitse kalenterista päivä ja sen jälkeen aika.", "Tarkista tiedot ja jätä yhteystietosi."],
    anyBarber: "Kuka tahansa vapaa parturi", chooseBarber: "Valitse parturi", chooseService: "Valitse palvelu", date: "Valitse päivä", time: "Valitse aika", summary: "Käyntisi tiedot", total: "Hinta", duration: "Kesto", continue: "Jatka päivään ja aikaan", details: "Jatka yhteystietoihin", preview: "Näytä varauksen esikatselu", back: "Takaisin", change: "Muokkaa", notSelected: "Ei vielä valittu", sample: "Esimerkkiaikoja – saatavuus vahvistetaan myöhemmin.", notice: "Tämä on ajanvarauksen esikatselu. Aikaa ei tallenneta eikä vahvisteta.", name: "Nimi", phone: "Puhelinnumero", namePlaceholder: "Etunimi ja sukunimi", phonePlaceholder: "+358 40 123 4567", prevMonth: "Edellinen kuukausi", nextMonth: "Seuraava kuukausi", close: "Sulje", success: "Esikatselu valmis", successText: "Varausta ei vielä lähetetty. Tämä näkymä esittelee tulevaa ajanvarausta.", done: "Valmis", today: "Tänään", unavailable: "Ei valittavissa", selected: "Valittu",
  },
  en: {
    steps: ["Service & barber", "Date & time", "Your details"],
    heading: ["Choose a service", "Choose a date & time", "Your visit details"],
    intro: ["Pick your service and preferred barber.", "Choose a day on the calendar, then a time.", "Review your choices and add your contact details."],
    anyBarber: "Any available barber", chooseBarber: "Choose a barber", chooseService: "Choose a service", date: "Choose a date", time: "Choose a time", summary: "Your visit", total: "Price", duration: "Duration", continue: "Continue to date & time", details: "Continue to your details", preview: "Preview booking", back: "Back", change: "Edit", notSelected: "Not selected yet", sample: "Sample times – live availability will be connected later.", notice: "This is a booking preview. No appointment is saved or confirmed.", name: "Name", phone: "Phone number", namePlaceholder: "First and last name", phonePlaceholder: "+358 40 123 4567", prevMonth: "Previous month", nextMonth: "Next month", close: "Close", success: "Preview complete", successText: "No booking was submitted. This screen demonstrates the future appointment flow.", done: "Done", today: "Today", unavailable: "Unavailable", selected: "Selected",
  },
} as const;

function Booking({ close, initialService, initialBarber, language }: { close: () => void; initialService?: string; initialBarber?: string; language: Language }) {
  const t = content[language];
  const b = bookingCopy[language];
  const dialogRef = useRef<HTMLElement>(null);
  const scrollPosition = useRef(0);
  const [step, setStep] = useState(initialService ? 2 : 1);
  const [service, setService] = useState(initialService ?? "");
  const [barber, setBarber] = useState(initialBarber ?? "any");
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [complete, setComplete] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 3, 0);
  const locale = language === "fi" ? "fi-FI" : "en-GB";
  const format = (value: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options).format(value);
  const chosen = t.services.find((item) => item.id === service);
  const barberName = barber === "any" ? b.anyBarber : barber;
  const firstWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : new Date(month.getFullYear(), month.getMonth(), index - firstWeekday + 1));
  const weekdayNames = Array.from({ length: 7 }, (_, i) => format(new Date(2024, 0, i + 1), { weekday: "short" }).replace(".", "").toUpperCase());
  const currentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
  const finalMonth = month.getFullYear() === lastDay.getFullYear() && month.getMonth() === lastDay.getMonth();
  const changeMonth = (offset: number) => { setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1)); setDay(null); setTime(""); };
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight, overflow: body.style.overflow, rootOverflow: root.style.overflow };
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    scrollPosition.current = window.scrollY;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition.current}px`;
    body.style.width = "100%";
    body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : previous.paddingRight;
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = previous.position; body.style.top = previous.top; body.style.width = previous.width; body.style.paddingRight = previous.paddingRight; body.style.overflow = previous.overflow; root.style.overflow = previous.rootOverflow;
      window.scrollTo(0, scrollPosition.current);
      trigger?.focus();
    };
  }, [close]);
  return <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <motion.section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" tabIndex={-1} className="booking-panel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
      <button type="button" className="modal-close" onClick={close} aria-label={b.close}>×</button>
      {complete ? <div className="booking-success"><span className="success-mark">✓</span><p className="eyebrow">BLADE · {b.success}</p><h2 id="booking-title">{language === "fi" ? "Nähdään pian," : "See you soon,"}<br/><i>{name.trim().split(" ")[0]}.</i></h2><p>{b.successText}</p><div className="booking-preview-card"><div><span>{b.chooseService}</span><strong>{chosen?.title}</strong></div><div><span>{b.chooseBarber}</span><strong>{barberName}</strong></div><div><span>{b.date} · {b.time}</span><strong>{day ? format(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""} · {time}</strong></div><div><span>{b.total}</span><strong>{chosen?.price} €</strong></div></div><button type="button" className="button button-accent" onClick={close}>{b.done}</button></div> : <>
        <div className="booking-heading"><p className="eyebrow">BLADE · {t.step} {step} / 3</p><h2 id="booking-title">{b.heading[step - 1]}</h2><p>{b.intro[step - 1]}</p></div>
        <ol className="booking-progress" aria-label={language === "fi" ? "Varauksen vaiheet" : "Booking steps"}>{b.steps.map((label, index) => <li key={label} className={step === index + 1 ? "current" : step > index + 1 ? "done" : ""} aria-current={step === index + 1 ? "step" : undefined}><span>{step > index + 1 ? "✓" : `0${index + 1}`}</span><strong>{label}</strong></li>)}</ol>
        <div className="booking-body"><div className="booking-primary">
          {step === 1 && <div className="booking-form"><fieldset><legend className="field-label">01 / {b.chooseService}</legend><div className="service-options">{t.services.map((item) => <button type="button" key={item.id} aria-pressed={service === item.id} className={`service-option ${service === item.id ? "selected" : ""}`} onClick={() => { setService(item.id); setDay(null); setTime(""); }}><span><strong>{item.title}</strong><small>{item.time}</small></span><b>{item.price} €</b><span className="choice-mark" aria-hidden="true">{service === item.id ? "✓" : ""}</span></button>)}</div></fieldset><fieldset><legend className="field-label">02 / {b.chooseBarber}</legend><div className="barber-options"><button type="button" aria-pressed={barber === "any"} className={`barber-option ${barber === "any" ? "selected" : ""}`} onClick={() => { setBarber("any"); setDay(null); setTime(""); }}><span className="barber-monogram">✳</span><span>{b.anyBarber}</span><span className="choice-mark" aria-hidden="true">{barber === "any" ? "✓" : ""}</span></button>{barbers.map((person) => <button type="button" key={person.name} aria-pressed={barber === person.name} className={`barber-option ${barber === person.name ? "selected" : ""}`} onClick={() => { setBarber(person.name); setDay(null); setTime(""); }}><Image src={photo(person.image, 120)} width={40} height={40} sizes="40px" alt=""/><span>{person.name}</span><span className="choice-mark" aria-hidden="true">{barber === person.name ? "✓" : ""}</span></button>)}</div></fieldset><button type="button" className="button button-accent booking-next" disabled={!service} onClick={() => setStep(2)}>{b.continue}<CalendarIcon size={18}/></button></div>}
          {step === 2 && <div className="booking-form"><div className="field-label">01 / {b.date}</div><div className="calendar"><div className="calendar-toolbar"><strong>{format(month, { month: "long", year: "numeric" })}</strong><div><button type="button" onClick={() => changeMonth(-1)} disabled={currentMonth} aria-label={b.prevMonth}>‹</button><button type="button" onClick={() => changeMonth(1)} disabled={finalMonth} aria-label={b.nextMonth}>›</button></div></div><div className="calendar-weekdays">{weekdayNames.map((label, index) => <span key={index}>{label}</span>)}</div><div className="calendar-days">{calendarDays.map((date, index) => date ? <button type="button" key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`} disabled={date < today || date > lastDay} aria-label={format(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} aria-pressed={Boolean(day && date.getTime() === day.getTime())} className={`${date.getTime() === today.getTime() ? "today" : ""} ${day && date.getTime() === day.getTime() ? "selected" : ""}`} onClick={() => { setDay(date); setTime(""); }}><span>{date.getDate()}</span></button> : <span key={`empty-${index}`} aria-hidden="true"/>)}</div></div><div className="field-label time-label">02 / {b.time}</div>{day ? <><p className="selected-date"><CalendarIcon size={16}/>{format(day, { weekday: "long", day: "numeric", month: "long" })}</p><div className="time-options">{["10:00", "11:30", "12:00", "14:30", "16:00", "17:30"].map((slot) => <button type="button" key={slot} aria-pressed={time === slot} className={`time-option ${time === slot ? "selected" : ""}`} onClick={() => setTime(slot)}>{slot}</button>)}</div><p className="booking-disclaimer">{b.sample}</p></> : <p className="time-empty">{language === "fi" ? "Valitse ensin päivä kalenterista." : "Select a day on the calendar to see times."}</p>}<div className="booking-navigation"><button type="button" className="back-link" onClick={() => setStep(1)}>{b.back}</button><button type="button" className="button button-accent booking-next" disabled={!day || !time} onClick={() => setStep(3)}>{b.details}</button></div></div>}
          {step === 3 && <form className="booking-form booking-contact" onSubmit={(event) => { event.preventDefault(); if (name.trim() && phone.trim().length >= 6) setComplete(true); }}><label className="field-label" htmlFor="guest-name">{b.name}</label><input id="guest-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder={b.namePlaceholder} required minLength={2}/><label className="field-label" htmlFor="guest-phone">{b.phone}</label><input id="guest-phone" autoComplete="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder={b.phonePlaceholder} type="tel" required minLength={6}/><p className="booking-disclaimer booking-notice">{b.notice}</p><div className="booking-navigation"><button type="button" className="back-link" onClick={() => setStep(2)}>{b.back}</button><button className="button button-accent booking-next" type="submit">{b.preview}<CalendarIcon size={18}/></button></div></form>}
        </div><aside className="booking-recap" aria-label={b.summary}><p className="eyebrow">{b.summary}</p><dl><div><dt>{b.chooseService}</dt><dd>{chosen?.title ?? b.notSelected}</dd></div><div><dt>{b.chooseBarber}</dt><dd>{barberName}</dd></div><div><dt>{b.date}</dt><dd>{day ? format(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : b.notSelected}</dd></div><div><dt>{b.time}</dt><dd>{time || b.notSelected}</dd></div></dl><div className="booking-recap-total"><span>{b.total}</span><strong>{chosen ? `${chosen.price} €` : "—"}</strong></div><p className="booking-recap-note">{b.notice}</p></aside></div>
      </>}
    </motion.section>
  </motion.div>;
}

export default function Home({ language }: { language: Language }) {
  const [booking, setBooking] = useState(false);
  const [bookService, setBookService] = useState<string>();
  const [bookBarber, setBookBarber] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const t = content[language];
  const reveal = reducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.18 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } };
  const openBooking = (id?: string, barberName?: string) => { setBookService(id); setBookBarber(barberName); setBooking(true); };
  return <div id="top">
    <header className="site-header"><Mark/><nav className={menuOpen ? "nav-open" : ""}><a href="#services" onClick={() => setMenuOpen(false)}>{t.nav[0]}</a><a href="#experience" onClick={() => setMenuOpen(false)}>{t.nav[1]}</a><a href="#team" onClick={() => setMenuOpen(false)}>{t.nav[2]}</a><a href="#visit" onClick={() => setMenuOpen(false)}>{t.nav[3]}</a><button className="mobile-book" onClick={() => { setMenuOpen(false); openBooking(); }}>{t.book}<CalendarIcon size={17}/></button></nav><div className="header-actions"><LanguageSwitch language={language}/><button className="header-book" onClick={() => openBooking()}>{t.book}<CalendarIcon size={17}/></button></div><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t.close : language === "fi" ? "Avaa valikko" : "Open menu"}>{menuOpen ? "×" : "☰"}</button></header>
    <main>
    <section className="hero"><div className="hero-image"><Image src={photo("photo-1503951914875-452162b0f3f1", 1920)} alt={language === "fi" ? "Parturi leikkaa hiuksia Turussa" : "Barber cutting hair in Turku"} fill priority sizes="100vw"/></div><div className="hero-grain"/><div className="hero-content"><p className="eyebrow hero-eyebrow"><span/> {t.location}</p><h1>{t.heroTitle}</h1><p className="hero-sub">{t.heroText}</p><div className="hero-actions"><button className="button button-cream" onClick={() => openBooking()}>{t.heroCta}<CalendarIcon size={18}/></button></div><p className="hero-price">{t.heroPrice}</p></div><div className="hero-vertical">TURKU&nbsp; · &nbsp;FINLAND</div><div className="hero-bottom"><span>01 — 04</span><span>{t.scroll}</span><span className="scroll-line"/></div><div className="hero-side-note">{t.side}</div></section>
    <aside className="quick-facts section-wrap" aria-label={language === "fi" ? "Tärkeimmät tiedot" : "At a glance"}>{t.facts.map((fact) => <div className="quick-fact" key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</aside>
    <section className="services section-wrap" id="services"><motion.div {...reveal} className="section-heading"><div><p className="eyebrow">{t.serviceEyebrow}</p><h2>{t.serviceTitle}</h2></div><p>{t.serviceNote}</p></motion.div><div className="service-list">{t.services.map((item, i) => <motion.article key={item.id} {...reveal} className="service-card" style={{ "--card-index": i } as React.CSSProperties}><div className="service-card-image"><Image src={photo(item.image, 950)} alt={language === "fi" ? `${item.title} – parturityö Turussa` : `${item.title} – barber service in Turku`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 33vw, 26vw"/></div><div className="service-card-shade"/><div className="service-meta"><span>{item.no} / {item.en}</span><span>{item.time}</span></div><div className="service-info"><div><h3>{item.title}</h3><p>{item.desc}</p></div><div className="service-action"><strong>{item.price}<small> {t.currency}</small></strong><button aria-label={`${t.book}: ${item.title}`} onClick={() => openBooking(item.id)}><span>{t.serviceBook}</span><CalendarIcon size={17}/></button></div></div></motion.article>)}</div><div className="services-foot"><span>{t.priceNote}</span><span>{t.serviceFoot} <b>✳</b></span></div></section>
    <section className="experience section-wrap" id="experience"><motion.div {...reveal} className="experience-copy"><p className="eyebrow">{t.experienceEyebrow}</p><h2>{t.experienceTitle}</h2><p className="experience-intro">{t.experienceText}</p><div className="experience-steps">{t.experienceSteps.map((item, i) => <div className="experience-step" key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div><button className="button button-cream" onClick={() => openBooking()}>{t.book}<CalendarIcon size={18}/></button></motion.div><motion.div {...reveal} className="experience-visual"><Image src={photo("photo-1599351431202-1e0f0137899a", 1200)} width={1200} height={1400} sizes="(max-width: 700px) 100vw, 42vw" alt={language === "fi" ? "Parturiliikkeen tunnelma" : "Barbershop atmosphere"}/><span>BLADE · TURKU</span></motion.div></section>
    <section className="team section-wrap" id="team"><motion.div {...reveal} className="section-heading team-heading"><div><p className="eyebrow">{t.teamEyebrow}</p><h2>{t.teamTitle}</h2></div><p>{t.teamText}</p></motion.div><div className="team-grid">{barbers.map((person, i) => <motion.article key={person.name} {...reveal} className="team-card"><div className="team-photo"><Image src={photo(person.image, 700)} width={700} height={800} sizes="(max-width: 700px) 100vw, 25vw" alt={person.name}/><span>0{i + 1}</span></div><div className="team-caption"><div><h3>{person.name}</h3><p>{t.barberRoles[i]}</p></div><button onClick={() => openBooking(undefined, person.name)} aria-label={`${t.barberBook}: ${person.name}`}><span>{t.serviceBook}</span><CalendarIcon size={17}/></button></div></motion.article>)}</div></section>
    <section className="visit section-wrap" id="visit"><div className="visit-main"><p className="eyebrow">{t.visitEyebrow}</p><h2>{t.visitTitle}</h2><button className="button button-dark" onClick={() => openBooking()}>{t.book}<CalendarIcon size={18}/></button></div><div className="visit-details"><div><span className="eyebrow">{t.find}</span><p>{business.address && business.postalCode ? <>{business.address}<br/>{business.postalCode} Turku<br/>Finland</> : <>Turku<br/>Finland</>}</p>{business.phone && <a href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}>{business.phone}</a>}</div><div><span className="eyebrow">{t.hours}</span><p>{t.weekdays}</p></div></div></section>
    </main>
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand"><Mark light/><p>{t.footerTagline}</p></div>
        <div className="footer-nav"><span className="footer-label">{t.footerNavTitle}</span><a href="#services">{t.nav[0]}</a><a href="#experience">{t.nav[1]}</a><a href="#team">{t.nav[2]}</a><a href="#visit">{t.nav[3]}</a></div>
        <div className="footer-social"><span className="footer-label">{t.socialTitle}</span><div className="social-icons" aria-label={t.socialTitle}>
          <span className="social-icon" role="img" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle className="social-dot" cx="17.7" cy="6.6" r="1"/></svg></span>
          <span className="social-icon" role="img" aria-label="TikTok" title="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.15a4.05 4.05 0 1 1-3.4-4V13a1.9 1.9 0 1 0 1.45 1.85V3h3.05c.25 2.1 1.65 3.8 3.9 4.2v3.05A8.4 8.4 0 0 1 14 8.1"/></svg></span>
          <span className="social-icon" role="img" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.1 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.55-1.5h1.65V3.6c-.8-.08-1.6-.13-2.4-.13-2.4 0-4.05 1.45-4.05 4.2v2.23H8.15V13h2.7v8z"/></svg></span>
        </div><p className="footer-social-note">Turku · Finland</p></div>
      </div>
      <div className="footer-bottom"><span>© BLADE BARBERSHOP 2026</span><span>{t.footerMade}</span><a href="#top">{t.top}</a></div>
    </footer>
    <AnimatePresence>{booking && <Booking key="booking" close={() => setBooking(false)} initialService={bookService} initialBarber={bookBarber} language={language}/>}</AnimatePresence>
  </div>;
}
