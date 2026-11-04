"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, TouchEvent } from "react";
import { invitation, pageNames } from "./invitation-data";

type Stage = "cover" | "butterfly" | "birds" | "invitation";
type Point = { x: number; y: number };

const BIRD_COUNT = 13;
const BIRD_FLIGHT_MS = 2700;
const BUTTERFLY_MS = 920;

const birds = Array.from({ length: BIRD_COUNT }, (_, id) => {
  const layer = id % 3;
  return {
    id,
    // Fixed values avoid hydration mismatches while still giving staggered natural flight.
    y: [9, 71, 34, 53, 20, 79, 45, 11, 61, 33, 88, 55, 23][id],
    delay: [40, 290, 165, 500, 780, 670, 400, 900, 1090, 800, 1080, 1240, 1430][id],
    duration: [1880, 2110, 2020, 2280, 1850, 2300, 1730, 1950, 2290, 1850, 2010, 2180, 1930][id],
    size: [0.72, 1.1, 0.55, 0.8, 1.4, 0.61, 1.16, 0.58, 1.35, 0.9, 0.65, 1.25, 1.5][id],
    drift: [-12, -17, 13, -23, 3, 18, -8, 10, -11, 17, -19, 5, -12][id],
    rotate: [-8, 9, -16, 6, -5, 13, -11, 8, -4, -13, 10, 2, -7][id],
    opacity: layer === 0 ? 0.84 : layer === 1 ? 1 : 0.72,
    depth: layer,
  };
});

function Bloom({ side, small = false }: { side: "left" | "right"; small?: boolean }) {
  return (
    <svg className={`bloom bloom--${side} ${small ? "bloom--small" : ""}`} aria-hidden="true" viewBox="0 0 280 290" fill="none">
      <path d="M-10 260C70 210 81 117 160 86C199 72 248 41 282 12" stroke="#788b65" strokeWidth="2.5" />
      <path d="M70 202C38 153 12 159 11 179C35 208 55 212 70 202Z" fill="#96a785" />
      <path d="M121 119C100 76 114 59 134 67C138 92 131 107 121 119Z" fill="#87a27e" />
      <path d="M196 61C190 27 202 15 220 20C221 42 214 53 196 61Z" fill="#95ad89" />
      <path d="M175 83C202 96 215 111 206 123C184 115 177 102 175 83Z" fill="#a2b58a" />
      <g transform="translate(100 145)">
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-30" rx="19" ry="35" transform={`rotate(${i * 72})`} fill="#f2c9c9" stroke="#dfa8ac" strokeWidth="1" />)}
        <circle r="14" fill="#e0aa69" /><circle r="7" fill="#f4d7a0" />
      </g>
      <g transform="translate(222 54) scale(.63)">
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-30" rx="17" ry="34" transform={`rotate(${i * 72})`} fill="#fff8f0" stroke="#eadad0" strokeWidth="1" />)}
        <circle r="13" fill="#e0b37b" />
      </g>
      <g transform="translate(43 235) scale(.50)">
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-30" rx="18" ry="36" transform={`rotate(${i * 72})`} fill="#fff5df" />)}
        <circle r="14" fill="#deb66f" />
      </g>
      <circle cx="143" cy="100" r="6" fill="#e8bac0" /><circle cx="165" cy="82" r="5" fill="#d7a7b0" />
    </svg>
  );
}

function Monogram({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`monogram ${compact ? "monogram--compact" : ""}`} aria-label="A and S">
      <span>A</span><span className="monogram-heart" aria-hidden="true">♥<span className="monogram-amp">&amp;</span></span><span>S</span>
    </span>
  );
}

