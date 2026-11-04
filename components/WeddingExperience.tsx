"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

type Scene = "opening" | "butterfly" | "doves" | "hero";
type ButterflyPoint = { x: number; y: number };

const BUTTERFLY_DURATION = 950;
const DOVES_DURATION = 2450;

type Flight = {
  id: number;
  top: string;
  delay: string;
  speed: string;
  scale: number;
  rotate: string;
  drift: string;
  opacity: number;
};

const flights: Flight[] = Array.from({ length: 17 }, (_, id) => ({
  id,
  top: `${10 + ((id * 31) % 79)}%`,
  delay: `${(id % 5) * 135 + (Math.floor(id / 5) % 3) * 72}ms`,
  speed: `${1200 + (id % 5) * 160}ms`,
  scale: 0.58 + ((id * 7) % 12) * 0.082,
  rotate: `${-17 + ((id * 11) % 34)}deg`,
  drift: `${-15 - (id % 5) * 14}vh`,
  opacity: 0.75 + (id % 4) * 0.07,
}));

function FlowerSprig({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`flower-sprig flower-sprig--${side}`}
      viewBox="0 0 230 240"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 205C71 167 75 112 120 71C150 42 190 23 224 8" stroke="#718c67" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M58 162C42 121 22 117 14 130C22 159 41 170 58 162Z" fill="#93a886" />
      <path d="M80 131C65 90 85 70 102 75C103 105 93 121 80 131Z" fill="#9bb18b" />
      <path d="M114 81C110 51 120 36 138 41C138 65 133 74 114 81Z" fill="#789e78" />
      <path d="M156 46C158 20 174 15 186 19C184 38 174 47 156 46Z" fill="#99ad83" />
      <path d="M165 43C187 51 195 69 189 77C167 73 157 61 165 43Z" fill="#789e78" />
      <g transform="translate(83 131)">
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-17" rx="13" ry="22" fill="#f3c9ce" stroke="#d995a6" strokeWidth="0.6" transform={`rotate(${i * 72})`} />)}
        <circle r="8" fill="#d9a35b" /><circle r="3" fill="#fff4bd" />
      </g>
      <g transform="translate(166 52) scale(.68)">
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-17" rx="13" ry="21" fill="#fffdf4" stroke="#e2cbaa" strokeWidth="0.8" transform={`rotate(${i * 72})`} />)}
        <circle r="7" fill="#e0ad5d" />
      </g>
      <g transform="translate(34 180) scale(.54)">
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx="0" cy="-17" rx="14" ry="23" fill="#fff7ec" transform={`rotate(${i * 72})`} />)}
        <circle r="8" fill="#d3a065" />
      </g>
      <circle cx="123" cy="64" r="5" fill="#e7b4ba" /><circle cx="143" cy="50" r="4" fill="#e7b4ba" />
    </svg>
  );
}

function Butterfly() {
  return (
    <div className="butterfly-flight" aria-hidden="true">
      <span className="butterfly-trail butterfly-trail--one" />
      <span className="butterfly-trail butterfly-trail--two" />
      <span className="butterfly-trail butterfly-trail--three" />
      <svg className="butterfly-art" viewBox="0 0 114 92" fill="none" focusable="false">
        <defs>
          <linearGradient id="butterfly-pink" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff5ea" /><stop offset=".42" stopColor="#f1b6bd" /><stop offset="1" stopColor="#d7998d" />
          </linearGradient>
          <linearGradient id="butterfly-gold" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fbe8bb" /><stop offset="1" stopColor="#dfb36a" />
          </linearGradient>
        </defs>
        <g className="butterfly-wing butterfly-wing--left">
          <path d="M55 49C40 5 9 4 6 23C3 40 24 58 55 55Z" fill="url(#butterfly-pink)" stroke="#b17878" strokeWidth="1.6" />
          <path d="M54 51C22 43 13 72 34 80C46 84 55 65 54 51Z" fill="url(#butterfly-gold)" stroke="#b17878" strokeWidth="1.4" />
          <path d="M16 26C27 33 38 43 50 49M30 70L52 55" stroke="#fffaf1" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="butterfly-wing butterfly-wing--right">
          <path d="M59 49C74 5 105 4 108 23C111 40 90 58 59 55Z" fill="url(#butterfly-pink)" stroke="#b17878" strokeWidth="1.6" />
          <path d="M60 51C92 43 101 72 80 80C68 84 59 65 60 51Z" fill="url(#butterfly-gold)" stroke="#b17878" strokeWidth="1.4" />
          <path d="M98 26C87 33 76 43 64 49M84 70L62 55" stroke="#fffaf1" strokeWidth="2" strokeLinecap="round" />
        </g>
        <path d="M57 45C53 27 47 26 45 25M57 45C61 27 67 26 69 25" stroke="#785b44" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="57" cy="56" rx="3.7" ry="19" fill="#685449" />
      </svg>
    </div>
  );
}

