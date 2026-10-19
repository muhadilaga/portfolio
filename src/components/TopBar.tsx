"use client";

import React, { useState } from "react";
import { CONFIG } from "../config";

export const SECTION_IDS = [
  "home",
  "about",
  "work",
  "certifications",
  "services",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const NAV_LABELS: Record<SectionId, string> = {
  home: "Home",
  about: "About",
  work: "Work",
  certifications: "Certifications",
  services: "Services",
  contact: "Contact",
};

interface TopBarProps {
  currentSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export default function TopBar({ currentSection, onNavigate }: TopBarProps) {
  const [logoLoaded, setLogoLoaded] = useState(true);

  return (
    <header className="top">
      <a
        className={`logo ${!logoLoaded || !CONFIG.logoSrc ? "txt" : ""}`}
        id="logo"
        href="#home"
        data-go="home"
        aria-label="Beranda"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("home");
        }}
      >
        {CONFIG.logoSrc && logoLoaded ? (
          <img
            src={CONFIG.logoSrc}
            alt=""
            onError={() => setLogoLoaded(false)}
          />
        ) : (
          CONFIG.logoText
        )}
      </a>
      <nav className="nav" id="nav" aria-label="Utama">
        <div className="nav-group">
          {SECTION_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              data-go={id}
              className={currentSection === id ? "on" : ""}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(id);
              }}
            >
              {NAV_LABELS[id]}
            </a>
          ))}
        </div>
        <a
          className="cta"
          href="#contact"
          data-go="contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("contact");
          }}
        >
          Let’s Talk ↗
        </a>
      </nav>
    </header>
  );
}