function Butterfly() {
  return (
    <div className="butterfly-motion" aria-hidden="true">
      <i className="butterfly-spark butterfly-spark--1" /><i className="butterfly-spark butterfly-spark--2" /><i className="butterfly-spark butterfly-spark--3" />
      <svg viewBox="0 0 120 110" className="butterfly-svg" fill="none" focusable="false">
        <defs>
          <linearGradient id="bf-wing" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff1e5"/><stop offset=".48" stopColor="#f1b9c5"/><stop offset="1" stopColor="#c68191"/></linearGradient>
          <linearGradient id="bf-wing-low" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ffefd4"/><stop offset="1" stopColor="#e6ac7e"/></linearGradient>
        </defs>
        <g className="butterfly-left">
          <path d="M59 54C42 10 13 12 8 32C5 51 22 68 58 59Z" fill="url(#bf-wing)" stroke="#a67a80" strokeWidth="1.5"/>
          <path d="M58 61C30 47 20 75 32 90C43 98 56 79 58 61Z" fill="url(#bf-wing-low)" stroke="#a67a80" strokeWidth="1.4"/>
          <path d="M20 34C29 41 43 49 56 55" stroke="#fff8ed" strokeWidth="2"/>
        </g>
        <g className="butterfly-right">
          <path d="M61 54C78 10 107 12 112 32C115 51 98 68 62 59Z" fill="url(#bf-wing)" stroke="#a67a80" strokeWidth="1.5"/>
          <path d="M62 61C90 47 100 75 88 90C77 98 64 79 62 61Z" fill="url(#bf-wing-low)" stroke="#a67a80" strokeWidth="1.4"/>
          <path d="M100 34C91 41 77 49 64 55" stroke="#fff8ed" strokeWidth="2"/>
        </g>
        <path d="M60 54C54 32 49 29 46 28M60 54C66 32 71 29 74 28" stroke="#625846" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="60" cy="65" rx="3.6" ry="20" fill="#6b594f"/>
      </svg>
    </div>
  );
}

