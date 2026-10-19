"use client";

import React, { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import SocialIcon from "./SocialIcon";
import { SectionId } from "./TopBar";

interface HomeViewProps {
  active: boolean;
  onNavigate: (id: SectionId) => void;
}

export default function HomeView({ active, onNavigate }: HomeViewProps) {
  const [charLoaded, setCharLoaded] = useState(false);
  const charRef = useRef<HTMLDivElement>(null);
  const embRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CONFIG.characterSrc) return;
    const probe = new Image();
    probe.onload = () => {
      setCharLoaded(true);
    };
    probe.src = CONFIG.characterSrc;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (charRef.current) {
        charRef.current.style.transform = `translate3d(${x * 22}px, ${y * 10}px, 0)`;
      }
      if (embRef.current) {
        embRef.current.style.transform = `translate3d(${x * -16}px, ${y * -8}px, 0)`;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <section
      className={`view ${active ? "is-active" : ""}`}
      id="home"
      aria-label="Home"
    >
      {CONFIG.emblemSrc ? (
        <div className="emb" id="emb" ref={embRef} aria-hidden="true">
          <div className="emblem rv" style={{ "--i": 0 } as React.CSSProperties}>
            <img src={CONFIG.emblemSrc} alt="" />
          </div>
        </div>
      ) : null}

      <div className="hero-center">
        <h1
          className="hero-hl rv"
          style={{ "--i": 0 } as React.CSSProperties}
          aria-label={CONFIG.name}
        >
          <span className="hl hl--l" aria-hidden="true">
            {CONFIG.nameLines.map((t, idx) => (
              <i key={idx}>{t}</i>
            ))}
          </span>
          <span className="hl hl--r" aria-hidden="true">
            {CONFIG.nameLines.map((t, idx) => (
              <i key={idx}>{t}</i>
            ))}
          </span>
        </h1>
        <p
          className="sub rv"
          style={{ "--i": 2 } as React.CSSProperties}
          aria-label={CONFIG.role}
        >
          <span className="s" aria-hidden="true">
            {CONFIG.role}
          </span>
        </p>
      </div>

      <div className="char" id="char" ref={charRef}>
        <img
          className="char-img rv"
          style={{ "--i": 1 } as React.CSSProperties}
          id="charImg"
          src={CONFIG.characterSrc}
          alt=""
          hidden={!charLoaded}
        />
      </div>

      <div className="vl end">
        <p className="tag rv" style={{ "--i": 3 } as React.CSSProperties}>
          {CONFIG.tagline.map((line, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
        <a
          className="btn btn--light rv"
          style={{ "--i": 4 } as React.CSSProperties}
          href="#work"
          data-go="work"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("work");
          }}
        >
          View Work ↗
        </a>
      </div>

      <div className="vr end">
        <div
          className="hero-card rv"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <p className="eyebrow">{CONFIG.availability}</p>
          <p className="note">{CONFIG.heroNote}</p>
          <div className="socials">
            {CONFIG.socials.map((s, idx) => (
              <a
                key={idx}
                className="soc"
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon label={s.label} size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
