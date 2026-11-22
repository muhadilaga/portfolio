"use client";

import React, { useEffect } from "react";
import { CONFIG } from "../config";

// The certifications the assistant may cite (BUILD_PLAN §1). The site shows more
// (Google AI Essentials, KarirNex UI/UX and others), but the agent only answers
// from these four.
const ALLOWED_CERT_NAMES = [
  "Belajar Prinsip Pemrograman SOLID",
  "Spec-Driven Development dengan Kiro",
  "IT-AI Agent for Programming",
  "Software Engineer Intern",
];

const SECTION_LABELS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "certifications", label: "Certifications" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

type AgentData = {
  profile: {
    name: string;
    role: string;
    location: string;
    availability: string;
    email: string;
  };
  education: {
    university: string;
    degree: string;
    years: string;
    gpa: string;
    status: string;
    english: string;
    experience: string;
  };
  org: { role: string; org: string; period: string }[];
  publication: { title: string; venue: string; doi: string };
  projects: { name: string; desc: string; tags: string[]; link?: string }[];
  skills: string[];
  certifications: { name: string; issuer: string; date: string; verify?: string }[];
  services: { title: string; desc: string; points: string[] }[];
  contact: { email: string; whatsapp: string; github: string; linkedin: string };
  sections: { id: string; label: string }[];
};

// Build the agent-visible data from CONFIG plus the verified constants that live
// nowhere in CONFIG (education, org, publication). The Work gallery stays the
// single source of truth for projects; the agent answers from the same data.
function buildAgentData(): AgentData {
  const social = (label: string) =>
    CONFIG.socials.find((s) => s.label === label)?.href ?? "";
  return {
    profile: {
      name: CONFIG.name,
      role: CONFIG.role,
      location: "Cirebon, Jawa Barat, Indonesia",
      availability: CONFIG.availability,
      email: "muhadilaga07@gmail.com",
    },
    education: {
      university: "Universitas Nahdlatul Ulama Cirebon",
      degree: "S1 Teknik Informatika (B.S. in Informatics)",
      years: "2022–2026",
      gpa: "3.46",
      status: "Awaiting yudisium",
      english: "Basic",
      experience:
        "0 years of professional experience (fresh graduate, project-based only)",
    },
    org: [
      {
        role: "Koordinator Pemuda dan Olahraga",
        org: "BEM Ilmu Komputer, Universitas Nahdlatul Ulama Cirebon",
        period: "June 2024 – May 2025",
      },
      {
        role: "Ketua Pelaksana Musyawarah Besar",
        org: "BEM Fakultas Ilmu Komputer",
        period: "May 2025",
      },
    ],
    publication: {
      title:
        "Kolaborasi Digitalisasi UMKM dan Pembuatan Video Profil Desa Ciawigajah",
      venue: "Prosiding Seminar Nasional Pengabdian Masyarakat 5(1), 2025",
      doi: "https://doi.org/10.52188/psnpm.v5i1.1626",
    },
    projects: CONFIG.projects.map((p) => ({
      name: p.name,
      desc: p.desc,
      tags: [...p.tags],
      ...(p.link ? { link: p.link } : {}),
    })),
    // CONFIG.about.stack lists 10, including "REST API". The agent's skill list is
    // the 12 verified skills (BUILD_PLAN §1): the stack without "REST API", plus
    // FastAPI, scikit-learn and Tailwind CSS.
    skills: [
      ...CONFIG.about.stack.filter((s) => s !== "REST API"),
      "FastAPI",
      "scikit-learn",
      "Tailwind CSS",
    ],
    certifications: CONFIG.certificates
      .filter((c) => ALLOWED_CERT_NAMES.includes(c.name))
      .map((c) => ({
        name: c.name,
        issuer: c.issuer,
        date: c.date,
        ...(c.verify ? { verify: c.verify } : {}),
      })),
    services: CONFIG.services.map((s) => ({
      title: s.title,
      desc: s.desc,
      points: [...s.points],
    })),
    contact: {
      email: "muhadilaga07@gmail.com",
      whatsapp: `https://wa.me/${CONFIG.contact.whatsapp}`,
      github: social("GitHub"),
      linkedin: social("LinkedIn"),
    },
    sections: SECTION_LABELS.map((s) => ({ ...s })),
  };
}

// Guard against React StrictMode running the effect twice in dev: the runtime
// boots once per page load.
let bootStarted = false;

export default function AgentAssistant() {
  useEffect(() => {
    if (bootStarted) {
      return;
    }
    bootStarted = true;
    let cancelled = false;
    (async () => {
      try {
        // The specifier is a variable, so TypeScript types the import as
        // Promise<any> and webpackIgnore keeps the bundler from trying to
        // resolve a public/ URL at build time: the file is fetched at runtime.
        const pageUrl = "/portfolio-page.js";
        const pageModule = await import(/* webpackIgnore: true */ pageUrl);
        if (cancelled) {
          return;
        }
        pageModule.PortfolioPage.registerData(buildAgentData());
        const siteUrl = "/site.js";
        const siteModule = await import(/* webpackIgnore: true */ siteUrl);
        if (cancelled) {
          return;
        }
        await siteModule.AssistantMount.start();
      } catch (error) {
        // The page must keep working without the assistant.
        console.error("Assistant startup failed", error);
        const status = document.querySelector("#assistant-status");
        if (status) {
          status.textContent =
            "The assistant could not load. You can still use the page directly.";
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="assistant" className="assistant" aria-labelledby="assistant-heading">
      <h2 id="assistant-heading">Ask the Portfolio Guide</h2>
      <p>
        Ask about Muhammad&rsquo;s projects, skills, education and
        certifications — or ask the assistant to show you around the site.
      </p>
      <p className="assistant-note">
        Your messages and this page&rsquo;s data go to the LLM provider you choose
        in the settings below. You confirm anything that cannot be undone before
        it happens.
      </p>
      <p id="assistant-status" role="status">
        Connecting the assistant… If this message stays, the assistant could not
        load. You can still use the page directly.
      </p>
      <div id="agent-app">
        <div data-ns-slot="header"></div>
        <div className="assistant-panels">
          <div data-ns-slot="chat"></div>
          <div data-ns-slot="agents"></div>
        </div>
        <div data-ns-slot="settings"></div>
      </div>
    </section>
  );
}
