"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { invitation, pageNames } from "./invitation-data";

type Phase = "cover" | "opening" | "butterfly" | "doves" | "story" | "finished";
type Point = { x: number; y: number };

const STAGE_MS: Record<"opening" | "butterfly" | "doves", number> = {
  opening: 1250,
  butterfly: 1100,
  doves: 3100,
};
// A single scene clock keeps narration, scenery and the walking peacock synchronized.
// A short, uninterrupted wedding narrative: roughly 45 seconds after opening.
const SCREEN_MS = [14000, 24000, 22000, 18000] as const;
const SCENE_CROSSFADE_MS = 1700;
const BIRDS = [
  { id: 0, y: 13, delay: 20, duration: 2250, size: .68, drift: -16, tilt: -8, opacity: .78, blur: .5 },
  { id: 1, y: 66, delay: 230, duration: 2600, size: 1.02, drift: -25, tilt: 8, opacity: .98, blur: 0 },
  { id: 2, y: 41, delay: 430, duration: 2100, size: .65, drift: 9, tilt: -11, opacity: .82, blur: .45 },
  { id: 3, y: 77, delay: 650, duration: 2290, size: 1.26, drift: -13, tilt: 7, opacity: .99, blur: 0 },
  { id: 4, y: 26, delay: 860, duration: 2210, size: .74, drift: 15, tilt: -6, opacity: .80, blur: .8 },
  { id: 5, y: 53, delay: 1110, duration: 1780, size: 1.38, drift: -20, tilt: 12, opacity: 1, blur: 0 },
  { id: 6, y: 8, delay: 1320, duration: 1850, size: .83, drift: 9, tilt: -9, opacity: .85, blur: .6 },
] as const;

