"use client";

import React from "react";
import { CONFIG } from "../config";
import { SectionId } from "./TopBar";

interface AboutViewProps {
  active: boolean;
  onNavigate: (id: SectionId) => void;
}

export default function AboutView({ active, onNavigate }: AboutViewProps) {
  return (
    <section
      className={`view ${active ? "is-active" : ""}`}
      id="about"
      aria-label="About"
    >
      <div className="vl">
        <h2 className="title of rv" style={{ "--i": 0 } as React.CSSProperties}>
          About
        </h2>
        <div className="stats rv" style={{ "--i": 2 } as React.CSSProperties}>
          {CONFIG.about.stats.map((s, idx) => (
            <div key={idx}>
              <b>{s.n}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="vr">
        <p className="eyebrow rv" style={{ "--i": 1 } as React.CSSProperties}>
          Who I am
        </p>
        <p className="lead rv" style={{ "--i": 2 } as React.CSSProperties}>
          {CONFIG.about.text}
        </p>
        <p className="eyebrow rv" style={{ "--i": 3 } as React.CSSProperties}>
          Tech stack
        </p>
        <div className="chips rv" style={{ "--i": 4 } as React.CSSProperties}>
          {CONFIG.about.stack.map((t, idx) => (
            <span key={idx} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="btns rv" style={{ "--i": 5 } as React.CSSProperties}>
          <a
            className="btn btn--solid"
            href={CONFIG.cvHref || "/cv.pdf"}
            download="CV_Muhammad_Adilaga.pdf"
          >
            Download CV ↓
          </a>
          <a
            className="btn btn--ghost"
            href="#contact"
            data-go="contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("contact");
            }}
          >
            Let’s Talk ↗
          </a>
        </div>
      </div>
    </section>
  );
}
