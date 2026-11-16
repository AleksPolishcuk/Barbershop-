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
    heroTitle: <>Parturi Turussa.<br/><i>Sinun tyylilläsi.</i></>, heroText: <>Tarkat leikkaukset, rauhallinen hetki ja tyyli, joka tuntuu omalta.</>, heroCta: "Varaa aika", heroSecondary: "Katso palvelut ja hinnat", heroPrice: "HIUSTENLEIKKAUKSET ALK. 20 €", serviceBook: "VARAA", barberBook: "VARAA AIKA", scroll: "KATSO PALVELUT",
    side: <>EI VAIN HIUSTENLEIKKAUS<br/>VAAN VARMUUTTA OMAAN TYYLIIN</>, introLabel: "01 / MEIDÄN TYYLIMME", introEyebrow: "PERINNETTÄ, JOKA KATSOO ETEENPÄIN", introTitle: <>Tarkka kädenjälki.<br/><i>Varmalla otteella.</i></>, introText: "Hyvä hiustenleikkaus muuttaa ryhtiä. Siksi jokaisella yksityiskohdalla on väliä: ensikonsultaatiosta partaveitsen viimeiseen vetoon.", meetTeam: "TUTUSTU PARTUREIHIN", made: "HARKITEN TEHTY",
    serviceEyebrow: "01 / PALVELUT JA HINNAT", serviceTitle: <>Valitse sinulle<br/><i>sopiva leikkaus.</i></>, serviceNote: <>Hinta ja kesto näkyvät heti.<br/>Varaa suoraan haluamasi palvelu.</>, priceNote: "HINNAT EUROINA", serviceFoot: "VALITSE PALVELU JA VARAA AIKA", manifestoEyebrow: "ÄLÄ SEURAA MUOTIA", manifestoTitle: <>Löydä<br/><i>oma tyylisi.</i></>, manifestoText: "Emme kopioi esikuvia. Kuuntelemme sinua, huomioimme kasvonpiirteesi ja löydämme juuri sinulle sopivan tyylin.", manifestoCta: "Varaa ensimmäinen käynti", teamEyebrow: "03 / PARTURIT", teamTitle: <>Valitse oma<br/><i>parturisi.</i></>, teamText: <>Valitse tuttu tekijä tai tutustu uuteen.<br/>Varaa aika suoraan haluamallesi parturille.</>,
    facts: [{ value: "20 €", label: "LEIKKAUKSET ALKAEN" }, { value: "45–65 min", label: "PALVELUN KESTO" }, { value: "TURKU", label: "LÖYDÄT MEIDÄT" }],
    experienceEyebrow: "02 / NÄIN KÄYNTI ETENEE", experienceTitle: <>Helppo varata.<br/><i>Hyvä tulla.</i></>, experienceText: "Valitse palvelu, parturi ja sinulle sopiva aika. Paikan päällä aloitamme kuuntelemalla, mitä toivot hiuksiltasi.", experienceSteps: [{ title: "Valitse palvelu", text: "Näet hinnan ja keston ennen kuin varaat." }, { title: "Valitse parturi ja aika", text: "Löydä sinulle sopiva tekijä ja ajankohta." }, { title: "Tule omana itsenäsi", text: "Käymme toiveesi läpi ennen leikkausta." }],
    quote: <>“Hyvä tyyli alkaa siitä,<br/><i>että sinua kuunnellaan.”</i></>, quoteAuthor: "BLADE · TURKU", visitEyebrow: "04 / SIJAINTI", visitTitle: <>Nähdään<br/><i>Turussa.</i></>, find: "LÖYDÄ MEIDÄT", route: "REITTI KARTALLA", hours: "AJANVARAUS", weekdays: "Ajat näkyvät varausnäkymässä", sunday: "SUNNUNTAI", visitNote: <>HYVÄT HIUKSET.<br/><i>HYVÄ FIILIS.</i></>, footerTagline: "Parturipalveluita harkiten. Turku, Suomi.", footerNavTitle: "TUTUSTU", socialTitle: "SEURAA MEITÄ", footerMade: "HUOLELLA VIIMEISTELTY", top: "YLÖS ↑",
    step: "VAIHE", bookingTitles: [<>Valitse<br/><i>palvelu.</i></>, <>Valitse<br/><i>sopiva aika.</i></>, <>Lisää<br/><i>yhteystiedot.</i></>], bookingIntro: "Varaat ajan alle minuutissa.", chooseService: "VALITSE PALVELU", chooseBarber: "PARTURI", date: "PÄIVÄ", available: "ESIMERKKIAJAT", next: "Valitse aika", confirmTime: "Lisää yhteystiedot", backService: "← Takaisin palveluihin", backTime: "← Vaihda aikaa", yourName: "NIMESI", namePlaceholder: "Millä nimellä varaamme?", phone: "PUHELINNUMERO", finish: "Näytä varaus", successLabel: "VARAUKSEN ESIMERKKI", seeYou: "Nähdään pian,", friend: "ystävä", successText: "Tämä on varausnäkymän esikatselu. Vahvistusviestit ja tallennetut varaukset lisätään myöhemmin.", great: "Selvä", close: "Sulje", barberRoles: ["Vastaava parturi · 8 vuotta", "Parturi · 5 vuotta", "Parturi · 4 vuotta"], currency: "€", services: [
      { id: "classic", no: "01", title: "Klassinen hiustenleikkaus", en: "KLASSINEN LEIKKAUS", desc: "Ajaton muoto ja hiustesi tekstuuriin sopiva yksilöllinen viimeistely.", price: 20, time: "45 min", image: "photo-1520338661084-680395057c93" },
      { id: "fade", no: "02", title: "Moderni häivytys", en: "TUNNUSOMAINEN FADE", desc: "Tarkat linjat, pehmeä häivytys ja pitkään siistinä pysyvä muoto.", price: 25, time: "50 min", image: "photo-1653875700322-cf550d9a52ff" },
      { id: "beard", no: "03", title: "Hiustenleikkaus & parta", en: "LEIKKAUS + PARTA", desc: "Huoliteltu hiustenleikkaus, parran muotoilu ja viimeistelty kokonaisuus.", price: 35, time: "65 min", image: "photo-1599011176306-4a96f1516d4d" },
    ]
  },
  en: {
    nav: ["SERVICES", "YOUR VISIT", "BARBERS", "CONTACT"], book: "BOOK A VISIT", location: "BARBERSHOP · TURKU, FINLAND",
    heroTitle: <>Barbering in Turku.<br/><i>Made for you.</i></>, heroText: <>Considered cuts, an unhurried moment, and a style that feels like yours.</>, heroCta: "Book an appointment", heroSecondary: "Explore services & prices", heroPrice: "HAIRCUTS FROM €20", serviceBook: "BOOK", barberBook: "BOOK THIS BARBER", scroll: "VIEW SERVICES",
    side: <>MORE THAN A HAIRCUT<br/>YOUR CONFIDENCE, REFINED</>, introLabel: "01 / OUR APPROACH", introEyebrow: "TRADITION WITH AN EYE ON WHAT’S NEXT", introTitle: <>A steady hand.<br/><i>An exact feeling.</i></>, introText: "A great haircut changes your posture. Every detail matters, from the first conversation to the final pass of the razor.", meetTeam: "MEET THE BARBERS", made: "MADE WITH INTENTION",
    serviceEyebrow: "01 / SERVICES & PRICES", serviceTitle: <>Choose the cut<br/><i>that fits you.</i></>, serviceNote: <>See the price and duration up front.<br/>Book straight from a service.</>, priceNote: "ALL PRICES IN EUROS", serviceFoot: "CHOOSE A SERVICE AND BOOK", manifestoEyebrow: "DON’T FOLLOW THE SHAPE", manifestoTitle: <>Find<br/><i>your own.</i></>, manifestoText: "We don’t copy references. We listen, look at your features and shape a style that feels like yours.", manifestoCta: "Book your first visit", teamEyebrow: "03 / THE BARBERS", teamTitle: <>Find your<br/><i>barber.</i></>, teamText: <>Stay with someone you know or meet someone new.<br/>Book directly with your preferred barber.</>,
    facts: [{ value: "€20", label: "HAIRCUTS FROM" }, { value: "45–65 min", label: "SERVICE LENGTH" }, { value: "TURKU", label: "FIND US IN" }],
    experienceEyebrow: "02 / HOW YOUR VISIT WORKS", experienceTitle: <>Easy to book.<br/><i>Good to be here.</i></>, experienceText: "Choose a service, barber and time that suit you. In the chair, we start by listening to what you want from your cut.", experienceSteps: [{ title: "Choose a service", text: "See the price and duration before you book." }, { title: "Pick a barber and time", text: "Find the right person and a time that works." }, { title: "Come as you are", text: "We talk through your goals before the cut." }],
    quote: <>“Great style begins<br/><i>with listening.”</i></>, quoteAuthor: "BLADE · TURKU", visitEyebrow: "04 / LOCATION", visitTitle: <>See you<br/><i>in Turku.</i></>, find: "FIND US", route: "GET DIRECTIONS", hours: "APPOINTMENTS", weekdays: "See available times in booking", sunday: "SUNDAY", visitNote: <>GOOD HAIR.<br/><i>GOOD ENERGY.</i></>, footerTagline: "Considered grooming. Turku, Finland.", footerNavTitle: "EXPLORE", socialTitle: "FOLLOW ALONG", footerMade: "MADE WITH CARE", top: "BACK TO TOP ↑",
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

function Booking({ close, initialService, initialBarber, language }: { close: () => void; initialService?: string; initialBarber?: string; language: Language }) {
  const t = content[language];
  const scrollPosition = useRef(0);
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      overflow: body.style.overflow,
      rootOverflow: root.style.overflow,
    };
    scrollPosition.current = window.scrollY;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    body.style.position = "fixed";
    body.style.top = `-${scrollPosition.current}px`;
    body.style.width = "100%";
    body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : previous.paddingRight;
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      body.style.overflow = previous.overflow;
      root.style.overflow = previous.rootOverflow;
      window.scrollTo(0, scrollPosition.current);
    };
  }, []);
  const [step, setStep] = useState(initialService ? 2 : 1);
  const [service, setService] = useState(initialService ?? "classic");
  const [barber, setBarber] = useState(initialBarber ?? barbers[0].name);
  const [date, setDate] = useState(0);
  const [upcomingDates, setUpcomingDates] = useState<Date[]>([]);
  useEffect(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    setUpcomingDates(Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      return day;
    }));
  }, []);
  const [time, setTime] = useState("12:00");
  const [complete, setComplete] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const chosen = t.services.find((item) => item.id === service)!;
  const dateLocale = language === "fi" ? "fi-FI" : "en-GB";
  const formatDate = (value: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(dateLocale, options).format(value);
  return <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
    <motion.section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="booking-panel" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      <button className="modal-close" onClick={close} aria-label={t.close}>×</button>
      {complete ? <div className="booking-success"><span className="success-mark">✓</span><p className="eyebrow">{t.successLabel}</p><h2 id="booking-title">{t.seeYou}<br/><i>{name || t.friend}.</i></h2><p>{t.successText}</p><button className="button button-dark" onClick={close}>{t.great} <span>→</span></button></div> : <>
        <div className="booking-heading"><p className="eyebrow">{t.step} {step} / 3</p><h2 id="booking-title">{t.bookingTitles[step - 1]}</h2><p>{t.bookingIntro}</p></div>
        <div className="steps-line"><span className={step >= 1 ? "active" : ""}/><span className={step >= 2 ? "active" : ""}/><span className={step >= 3 ? "active" : ""}/></div>
        {step === 1 && <div className="booking-form"><label className="field-label">{t.chooseService}</label><div className="service-options">{t.services.map((item) => <button key={item.id} className={`service-option ${service === item.id ? "selected" : ""}`} onClick={() => setService(item.id)}><span><strong>{item.title}</strong><small>{item.time}</small></span><b>{item.price} {t.currency}</b></button>)}</div><label className="field-label">{t.chooseBarber}</label><div className="barber-options">{barbers.map((person) => <button onClick={() => setBarber(person.name)} className={`barber-option ${barber === person.name ? "selected" : ""}`} key={person.name}><Image src={photo(person.image, 120)} width={120} height={120} sizes="25px" alt=""/><span>{person.name}</span><small>{barber === person.name ? "✓" : "＋"}</small></button>)}</div><button className="button button-dark full" onClick={() => setStep(2)}>{t.next} <span>→</span></button></div>}
        {step === 2 && <div className="booking-form"><label className="field-label">{t.date}{upcomingDates[date] && ` · ${formatDate(upcomingDates[date], { month: "long", year: "numeric" })}`}</label><div className="date-options">{upcomingDates.map((day, i) => <button key={day.toISOString()} className={`date-option ${date === i ? "selected" : ""}`} onClick={() => setDate(i)}><small>{formatDate(day, { weekday: "short" }).replace(".", "").toUpperCase()}</small><b>{formatDate(day, { day: "numeric" })}</b></button>)}</div><label className="field-label">{t.available}</label><div className="time-options">{["10:00", "11:30", "12:00", "14:30", "16:00", "17:30"].map((slot) => <button key={slot} className={`time-option ${time === slot ? "selected" : ""}`} onClick={() => setTime(slot)}>{slot}</button>)}</div><div className="booking-summary"><span>{chosen.title} · {barber}</span><b>{chosen.price} {t.currency}</b></div><button className="button button-dark full" onClick={() => setStep(3)}>{t.confirmTime} <span>→</span></button><button className="back-link" onClick={() => setStep(1)}>{t.backService}</button></div>}
        {step === 3 && <form className="booking-form" onSubmit={(e) => { e.preventDefault(); setComplete(true); }}><label className="field-label" htmlFor="guest-name">{t.yourName}</label><input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} required/><label className="field-label" htmlFor="guest-phone">{t.phone}</label><input id="guest-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+358 00 000 0000" type="tel" required/><div className="booking-summary"><span>{upcomingDates[date] && formatDate(upcomingDates[date], { day: "numeric", month: "long" })} · {time}<br/>{chosen.title} · {barber}</span><b>{chosen.price} {t.currency}</b></div><button className="button button-dark full" type="submit">{t.finish} <span>→</span></button><button type="button" className="back-link" onClick={() => setStep(2)}>{t.backTime}</button></form>}
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
    <header className="site-header"><Mark/><nav className={menuOpen ? "nav-open" : ""}><a href="#services" onClick={() => setMenuOpen(false)}>{t.nav[0]}</a><a href="#experience" onClick={() => setMenuOpen(false)}>{t.nav[1]}</a><a href="#team" onClick={() => setMenuOpen(false)}>{t.nav[2]}</a><a href="#visit" onClick={() => setMenuOpen(false)}>{t.nav[3]}</a><button className="mobile-book" onClick={() => { setMenuOpen(false); openBooking(); }}>{t.book} →</button></nav><div className="header-actions"><LanguageSwitch language={language}/><button className="header-book" onClick={() => openBooking()}>{t.book} <span>→</span></button></div><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t.close : language === "fi" ? "Avaa valikko" : "Open menu"}>{menuOpen ? "×" : "☰"}</button></header>
    <main>
    <section className="hero"><div className="hero-image"><Image src={photo("photo-1503951914875-452162b0f3f1", 1920)} alt={language === "fi" ? "Parturi leikkaa hiuksia Turussa" : "Barber cutting hair in Turku"} fill priority sizes="100vw"/></div><div className="hero-grain"/><div className="hero-content"><p className="eyebrow hero-eyebrow"><span/> {t.location}</p><h1>{t.heroTitle}</h1><p className="hero-sub">{t.heroText}</p><div className="hero-actions"><button className="button button-cream" onClick={() => openBooking()}>{t.heroCta} <span>→</span></button><a className="hero-secondary" href="#services">{t.heroSecondary} <span>→</span></a></div><p className="hero-price">{t.heroPrice}</p></div><div className="hero-vertical">TURKU&nbsp; · &nbsp;FINLAND</div><div className="hero-bottom"><span>01 — 04</span><span>{t.scroll}</span><span className="scroll-line"/></div><div className="hero-side-note">{t.side}</div></section>
    <aside className="quick-facts section-wrap" aria-label={language === "fi" ? "Tärkeimmät tiedot" : "At a glance"}>{t.facts.map((fact) => <div className="quick-fact" key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</aside>
    <section className="services section-wrap" id="services"><motion.div {...reveal} className="section-heading"><div><p className="eyebrow">{t.serviceEyebrow}</p><h2>{t.serviceTitle}</h2></div><p>{t.serviceNote}</p></motion.div><div className="service-list">{t.services.map((item, i) => <motion.article key={item.id} {...reveal} className="service-card" style={{ "--card-index": i } as React.CSSProperties}><div className="service-card-image"><Image src={photo(item.image, 950)} alt={language === "fi" ? `${item.title} – parturityö Turussa` : `${item.title} – barber service in Turku`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 33vw, 26vw"/></div><div className="service-card-shade"/><div className="service-meta"><span>{item.no} / {item.en}</span><span>{item.time}</span></div><div className="service-info"><div><h3>{item.title}</h3><p>{item.desc}</p></div><div className="service-action"><strong>{item.price}<small> {t.currency}</small></strong><button aria-label={`${t.book}: ${item.title}`} onClick={() => openBooking(item.id)}><span>{t.serviceBook}</span><b>→</b></button></div></div></motion.article>)}</div><div className="services-foot"><span>{t.priceNote}</span><span>{t.serviceFoot} <b>✳</b></span></div></section>
    <section className="experience section-wrap" id="experience"><motion.div {...reveal} className="experience-copy"><p className="eyebrow">{t.experienceEyebrow}</p><h2>{t.experienceTitle}</h2><p className="experience-intro">{t.experienceText}</p><div className="experience-steps">{t.experienceSteps.map((item, i) => <div className="experience-step" key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div><button className="button button-cream" onClick={() => openBooking()}>{t.book} <span>→</span></button></motion.div><motion.div {...reveal} className="experience-visual"><Image src={photo("photo-1599351431202-1e0f0137899a", 1200)} width={1200} height={1400} sizes="(max-width: 700px) 100vw, 42vw" alt={language === "fi" ? "Parturiliikkeen tunnelma" : "Barbershop atmosphere"}/><span>BLADE · TURKU</span></motion.div></section>
    <section className="team section-wrap" id="team"><motion.div {...reveal} className="section-heading team-heading"><div><p className="eyebrow">{t.teamEyebrow}</p><h2>{t.teamTitle}</h2></div><p>{t.teamText}</p></motion.div><div className="team-grid">{barbers.map((person, i) => <motion.article key={person.name} {...reveal} className="team-card"><div className="team-photo"><Image src={photo(person.image, 700)} width={700} height={800} sizes="(max-width: 700px) 100vw, 25vw" alt={person.name}/><span>0{i + 1}</span></div><div className="team-caption"><div><h3>{person.name}</h3><p>{t.barberRoles[i]}</p></div><button onClick={() => openBooking(undefined, person.name)} aria-label={`${t.barberBook}: ${person.name}`}><span>{t.serviceBook}</span><b>→</b></button></div></motion.article>)}</div></section>
    <section className="visit section-wrap" id="visit"><div className="visit-main"><p className="eyebrow">{t.visitEyebrow}</p><h2>{t.visitTitle}</h2><button className="button button-dark" onClick={() => openBooking()}>{t.book} <span>→</span></button></div><div className="visit-details"><div><span className="eyebrow">{t.find}</span><p>{business.address && business.postalCode ? <>{business.address}<br/>{business.postalCode} Turku<br/>Finland</> : <>Turku<br/>Finland</>}</p>{business.phone && <a href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}>{business.phone}</a>}</div><div><span className="eyebrow">{t.hours}</span><p>{t.weekdays}</p></div></div></section>
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