function DoveIcon() {
  return (
    <svg className="dove-art" viewBox="0 0 136 102" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dove-body" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" /><stop offset="1" stopColor="#dce7e9" />
        </linearGradient>
      </defs>
      <path d="M26 62C14 65 5 75 4 79C25 82 39 76 51 71" fill="#ecf4f3" />
      <path d="M39 67C24 77 18 92 20 96C43 91 55 79 62 71" fill="#fff" />
      <path d="M53 59C69 48 78 43 96 46C104 46 114 37 120 33L118 48L133 46L120 54C114 62 103 65 89 68C81 76 67 79 53 75C41 72 37 65 53 59Z" fill="url(#dove-body)" stroke="#d8e3e4" strokeWidth="1.1" />
      <g className="dove-wing dove-wing--back">
        <path d="M70 57C62 33 42 14 20 4C29 31 38 53 61 73Z" fill="#ecf4f3" stroke="#cedfe0" strokeWidth="1" />
      </g>
      <g className="dove-wing dove-wing--front">
        <path d="M79 59C77 33 59 12 35 2C37 32 46 58 65 74Z" fill="#ffffff" stroke="#d6e5e6" strokeWidth="1.1" />
        <path d="M46 20C51 37 57 50 70 64" stroke="#e2ebeb" strokeWidth="1.1" strokeLinecap="round" />
      </g>
      <circle cx="114" cy="45" r="2.1" fill="#51646d" />
      <path d="M130 49L136 51L129 54Z" fill="#dfb77d" />
    </svg>
  );
}

function DoveTransition({ active }: { active: boolean }) {
  return (
    <div className={`dove-transition ${active ? "dove-transition--active" : ""}`} aria-hidden="true">
      <div className="dove-transition__veil" />
      {flights.map((flight) => (
        <div
          className="dove-flight"
          key={flight.id}
          style={
            {
              "--flight-y": flight.top,
              "--flight-delay": flight.delay,
              "--flight-speed": flight.speed,
              "--flight-scale": flight.scale,
              "--flight-angle": flight.rotate,
              "--flight-drift": flight.drift,
              "--flight-opacity": flight.opacity,
            } as CSSProperties
          }
        >
          <DoveIcon />
        </div>
      ))}
    </div>
  );
}

