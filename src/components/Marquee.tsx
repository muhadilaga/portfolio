"use client";

import React from "react";
import { CONFIG } from "../config";

export default function Marquee() {
  const items = [...CONFIG.marquee, ...CONFIG.marquee];

  return (
    <div className="marquee" role="marquee" aria-label="Keahlian">
      <div className="mq-track" id="mq">
        <div className="mq-group">
          {items.map((t, idx) => (
            <span key={idx} className="mq-item">
              {t}
            </span>
          ))}
        </div>
        <div className="mq-group" aria-hidden="true">
          {items.map((t, idx) => (
            <span key={`dup-${idx}`} className="mq-item">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