function FloralCorner({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <svg className={`floral-corner floral-corner--${side}`} aria-hidden="true" viewBox="0 0 256 265" fill="none">
      <path d="M-6 250C65 181 64 109 144 77C185 59 230 37 255 4" stroke="#779376" strokeWidth="2.5"/>
      <path d="M63 182C25 155 12 167 17 185C39 199 52 196 63 182Z" fill="#94b18a"/>
      <path d="M123 93C98 64 105 48 125 54C134 72 130 80 123 93Z" fill="#7c9d77"/>
      <path d="M191 54C181 24 197 13 213 18C212 33 204 45 191 54Z" fill="#a5b892"/>
      <path d="M167 71C201 82 206 102 191 110C175 97 170 87 167 71Z" fill="#a1b38b"/>
      <g transform="translate(97 143)">{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-28" rx="18" ry="34" transform={`rotate(${i * 72})`} fill="#f5cbd0" stroke="#dfabaf" strokeWidth="1"/>)}<circle r="12" fill="#e5ad73"/></g>
      <g transform="translate(211 51) scale(.64)">{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-28" rx="17" ry="31" transform={`rotate(${i * 72})`} fill="#fff4e5" stroke="#eddbc5"/>)}<circle r="12" fill="#dcb777"/></g>
      <g transform="translate(36 224) scale(.48)">{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-28" rx="18" ry="32" transform={`rotate(${i * 72})`} fill="#fff5e4"/>)}<circle r="12" fill="#dfb472"/></g>
    </svg>
  );
}

function Monogram({ small = false }: { small?: boolean }) {
  return <span className={`as-mark ${small ? "as-mark--small" : ""}`} aria-label="A and S"><span>A</span><span className="as-heart" aria-hidden="true">♥<b>&amp;</b></span><span>S</span></span>;
}

function Butterfly() {
  return <div className="butterfly-flight" aria-hidden="true">
    <i className="fairy-dust fairy-dust--one"/><i className="fairy-dust fairy-dust--two"/><i className="fairy-dust fairy-dust--three"/>
    <svg className="butterfly-art" viewBox="0 0 130 120" fill="none">
      <defs><linearGradient id="wing-pink" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff2df"/><stop offset=".5" stopColor="#eab5c5"/><stop offset="1" stopColor="#c6849b"/></linearGradient></defs>
      <g className="butterfly-wing butterfly-wing--left"><path d="M63 57C39 9 12 14 7 38C4 60 26 74 62 65Z" fill="url(#wing-pink)" stroke="#b18990" strokeWidth="1.7"/><path d="M62 67C29 50 18 79 32 98C44 104 57 83 62 67Z" fill="#f7d0a1" stroke="#b18990" strokeWidth="1.5"/><path d="M21 37C36 46 49 58 59 61" stroke="#fff7ef" strokeWidth="2.5"/></g>
      <g className="butterfly-wing butterfly-wing--right"><path d="M67 57C91 9 118 14 123 38C126 60 104 74 68 65Z" fill="url(#wing-pink)" stroke="#b18990" strokeWidth="1.7"/><path d="M68 67C101 50 112 79 98 98C86 104 73 83 68 67Z" fill="#f7d0a1" stroke="#b18990" strokeWidth="1.5"/><path d="M109 37C94 46 81 58 71 61" stroke="#fff7ef" strokeWidth="2.5"/></g>
      <path d="M65 58C58 34 53 31 50 30M65 58C72 34 77 31 80 30" stroke="#5a6250" strokeWidth="2" strokeLinecap="round"/><ellipse cx="65" cy="70" rx="4" ry="20" fill="#6a6152"/>
    </svg>
  </div>;
}

// Small decorative butterflies move near the edges to keep verses unobstructed.
const AMBIENT_BUTTERFLIES = [
  { x: 6, y: 19, delay: -1.2, duration: 13.1, scale: .65, color: "rose" },
  { x: 89, y: 33, delay: -7.4, duration: 17.2, scale: .78, color: "gold" },
  { x: 11, y: 62, delay: -5.3, duration: 15.8, scale: .55, color: "blue" },
  { x: 91, y: 73, delay: -12.1, duration: 19.5, scale: .67, color: "rose" },
  { x: 16, y: 86, delay: -9.2, duration: 20.4, scale: .5, color: "gold" },
  { x: 82, y: 13, delay: -3.8, duration: 14.7, scale: .55, color: "blue" },
] as const;

function AmbientButterflies() {
  return <div className="butterfly-garden" aria-hidden="true">
    {AMBIENT_BUTTERFLIES.map((b, i) => <div className={`ambient-butterfly ambient-butterfly--${b.color}`} key={i} style={{
      "--x": `${b.x}%`, "--y": `${b.y}%`, "--fly-delay": `${b.delay}s`,
      "--fly-duration": `${b.duration}s`, "--butterfly-scale": b.scale,
    } as CSSProperties}>
      <svg viewBox="0 0 46 39" fill="none">
        <g className="ambient-butterfly-wing ambient-butterfly-wing--left"><path d="M22 21C12 5 4 7 2 16c-1 8 7 13 20 10Z" fill="currentColor" opacity=".86"/><path d="M22 25C7 17 8 34 16 36c4 1 6-7 6-11Z" fill="currentColor" opacity=".64"/></g>
        <g className="ambient-butterfly-wing ambient-butterfly-wing--right"><path d="M24 21C34 5 42 7 44 16c1 8-7 13-20 10Z" fill="currentColor" opacity=".86"/><path d="M24 25c15-8 14 9 6 11-4 1-6-7-6-11Z" fill="currentColor" opacity=".64"/></g>
        <path d="M23 20v15M23 20c-3-6-5-7-7-7M23 20c3-6 5-7 7-7" stroke="#746b5c" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>)}
  </div>;
}

// Persistent companion: it never remounts between story pages. Hiding the walker
// during a pause retains the exact CSS walk/step phase underneath the fan overlay.
function PeacockCompanion({ paused, visible, reducedMotion, page }: { paused: boolean; visible: boolean; reducedMotion: boolean; page: number }) {
  if (!visible) return null;
  // Every story page gets one full walk. The same SCREEN_MS value drives both
  // the scene clock and the walk, so the background cannot advance mid-walk.
  const walkStyle = { "--walk-duration": `${SCREEN_MS[page]}ms` } as CSSProperties;
  return <div className={`peacock-companion ${paused ? "peacock-companion--waiting" : ""} ${reducedMotion ? "peacock-companion--still" : ""}`} aria-hidden="true">
    <div className="peacock-traveler" key={page} style={walkStyle}><div className="peacock-bob"><div className="peacock-walk-sprite"/></div></div>
    {paused && <div className="peacock-wait-scene"><div className="peacock-wait-sprite"/><span className="peacock-wait-label">Your little friend is waiting ♡</span></div>}
  </div>;
}

function Doves() {
  return <div className="dove-transition" aria-hidden="true">
    <div className="dove-light"/>
    {BIRDS.map(b => <div className="dove" key={b.id} style={{
      "--y": `${b.y}%`, "--delay": `${b.delay}ms`, "--duration": `${b.duration}ms`,
      "--scale": b.size, "--drift": `${b.drift}vh`, "--tilt": `${b.tilt}deg`,
      "--opacity": b.opacity, "--blur": `${b.blur}px`,
    } as CSSProperties}>
      {/* The eight photographic wingbeat frames are CSS-stepped so pause also freezes the wings. */}
      <div className="dove-wings"/>
    </div>)}
    <div className="dove-glow"/>
  </div>;
}

function Icon({ kind, size = 19 }: { kind: "pause" | "play" | "arrow" | "back" | "restart" | "pin" | "share" | "copy" | "check" | "sparkles" | "volume" | "mute"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const path = {
    pause: <><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>,
    play: <path d="M8 5.5 19 12 8 18.5Z"/>,
    arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
    back: <path d="M20 12H5m6-6-6 6 6 6"/>,
    restart: <><path d="M20 11a8 8 0 1 1-2.5-5.9M20 4v6h-6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    share: <><path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
    check: <path d="m5 12 5 5L20 7"/>,
    sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 17 .8 1.2L21 19l-1.2.8L19 21l-.8-1.2L17 19l1.2-.8L19 17Z"/></>,
    volume: <><path d="M4 10v4h4l5 4V6L8 10H4Z"/><path d="M16 9a5 5 0 0 1 0 6M19 6a9 9 0 0 1 0 12"/></>,
    mute: <><path d="M4 10v4h4l5 4V6L8 10H4Z"/><path d="m17 10 5 5m0-5-5 5"/></>,
  }[kind];
  return <svg {...common}>{path}</svg>;
}

function Cover() {
  return <div className="cover-content">
    <div className="sealed-card">
      <div className="card-border"/>
      <FloralCorner/><FloralCorner side="right"/>
      <div className="card-inside">
        <p className="opening-bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="small-overline">A BEAUTIFUL BEGINNING</p>
        <Monogram/>
        <span className="card-divider">✧ ─── ✧ ─── ✧</span>
        <h1>Kabin <em>Ceremony</em></h1>
        <p className="card-names">Arif Rahman <span>&amp;</span> Suchana Sarker</p>
        <p className="cover-date">FRIDAY · 6 NOVEMBER 2026</p>
        <p className="cover-hijri" dir="rtl" lang="ar">{invitation.ceremony.hijriArabic}</p>
        <span className="card-seal"><span>♥</span></span>
        <p className="opening-hint">TAP TO OPEN OUR STORY</p>
        <p className="opening-audio-hint">♪ Soft music · special song available</p>
      </div>
      <div className="envelope-flap" aria-hidden="true"><span>♥</span></div>
    </div>
    <p className="under-card">An invitation made with love &amp; duas</p>
  </div>;
}

function HeroPage() {
  return <section className="screen screen--hero" aria-label="Welcome Arif and Suchana">
    <div className="hero-picture"><Image src="/arif-suchana.webp" alt="Illustration of Arif Rahman seated beside Suchana Sarker, with their A and S floral monogram" fill sizes="(max-width: 600px) 100vw, 500px" priority className="hero-image"/></div>
    <div className="hero-bottom">
      <p className="small-overline">BY THE GRACE OF ALLAH</p>
      <h2>Our beautiful <em>beginning</em></h2>
      <p>Arif Rahman <span>♥</span> Suchana Sarker</p>
      <span className="hero-mini">FRIDAY · 6 NOVEMBER 2026</span>
    </div>
  </section>;
}

function CeremonyPage() {
  return <section className="screen screen--ceremony" aria-label="Kabin ceremony invitation">
    <div className="invitation-paper">
      <FloralCorner/><FloralCorner side="right"/>
      <p className="opening-bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      <p className="small-overline">THE NEXT CHAPTER OF OUR STORY</p>
      <h2>You are <em>invited</em></h2>
      <p className="ceremony-caption">With our families, we invite you to share in our special day.</p>
      <div className="ceremony-names"><strong>Arif Rahman</strong><span>&amp;</span><strong>Suchana Sarker</strong></div>
      <div className="ceremony-rule">✦</div>
      <p className="small-overline">KABIN CEREMONY</p>
      <div className="time-grid"><div><small>DATE</small><strong>6 NOVEMBER 2026</strong><span>Friday</span></div><div><small>TIME</small><strong>{invitation.ceremony.time}{invitation.ceremony.timePeriod ? ` ${invitation.ceremony.timePeriod}` : ""}</strong><span>Bangladesh time</span></div></div>
      <p className="date-bangla" lang="bn">{invitation.ceremony.dateBangla}</p>
      <p className="date-hijri" lang="ar" dir="rtl">{invitation.ceremony.hijriArabic}</p>
      <p className="hijri-disclaimer" lang="bn">{invitation.ceremony.hijriNote}</p>
      <p className="ceremony-bangla" lang="bn">আপনাদের ভালোবাসা, উপস্থিতি ও দোয়ায় আমাদের এই বিশেষ দিনটি আরও সুন্দর হয়ে উঠুক।</p>
    </div>
  </section>;
}

function LocationsPage() {
  return <section className="screen screen--locations" aria-label="Kabin locations">
    <div className="locations-heading"><span className="small-overline">OUR JOURNEY LEADS TO YOU</span><h2>Come celebrate <em>with us</em></h2><p lang="bn">আপনাদের উপস্থিতি আমাদের আনন্দ পূর্ণ করবে। নিচে দুইটি লোকেশনের দিকনির্দেশনা রয়েছে।</p></div>
    <div className="location-stack">
      {invitation.locations.map((location, i) => <a
        className="location-item location-item--interactive"
        key={location.id}
        style={{ "--venue-index": i } as CSSProperties}
        href={location.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${location.label} location in Google Maps`}
        data-action="true"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="location-icon"><Icon kind="pin" size={23}/></span>
        <span className="location-details"><span className="location-count">LOCATION 0{i + 1}</span><span className="location-title">{location.label}</span><span className="location-description" lang="bn">{location.bangla} · {location.note}</span></span>
        <span className="location-map-link" aria-hidden="true"><Icon kind="arrow" size={18}/></span>
      </a>)}
    </div>
    <p className="map-footnote" lang="bn">যেকোনো লোকেশন কার্ডে চাপ দিয়ে Google Maps-এ পথনির্দেশনা দেখুন।</p>
  </section>;
}

function ClosingPage({ onShare, onCopy, onReplay, copied }: { onShare: () => void; onCopy: () => void; onReplay: () => void; copied: boolean }) {
  return <section className="screen screen--closing" aria-label="Blessings and thank you">
    <FloralCorner/><FloralCorner side="right"/>
    <div className="closing-content">
      <span className="blessing-flower">❀</span>
      <p className="small-overline">AND SO OUR STORY BEGINS</p>
      <Monogram/>
      <h2>A new chapter,<br/><em>In Sha Allah.</em></h2>
      <p lang="bn" className="closing-dua">আমাদের নতুন পথচলায় আপনাদের ভালোবাসা ও দোয়া কামনা করি। এই আনন্দের দিনে আপনাদের উপস্থিতিই আমাদের সবচেয়ে বড় উপহার।</p>
      <strong className="closing-names">Arif Rahman <span>&amp;</span> Suchana Sarker</strong>
      <p className="closing-event-date">6 NOVEMBER 2026 · 26 JUMADA AL-AWWAL 1448 AH</p>
      <p className="small-overline">KABIN CEREMONY</p>
      <div className="closing-actions">
        <button type="button" data-action="true" onClick={onShare}><Icon kind="share" size={18}/> Share</button>
        <button type="button" data-action="true" className="ghost-button" onClick={onCopy}><Icon kind={copied ? "check" : "copy"} size={18}/>{copied ? "Copied" : "Copy link"}</button>
      </div>
      <button type="button" data-action="true" className="replay-invitation" onClick={onReplay}><Icon kind="restart" size={17}/> Watch from beginning</button>
    </div>
  </section>;
}

export default function WeddingExperience() {
  const [phase, setPhase] = useState<Phase>("cover");
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [point, setPoint] = useState<Point>({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hint, setHint] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const flutterRef = useRef<HTMLAudioElement | null>(null);
  const peacockCallRef = useRef<HTMLAudioElement | null>(null);
  const peacockCallElapsedRef = useRef(0);
  const [outgoingPage, setOutgoingPage] = useState<number | null>(null);

  const phaseRef = useRef<Phase>("cover");
  const transitionElapsedRef = useRef(0);
  const outgoingPageRef = useRef<number | null>(null);
  const pageRef = useRef(0);
  const pausedRef = useRef(false);
  const timeRef = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // A Maps link may hide this tab; do not interpret that as an invitation pause.
  const lastMapNavigationRef = useRef(-Infinity);
  const showHintRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhaseNow = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
    if (next === "doves" && soundOnRef.current) {
      const wings = flutterRef.current;
      if (wings) { wings.currentTime = 0; void wings.play().catch(() => {}); }
    }
    if (next === "finished") { flutterRef.current?.pause(); musicRef.current?.pause(); peacockCallRef.current?.pause(); }
  }, []);
  const setPageNow = useCallback((next: number) => {
    const safe = Math.min(pageNames.length - 1, Math.max(0, next));
    if (safe !== pageRef.current && phaseRef.current === "story") {
      outgoingPageRef.current = pageRef.current;
      setOutgoingPage(pageRef.current);
      transitionElapsedRef.current = 0;
    } else { outgoingPageRef.current = null; setOutgoingPage(null); }
    pageRef.current = safe;
    setPage(safe);
    timeRef.current = 0;
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    if (barRef.current) barRef.current.style.transform = "scaleX(0)";
  }, []);
  const setPauseNow = useCallback((value: boolean) => {
    pausedRef.current = value;
    setPaused(value);
    if (value) {
      musicRef.current?.pause();
      flutterRef.current?.pause();
      peacockCallRef.current?.pause();

    } else if (soundOnRef.current && phaseRef.current !== "cover") {
      void musicRef.current?.play().catch(() => {});
      if (phaseRef.current === "doves") void flutterRef.current?.play().catch(() => {});
      if (phaseRef.current === "story" && peacockCallRef.current && !peacockCallRef.current.ended && peacockCallRef.current.currentTime > 0) {
        void peacockCallRef.current.play().catch(() => {});
      }
    }
  }, []);

  const toggleSound = useCallback(() => {
    const enabled = !soundOnRef.current;
    soundOnRef.current = enabled;
    setSoundOn(enabled);
    if (!enabled) { musicRef.current?.pause(); flutterRef.current?.pause(); peacockCallRef.current?.pause(); }
    else if (!pausedRef.current && phaseRef.current !== "cover" && phaseRef.current !== "finished") {
      void musicRef.current?.play().catch(() => setHint("Tap the music button again if your browser blocks sound."));
      if (phaseRef.current === "doves") void flutterRef.current?.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion(); media.addEventListener("change", updateMotion);
    // The visitor's first tap is the playback gesture. Keep the flute gentle under the story.
    if (musicRef.current) musicRef.current.volume = 0.64;
    const image = new window.Image(); image.src = "/arif-suchana.webp";
    const dove = new window.Image(); dove.src = "/white-dove-sprite.webp";
    const peacock = new window.Image(); peacock.src = "/peacock-walk-sprite.webp";
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onVisibility = () => {
      const openedMapRecently = performance.now() - lastMapNavigationRef.current < 2500;
      if (document.hidden && !openedMapRecently && phaseRef.current !== "cover" && phaseRef.current !== "finished") setPauseNow(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { media.removeEventListener("change", updateMotion); document.removeEventListener("visibilitychange", onVisibility); };
  }, [setPauseNow]);

  // One monotonic clock drives ALL screens. Pausing freezes the same millisecond,
  // and CSS animation-play-state freezes the decorative motion alongside it.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(Math.max(now - last, 0), 70);
      last = now;
      const current = phaseRef.current;
      if (!pausedRef.current && current !== "cover" && current !== "finished") {
        if (outgoingPageRef.current !== null) {
          transitionElapsedRef.current += delta;
          if (transitionElapsedRef.current >= SCENE_CROSSFADE_MS) { outgoingPageRef.current = null; setOutgoingPage(null); }
        }
        if (current === "story") {
          // Occasional authentic, gentle peacock call, not a continuously repeating alarm.
          peacockCallElapsedRef.current += delta;
          if (peacockCallElapsedRef.current >= 28000 && soundOnRef.current) {
            peacockCallElapsedRef.current = 0;
            const sound = peacockCallRef.current;
            if (sound) { sound.volume = 0.17; sound.currentTime = 0; void sound.play().catch(() => {}); }
          }
        }
        timeRef.current += delta;
        const duration = current === "story" ? SCREEN_MS[pageRef.current] : STAGE_MS[current];
        const fraction = Math.min(1, timeRef.current / duration);
        if (barRef.current) barRef.current.style.transform = `scaleX(${fraction})`;
        if (timeRef.current >= duration) {
          timeRef.current = 0;
          if (current === "opening") setPhaseNow("butterfly");
          else if (current === "butterfly") setPhaseNow("doves");
          else if (current === "doves") { peacockCallElapsedRef.current = 16500; setPageNow(0); setPhaseNow("story"); }
          else if (pageRef.current < pageNames.length - 1) setPageNow(pageRef.current + 1);
          else { setPhaseNow("finished"); if (barRef.current) barRef.current.style.transform = "scaleX(1)"; }
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [setPageNow, setPhaseNow]);

  const start = useCallback((event?: ReactMouseEvent<HTMLElement>) => {
    if (phaseRef.current !== "cover") return;
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPoint({ x: event.detail ? Math.max(12, Math.min(88, 100 * (event.clientX - rect.left) / rect.width)) : 50, y: event.detail ? Math.max(14, Math.min(84, 100 * (event.clientY - rect.top) / rect.height)) : 50 });
    }
    timeRef.current = 0;
    setPauseNow(false);
    // A direct visitor gesture unlocks audio on mobile browsers.
    if (soundOnRef.current) void musicRef.current?.play().catch(() => {
      soundOnRef.current = false; setSoundOn(false);
      setHint("Your browser muted the music. Tap the music icon to enable it.");
    });
    if (reducedMotion) { setPageNow(0); setPhaseNow("story"); }
    else setPhaseNow("opening");
  }, [reducedMotion, setPageNow, setPhaseNow, setPauseNow]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "cover" || phaseRef.current === "finished") return;
    setPauseNow(!pausedRef.current);
  }, [setPauseNow]);

  const onSurfaceClickCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest(".location-item--interactive")) lastMapNavigationRef.current = performance.now();
  }, []);

  const onSurfaceClick = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, [data-action]")) return;
    if (phaseRef.current === "cover") start(event);
    else togglePause();
  }, [start, togglePause]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("button,a,input,select,textarea") || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (phaseRef.current === "cover") start(); else togglePause();
      } else if (event.key === "ArrowRight" && (phaseRef.current === "story" || phaseRef.current === "finished")) {
        event.preventDefault(); setPageNow(pageRef.current + 1); setPhaseNow("story"); setPauseNow(false);
      } else if (event.key === "ArrowLeft" && (phaseRef.current === "story" || phaseRef.current === "finished")) {
        event.preventDefault(); setPageNow(pageRef.current - 1); setPhaseNow("story"); setPauseNow(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, togglePause, setPageNow, setPhaseNow, setPauseNow]);

  const goToPage = useCallback((next: number) => {
    setPageNow(next);
    setPhaseNow("story");
    setPauseNow(false);
  }, [setPageNow, setPhaseNow, setPauseNow]);

  const replay = useCallback(() => {
    musicRef.current?.pause();
    flutterRef.current?.pause();
    peacockCallRef.current?.pause();
    peacockCallElapsedRef.current = 0;
    if (musicRef.current) musicRef.current.currentTime = 0;
    if (flutterRef.current) flutterRef.current.currentTime = 0;
    timeRef.current = 0;
    outgoingPageRef.current = null; setOutgoingPage(null);
    setPageNow(0);
    setPhaseNow("cover");
    setPauseNow(false);
  }, [setPageNow, setPhaseNow, setPauseNow]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (showHintRef.current) clearTimeout(showHintRef.current);
      showHintRef.current = setTimeout(() => setCopied(false), 2500);
    } catch { setHint("Copy the URL in your browser's address bar to share this invitation."); }
  }, []);

  const share = useCallback(async () => {
    const data = { title: "Arif & Suchana | Kabin Ceremony", text: "You're invited to Arif & Suchana's Kabin ceremony. Your prayers mean so much to us.", url: window.location.href };
    if (navigator.share) { try { await navigator.share(data); } catch { /* dismissal is not an error */ } }
    else window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text}\n${data.url}`)}`, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => () => { if (showHintRef.current) clearTimeout(showHintRef.current); }, []);

  const showStory = phase === "doves" || phase === "story" || phase === "finished";
  const storyIndex = phase === "doves" ? 0 : page;

  function renderScreen(index: number) {
    switch (index) {
      case 0: return <HeroPage/>;
      case 1: return <CeremonyPage/>;
      case 2: return <LocationsPage/>;
      case 3: return <ClosingPage onCopy={copy} onShare={share} onReplay={replay} copied={copied}/>;
      default: return <HeroPage/>;
    }
  }

  const progressLabel = phase === "opening" || phase === "butterfly" || phase === "doves" ? "Opening invitation" : pageNames[page];
  return <main className={`experience-root ${paused ? "experience-root--paused" : ""}`} onClickCapture={onSurfaceClickCapture} onClick={onSurfaceClick} tabIndex={-1}>
    <audio ref={musicRef} src="/ranjha-flute-cover.mp3" preload="auto" loop playsInline aria-hidden="true"/>
    <audio ref={flutterRef} src="/dove-wings.mp3" preload="auto" playsInline aria-hidden="true"/>
    <audio ref={peacockCallRef} src="https://upload.wikimedia.org/wikipedia/commons/0/05/Pavo_cristatus_%28call%29.ogg" preload="none" playsInline aria-hidden="true"/>
    <div className="ambient-blur ambient-blur--one" aria-hidden="true"/><div className="ambient-blur ambient-blur--two" aria-hidden="true"/>
    <div className="mobile-experience" aria-label="Arif and Suchana's animated Kabin invitation">
      {(phase === "cover" || phase === "opening" || phase === "butterfly") && <div className={`cover-stage cover-stage--${phase}`}>
        <Cover/>
        {phase === "cover" && <button type="button" className="open-anywhere" aria-label="Open Kabin invitation" onClick={start}/>} 
        {phase === "butterfly" && <div className="butterfly-position" style={{ left: `${point.x}%`, top: `${point.y}%` }}><Butterfly/></div>}
      </div>}

      {showStory && <div className={`story-stage ${phase === "doves" ? "story-stage--hidden" : ""}`}>
        <div className="story-scroll" ref={scrollRef}>
          <div className="story-scene story-scene--arriving" key={`${phase === "doves" ? "prelude" : "story"}-${storyIndex}`}>{renderScreen(storyIndex)}</div>
        </div>
      </div>}

      {outgoingPage !== null && phase === "story" && <div className="story-outgoing" aria-hidden="true"><div className="story-scene story-scene--departing" key={`out-${outgoingPage}`}>{renderScreen(outgoingPage)}</div></div>}
      {phase === "doves" && !reducedMotion && <Doves/>}
      <AmbientButterflies/>
      <PeacockCompanion paused={paused} visible={(phase === "story" || phase === "finished") && !reducedMotion} reducedMotion={reducedMotion} page={page}/>

      {(phase !== "cover") && <div className="player-top">
        <div className="player-brand"><Monogram small/><span>KABIN CEREMONY</span></div>
        <div className="player-actions">
          <button type="button" className="player-play sound-control" data-action="true" aria-label={soundOn ? "Mute background music" : "Play background music"} aria-pressed={soundOn} onClick={toggleSound}>
            <Icon kind={soundOn ? "volume" : "mute"} size={17}/>
          </button>
          <button type="button" className="player-play" data-action="true" aria-label={paused ? "Resume invitation" : "Pause invitation"} onClick={togglePause} disabled={phase === "finished"}>
            <Icon kind={paused ? "play" : "pause"} size={18}/>
          </button>
        </div>
      </div>}

      {phase !== "cover" && <div className="player-bottom">
        <div className="player-progress-track" aria-hidden="true"><div className="player-progress" ref={barRef}/></div>
        <div className="player-caption"><span>{progressLabel}</span><span>{phase === "story" || phase === "finished" ? `${String(page + 1).padStart(2, "0")} / ${String(pageNames.length).padStart(2, "0")}` : "A & S"}</span></div>
        {(phase === "story" || phase === "finished") && <div className="player-buttons">
          <button type="button" data-action="true" onClick={() => goToPage(page - 1)} disabled={page === 0} aria-label="Previous screen"><Icon kind="back" size={16}/> Previous</button>
          <span className="player-tap-hint">{paused ? "Tap to resume" : "A story in motion · tap to pause"}</span>
          <button type="button" data-action="true" onClick={() => page < pageNames.length - 1 ? goToPage(page + 1) : replay()}>{page < pageNames.length - 1 ? "Next" : "Replay"}<Icon kind={page < pageNames.length - 1 ? "arrow" : "restart"} size={16}/></button>
        </div>}
      </div>}

      {paused && <div className="pause-indicator pause-indicator--pet" aria-live="polite" aria-label="Invitation paused. Your peacock is waiting. Tap anywhere to resume"><span><Icon kind="play" size={19}/></span><strong>Paused</strong><small>Tap anywhere to continue</small></div>}
      {phase === "finished" && <div className="finished-marker" aria-live="polite"><Icon kind="sparkles" size={15}/> A beautiful beginning, In Sha Allah</div>}
      {hint && <div className="message-toast" role="alert" data-action="true">{hint}<button onClick={() => setHint("")}>Close</button></div>}
    </div>
    <span className="sr-only" aria-live="polite">{phase === "cover" ? "Invitation ready to open." : paused ? "Invitation paused." : phase === "finished" ? "Invitation finished." : `${progressLabel} playing.`}</span>
  </main>;
}