export default function WeddingExperience() {
  const [scene, setScene] = useState<Scene>("opening");
  const [butterflyPoint, setButterflyPoint] = useState<ButterflyPoint>({ x: 50, y: 50 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const scheduled = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef<Scene>("opening");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    const image = new window.Image();
    image.src = "/arif-suchana.webp";
    return () => {
      media.removeEventListener("change", update);
      scheduled.current.forEach(clearTimeout);
      scheduled.current = [];
    };
  }, []);

  const changeScene = useCallback((next: Scene) => {
    stageRef.current = next;
    setScene(next);
  }, []);

  const openInvitation = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (stageRef.current !== "opening") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const hasPointer = event.detail !== 0;
    const x = hasPointer ? ((event.clientX - rect.left) / rect.width) * 100 : 50;
    const y = hasPointer ? ((event.clientY - rect.top) / rect.height) * 100 : 50;
    setButterflyPoint({ x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) });

    scheduled.current.forEach(clearTimeout);
    scheduled.current = [];

    if (reducedMotion) {
      changeScene("hero");
      return;
    }

    changeScene("butterfly");
    scheduled.current.push(setTimeout(() => changeScene("doves"), BUTTERFLY_DURATION));
    scheduled.current.push(setTimeout(() => changeScene("hero"), BUTTERFLY_DURATION + DOVES_DURATION));
  }, [changeScene, reducedMotion]);

  const replay = useCallback(() => {
    scheduled.current.forEach(clearTimeout);
    scheduled.current = [];
    changeScene("opening");
  }, [changeScene]);

  const openingVisible = scene !== "hero";
  const transitionActive = scene === "doves";

  return (
    <main className={`wedding-app wedding-app--${scene}`}>
      <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

      <section className={`opening-scene ${openingVisible ? "" : "opening-scene--gone"}`} aria-label="Open the Kabin invitation" aria-hidden={!openingVisible}>
        <button
          type="button"
          className="opening-click-area"
          onClick={openInvitation}
          disabled={scene !== "opening"}
          aria-label="Open Arif Rahman and Suchana Sarker's Kabin invitation"
          tabIndex={scene === "opening" ? 0 : -1}
        >
          <div className="invitation-card">
            <span className="invitation-card__inner-border" aria-hidden="true" />
            <FlowerSprig side="left" />
            <FlowerSprig side="right" />
            <div className="tiny-star tiny-star--one" aria-hidden="true">✧</div>
            <div className="tiny-star tiny-star--two" aria-hidden="true">✧</div>
            <div className="tiny-star tiny-star--three" aria-hidden="true">✧</div>
            <div className="card-content">
              <div className="card-prelude">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              <div className="card-subheading">WITH LOVE AND BLESSINGS</div>
              <div className="crest" aria-label="A and S">
                <span className="crest__letter">A</span>
                <span className="crest__heart" aria-hidden="true">♥</span>
                <span className="crest__letter">S</span>
              </div>
              <div className="card-divider" aria-hidden="true"><span />✦<span /></div>
              <h1 className="card-title">Kabin Ceremony</h1>
              <p className="card-names">Arif Rahman <span>&</span> Suchana Sarker</p>
              <div className="card-footer">
                <span className="card-footer__butterfly" aria-hidden="true">✦</span>
                <span className="card-footer__label">TAP ANYWHERE TO OPEN</span>
                <span className="card-footer__hint">Your invitation awaits</span>
              </div>
            </div>
          </div>
          <span className="screen-bottom-hint">Tap anywhere to begin <span aria-hidden="true">↗</span></span>
        </button>
      </section>

      <section className={`hero-scene ${scene === "doves" || scene === "hero" ? "hero-scene--revealed" : ""}`} aria-label="Arif and Suchana's Kabin ceremony" aria-hidden={scene !== "hero"}>
        <div className="hero-paper">
          <div className="hero-heading">
            <span className="hero-heading__prelude">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hero-heading__eyebrow">THE BEGINNING OF FOREVER</span>
          </div>
          <div className="hero-portrait-wrap">
            <Image
              src="/arif-suchana.webp"
              alt="Illustration of Arif Rahman seated in traditional attire beside Suchana Sarker, with the A and S floral monogram above them"
              width={640}
              height={853}
              sizes="(max-width: 540px) 100vw, 540px"
              priority
              className="hero-portrait"
            />
          </div>
          <div className="hero-caption">
            <div className="hero-caption__ornament" aria-hidden="true">✧ &nbsp; ❀ &nbsp; ✧</div>
            <h2>Arif <span>&</span> Suchana</h2>
            <p>KABIN CEREMONY</p>
            <button className="replay-button" type="button" onClick={replay} tabIndex={scene === "hero" ? 0 : -1} aria-label="Replay the opening invitation animation">
              <span aria-hidden="true">↻</span> Replay invitation
            </button>
          </div>
        </div>
      </section>

      {scene === "butterfly" && (
        <div
          className="butterfly-anchor"
          style={{ left: `${butterflyPoint.x}%`, top: `${butterflyPoint.y}%` }}
        >
          <Butterfly />
        </div>
      )}

      <DoveTransition active={transitionActive} />
      <span className="sr-only" aria-live="polite">
        {scene === "opening" && "Invitation ready. Tap or press Enter to open."}
        {scene === "butterfly" && "The invitation is opening."}
        {scene === "doves" && "White doves are revealing the invitation."}
        {scene === "hero" && "Welcome to Arif and Suchana's Kabin ceremony."}
      </span>
    </main>
  );
}