function BirdTransition() {
  return (
    <div className="bird-transition" aria-hidden="true">
      <div className="bird-transition-sky" />
      <div className="bird-transition-light" />
      {birds.map((b) => (
        <div key={b.id} className={`bird-fly bird-fly--depth-${b.depth}`} style={{
          "--bird-y": `${b.y}%`,
          "--bird-delay": `${b.delay}ms`,
          "--bird-duration": `${b.duration}ms`,
          "--bird-scale": b.size,
          "--bird-drift": `${b.drift}vh`,
          "--bird-rotate": `${b.rotate}deg`,
          "--bird-opacity": b.opacity,
        } as CSSProperties}>
          {/* Our own frame-by-frame feathered animation, not a flat SVG silhouette. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/white-dove-flight.webp" alt="" width="344" height="282" draggable={false} />
        </div>
      ))}
      <div className="bird-transition-flash" />
    </div>
  );
}

function Icon({ name, size = 23 }: { name: "arrow" | "pin" | "home" | "mosque" | "share" | "back" | "replay" | "check" | "copy" | "heart"; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (name === "home") return <svg {...p}><path d="m3 11 9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg>;
  if (name === "mosque") return <svg {...p}><path d="M5 21V11l7-6 7 6v10M2 21h20M9 21v-6c0-3 6-3 6 0v6M12 2v3M3 8v13M21 8v13"/></svg>;
  if (name === "pin") return <svg {...p}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.8"/></svg>;
  if (name === "arrow") return <svg {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
  if (name === "back") return <svg {...p}><path d="M19 12H5m7-7-7 7 7 7"/></svg>;
  if (name === "replay") return <svg {...p}><path d="M20 11a8 8 0 1 1-2.2-5.5M20 4v6h-6"/></svg>;
  if (name === "share") return <svg {...p}><path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/></svg>;
  if (name === "copy") return <svg {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>;
  if (name === "check") return <svg {...p}><path d="m5 12 5 5L20 7"/></svg>;
  return <svg {...p}><path d="M20.8 8.5c0 4.6-8.8 10.3-8.8 10.3S3.2 13.1 3.2 8.5a5 5 0 0 1 8.8-3.3 5 5 0 0 1 8.8 3.3Z"/></svg>;
}

function VersePage({ index }: { index: 0 | 1 | 2 }) {
  const v = invitation.verses[index];
  return (
    <section className={`page-layout verse-page verse-page--${index + 1}`} aria-labelledby={`verse-${v.id}`}>
      <div className="verse-arch"><div className="verse-arch-decor" aria-hidden="true">✦</div>
        <p className="eyebrow">{v.eyebrow}</p>
        <div className="fine-divider"><span />✧<span /></div>
        <h2 className="verse-title" id={`verse-${v.id}`}>{v.title}</h2>
        <p className="verse-arabic" dir="rtl" lang="ar">{v.arabic}</p>
        <span className="verse-caption">বাংলা ভাবার্থ</span>
        <p className="verse-bengali" lang="bn">{v.bangla}</p>
        <a className="verse-reference" href={v.link} target="_blank" rel="noopener noreferrer" aria-label={`${v.reference} Quran.com-এ পড়ুন`}>{v.reference} <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

function HeroPage() {
  return (
    <section className="page-layout hero-page" aria-label="Welcome to Arif and Suchana's invitation">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="prelude-arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <p className="eyebrow">A CELEBRATION OF LOVE & BLESSINGS</p>
          <h1 className="hero-title">Our beautiful<br /><em>beginning.</em></h1>
          <div className="gold-rule"/>
          <p className="hero-inviting">With the blessings of Allah and the love of our families, we warmly invite you to join us as we begin our new journey together.</p>
          <div className="hero-nameplate">Arif <span>&</span> Suchana</div>
          <p className="hero-subheading">THE KABIN CEREMONY</p>
        </div>
        <div className="hero-artwork">
          <div className="hero-art-halo" />
          <div className="hero-photo-wrap">
            <Image src="/arif-suchana.webp" alt="Illustrated portrait of Arif Rahman sitting beside Suchana Sarker, under a floral A and S monogram" width={640} height={853} priority sizes="(max-width: 780px) 82vw, 510px" className="hero-photo" />
          </div>
          <span className="hero-photo-stamp">A <span>♥</span> S</span>
        </div>
      </div>
    </section>
  );
}

function InvitationPage() {
  const { couple, ceremony } = invitation;
  return (
    <section className="page-layout ceremony-page" aria-labelledby="ceremony-title">
      <div className="ceremony-paper">
        <Bloom side="left" small/><Bloom side="right" small/>
        <div className="ceremony-paper-border" aria-hidden="true" />
        <p className="prelude-arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>
        <h2 id="ceremony-title" className="ceremony-title">You are <em>invited</em></h2>
        <p className="ceremony-description">With gratitude in our hearts, we invite you to be part of our special day and keep us in your prayers.</p>
        <div className="invite-names">
          <strong>{couple.groom}</strong><span className="ampersand">&</span><strong>{couple.bride}</strong>
        </div>
        <div className="fine-divider"><span/>✧<span/></div>
        <div className="ceremony-tag">{ceremony.title}</div>
        <div className="ceremony-detail-row">
          <div className="ceremony-detail"><small>DATE</small><strong>{ceremony.date ?? "To be announced"}</strong></div>
          <div className="ceremony-detail"><small>TIME</small><strong>{ceremony.time}{ceremony.timePeriod ? ` ${ceremony.timePeriod}` : ""}</strong></div>
        </div>
        <p className="ceremony-bn" lang="bn">আপনাদের উপস্থিতি, ভালোবাসা ও দোয়ায় আমাদের এই নতুন পথচলা আরও সুন্দর হয়ে উঠুক।</p>
      </div>
    </section>
  );
}

function LocationsPage() {
  return (
    <section className="page-layout locations-page" aria-labelledby="locations-title">
      <div className="section-heading"><p className="eyebrow">FIND YOUR WAY TO US</p><h2 id="locations-title">The <em>locations</em></h2><p lang="bn">আপনাদের সুবিধার জন্য দুইটি Google Maps লোকেশন দেওয়া হলো।</p></div>
      <div className="venue-grid">
        {invitation.locations.map((location, idx) => (
          <article className="venue-card" key={location.id}>
            <div className={`venue-map-art venue-map-art--${idx}`} aria-hidden="true"><div className="venue-map-lines" /><span className="venue-pin"><Icon name={location.icon} size={28}/></span><span className="venue-map-label">LOCATION 0{idx + 1}</span></div>
            <div className="venue-card-body">
              <span className="venue-number">0{idx+1} / DESTINATION</span>
              <h3>{location.label}</h3><p lang="bn">{location.bangla}</p>
              <p className="venue-note" lang="bn">{location.note}</p>
              <a className="venue-link" href={location.mapUrl} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={19}/> Open in Google Maps <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      </div>
      <p className="venue-footnote" lang="bn">সরাসরি Google Maps-এ পথনির্দেশনা দেখতে প্রতিটি লোকেশনের বোতামে চাপুন।</p>
    </section>
  );
}

function ClosingPage({ onShare, onCopy, copied, onReplay }: { onShare: () => void; onCopy: () => void; copied: boolean; onReplay: () => void }) {
  return (
    <section className="page-layout closing-page" aria-labelledby="closing-title">
      <div className="closing-arch">
        <Bloom side="left" small /><Bloom side="right" small />
        <div className="closing-ornament" aria-hidden="true">❀</div>
        <p className="eyebrow">WITH LOVE, FAITH & GRATITUDE</p>
        <Monogram />
        <h2 id="closing-title">A new chapter,<br /><em>In Sha Allah.</em></h2>
        <p className="closing-bengali" lang="bn">আমাদের নতুন পথচলায় আপনাদের আন্তরিক দোয়া, ভালোবাসা ও শুভকামনা কামনা করি। আল্লাহ যেন আমাদের দাম্পত্য জীবনকে রহমত, বরকত ও প্রশান্তিতে পরিপূর্ণ করেন। আমিন।</p>
        <p className="closing-signature">Arif Rahman <span>&</span> Suchana Sarker</p>
        <p className="closing-ceremony">KABIN CEREMONY</p>
        <div className="closing-actions">
          <button type="button" className="action-button action-button--gold" onClick={onShare}><Icon name="share" size={18}/> Share invitation</button>
          <button type="button" className="action-button action-button--outline" onClick={onCopy}><Icon name={copied ? "check" : "copy"} size={18}/>{copied ? "Link copied" : "Copy link"}</button>
        </div>
        <button type="button" className="restart-link" onClick={onReplay}><Icon name="replay" size={18}/> Watch opening again</button>
      </div>
    </section>
  );
}

export default function WeddingExperience() {
  const [stage, setStage] = useState<Stage>("cover");
  const [page, setPage] = useState(0);
  const [point, setPoint] = useState<Point>({ x: 50, y: 50 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef<Stage>("cover");
  const touchX = useRef<number | null>(null);
  const slideRef = useRef<HTMLDivElement | null>(null);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const setPhase = useCallback((next: Stage) => { stageRef.current = next; setStage(next); }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange(); media.addEventListener("change", onChange);
    const image = new window.Image(); image.src = "/arif-suchana.webp";
    const dove = new window.Image(); dove.src = "/white-dove-flight.webp";
    return () => { media.removeEventListener("change", onChange); timers.current.forEach(clearTimeout); };
  }, []);

  const open = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (stageRef.current !== "cover") return;
    const r = event.currentTarget.getBoundingClientRect();
    const hasPointer = event.detail !== 0;
    setPoint({ x: hasPointer ? Math.min(94, Math.max(6, (event.clientX - r.left) / r.width * 100)) : 50, y: hasPointer ? Math.min(91, Math.max(9, (event.clientY - r.top) / r.height * 100)) : 50 });
    clearTimers();
    if (reducedMotion) { setPhase("invitation"); return; }
    setPhase("butterfly");
    schedule(() => setPhase("birds"), BUTTERFLY_MS);
    schedule(() => setPhase("invitation"), BUTTERFLY_MS + BIRD_FLIGHT_MS);
  }, [clearTimers, reducedMotion, schedule, setPhase]);

  const navigate = useCallback((next: number) => {
    setPage(Math.min(pageNames.length - 1, Math.max(0, next)));
    setCopied(false);
    slideRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const next = useCallback(() => navigate(page + 1), [navigate, page]);
  const previous = useCallback(() => navigate(page - 1), [navigate, page]);

  useEffect(() => {
    if (stage !== "invitation") return;
    const keyHandler = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); navigate(page + 1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); navigate(page - 1); }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [stage, page, navigate]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => { touchX.current = event.touches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchX.current == null) return;
    const move = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    touchX.current = null;
    if (move < -85) next();
    else if (move > 85) previous();
  };

  const replay = useCallback(() => { clearTimers(); navigate(0); setPhase("cover"); }, [clearTimers, navigate, setPhase]);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      schedule(() => setCopied(false), 2800);
    } catch { setShowHelp(true); }
  }, [schedule]);
  const share = useCallback(async () => {
    const shareData = { title: "Arif & Suchana | Kabin Ceremony", text: "You're warmly invited to celebrate Arif & Suchana's Kabin ceremony. 💛", url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user dismissed share */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`, "_blank", "noopener,noreferrer");
    }
  }, []);

  function renderPage() {
    switch (page) {
      case 0: return <HeroPage />;
      case 1: return <VersePage index={0} />;
      case 2: return <InvitationPage />;
      case 3: return <VersePage index={1} />;
      case 4: return <LocationsPage />;
      case 5: return <VersePage index={2} />;
      case 6: return <ClosingPage onShare={share} onCopy={copy} copied={copied} onReplay={replay} />;
      default: return <HeroPage />;
    }
  }

  const invitationVisible = stage === "invitation" || stage === "birds";
  const showCover = stage !== "invitation";

  return (
    <main className="site-root">
      {showCover && (
        <div className={`cover-screen cover-screen--${stage}`} aria-hidden={stage === "birds"}>
          <button className="cover-tap" type="button" onClick={open} disabled={stage !== "cover"} tabIndex={stage === "cover" ? 0 : -1} aria-label="Open Arif and Suchana's Kabin invitation">
            <div className="cover-card">
              <div className="cover-card-border" aria-hidden="true" />
              <Bloom side="left" /><Bloom side="right" />
              <p className="cover-bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="eyebrow cover-eyebrow">A BEAUTIFUL BEGINNING</p>
              <div className="cover-monogram"><Monogram /></div>
              <div className="fine-divider"><span/>✧<span/></div>
              <h1 className="cover-title">Kabin Ceremony</h1>
              <p className="cover-couple">Arif Rahman <span>&</span> Suchana Sarker</p>
              <div className="cover-open-icon" aria-hidden="true">✦</div>
              <p className="cover-instruction">TAP ANYWHERE TO OPEN</p>
              <p className="cover-footnote">An invitation awaits you</p>
            </div>
            <p className="cover-bottom">Made with love & prayers <span>✧</span></p>
          </button>
          {stage === "butterfly" && <div className="butterfly-anchor" style={{ left: `${point.x}%`, top: `${point.y}%` }}><Butterfly /></div>}
        </div>
      )}

      <div className={`invitation-experience ${invitationVisible ? "invitation-experience--visible" : ""}`} aria-hidden={!invitationVisible}>
        <header className="site-header">
          <div className="site-mark"><Monogram compact /><span>KABIN CEREMONY</span></div>
          <div className="header-right"><span className="header-page-label">{pageNames[page]}</span><span className="header-counter">{String(page + 1).padStart(2, "0")} <em>/</em> {String(pageNames.length).padStart(2, "0")}</span></div>
        </header>

        <div className="page-canvas" ref={slideRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="page-frame" key={page}>{renderPage()}</div>
        </div>

        <footer className="site-footer">
          <button className="page-arrow" type="button" onClick={previous} disabled={page === 0} aria-label="Previous page"><Icon name="back" size={21}/><span>Back</span></button>
          <div className="page-dots" aria-label="Invitation pages">
            {pageNames.map((label, index) => <button type="button" key={label} className={`page-dot ${page === index ? "page-dot--active" : ""}`} onClick={() => navigate(index)} aria-label={`Go to ${label}`} aria-current={page === index ? "step" : undefined} />)}
          </div>
          {page < pageNames.length - 1 ? <button className="page-next" type="button" onClick={next}><span>Continue</span><Icon name="arrow" size={18}/></button> : <button className="page-next" type="button" onClick={replay}><span>Replay</span><Icon name="replay" size={18}/></button>}
        </footer>
      </div>

      {stage === "birds" && !reducedMotion && <BirdTransition />}
      {showHelp && <div className="copy-help" role="alert"><p>To share this invitation, copy your browser&apos;s address bar link.</p><button type="button" onClick={() => setShowHelp(false)}>Close</button></div>}
      <div className="sr-only" aria-live="polite">{stage === "cover" ? "Invitation ready. Tap or press Enter to open." : stage === "butterfly" ? "The butterfly is opening the invitation." : stage === "birds" ? "White doves are revealing the invitation." : `Invitation page ${page + 1} of ${pageNames.length}: ${pageNames[page]}.`}</div>
    </main>
  );
}
