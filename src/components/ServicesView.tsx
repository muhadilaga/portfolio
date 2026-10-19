"use client";

import React from "react";
import { CONFIG } from "../config";

interface ServicesViewProps {
  active: boolean;
}

export default function ServicesView({ active }: ServicesViewProps) {
  return (
    <section
      className={`view ${active ? "is-active" : ""}`}
      id="services"
      aria-label="Services"
    >
      <div className="vl">
        <h2 className="title of rv" style={{ "--i": 0 } as React.CSSProperties}>
          Services
        </h2>
      </div>
      <div className="vr start">
        <p className="eyebrow rv" style={{ "--i": 1 } as React.CSSProperties}>
          What I can do for you
        </p>
      </div>
      <div className="cards">
        {CONFIG.services.map((s, i) => (
          <article
            key={i}
            className={`card card--${i + 1} rv`}
            style={{ "--i": i + 2 } as React.CSSProperties}
          >
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <ul>
              {s.points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
