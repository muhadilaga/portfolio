"use client";

import React, { useState } from "react";
import { CONFIG, Certificate } from "../config";

interface CertificationsViewProps {
  active: boolean;
}

export default function CertificationsView({ active }: CertificationsViewProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [slicing, setSlicing] = useState(false);

  const certificates: Certificate[] = CONFIG.certificates;
  const total = certificates.length;

  const nextCard = () => {
    if (slicing) return;
    setSlicing(true);
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % total);
      setSlicing(false);
    }, 240);
  };

  const prevCard = () => {
    if (slicing) return;
    setActiveIdx((prev) => (prev - 1 + total) % total);
  };

  return (
    <section
      className={`view ${active ? "is-active" : ""}`}
      id="certifications"
      aria-label="Certifications"
    >
      <div className="vl cert-vl">
        <div>
          <h2 className="title cert-title of rv" style={{ "--i": 0 } as React.CSSProperties}>
            Certifications
          </h2>
          <p
            className="lead lead--w rv"
            style={{ "--i": 1, marginTop: "1.5rem" } as React.CSSProperties}
          >
            Continuous learning and verified technical competencies in AI, Data Science,
            Cloud, and Software Architecture.
          </p>
        </div>
        <div className="stats rv" style={{ "--i": 2 } as React.CSSProperties}>
          <div>
            <b>{total}</b>
            <span>Verified Credentials</span>
          </div>
        </div>
      </div>

      <div className="vr cert-vr">
        <div className="cert-deck-container rv" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="cert-deck-stack">
            {[2, 1, 0].map((offset) => {
              const idx = (activeIdx + offset) % total;
              const cert = certificates[idx];
              const isTop = offset === 0;
              const fileHref = cert.file ? `/certificates/${cert.file}` : undefined;
              const thumbSrc = cert.thumb ? `/certificates/${cert.thumb}` : undefined;

              return (
                <div
                  key={idx}
                  className={`cert-deck-card cert-deck-card--${offset} ${
                    isTop && slicing ? "is-slicing" : ""
                  }`}
                  onClick={isTop ? nextCard : undefined}
                  title={isTop ? "Click card to slice to next certificate" : undefined}
                  role={isTop ? "button" : undefined}
                  tabIndex={isTop ? 0 : -1}
                  onKeyDown={
                    isTop
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            nextCard();
                          }
                        }
                      : undefined
                  }
                >
                  {thumbSrc && (
                    <div className="cert-deck-thumb">
                      <img src={thumbSrc} alt={cert.name} loading="lazy" />
                    </div>
                  )}
                  <div className="cert-deck-body">
                    {isTop ? (
                      <>
                        <div className="cert-deck-meta">
                          <span className="cert-deck-issuer">{cert.issuer}</span>
                          <span className="cert-deck-date">{cert.date}</span>
                        </div>
                        <h3 className="cert-deck-name">{cert.name}</h3>
                        <div className="cert-deck-actions">
                          {fileHref && (
                            <a
                              href={fileHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn--solid cert-open-btn"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Certificate PDF ↗
                            </a>
                          )}
                          {cert.verify && (
                            <a
                              href={cert.verify}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cert-verify-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Verify Credential ↗
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="cert-deck-meta" style={{ opacity: 0 }}>
                        <span className="cert-deck-issuer">&nbsp;</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deck Controls */}
          <div className="cert-deck-controls">
            <button
              className="cert-nav-btn"
              onClick={prevCard}
              aria-label="Previous certificate"
            >
              ← Prev
            </button>
            <div className="cert-deck-counter">
              <b>{String(activeIdx + 1).padStart(2, "0")}</b>
              <span>/ {String(total).padStart(2, "0")}</span>
            </div>
            <button
              className="cert-nav-btn cert-nav-btn--next"
              onClick={nextCard}
              aria-label="Next certificate"
            >
              Next Card →
            </button>
          </div>
          <p className="cert-deck-hint">
            Click the card or use controls to browse through all {total} certificates.
          </p>
        </div>
      </div>
    </section>
  );
}
