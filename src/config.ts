import { SITE_CONTENT } from "./site-content";
import certificatesData from "../public/certificates/certificates.json";

export interface Project {
  name: string;
  desc: string;
  tags: string[];
  link: string;
  image?: string;
}

export interface Service {
  title: string;
  desc: string;
  points: string[];
}

export interface Social {
  label: string;
  href: string;
}

export interface Stat {
  n: string;
  l: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  file?: string;
  thumb?: string;
  verify?: string;
}

export interface Config {
  name: string;
  nameLines: string[];
  role: string;
  logoText: string;
  logoSrc: string;
  emblemSrc: string;
  characterSrc: string;
  availability: string;
  heroNote: string;
  tagline: string[];
  cvHref: string;
  loader: {
    src: string;
    tag: string;
    skip: string;
    minDuration: number;
    messages: string[];
    doneMessage: string;
  };
  marquee: string[];
  socials: Social[];
  about: {
    text: string;
    stats: Stat[];
    stack: string[];
  };
  projects: Project[];
  certificates: Certificate[];
  services: Service[];
  contact: {
    text: string;
    whatsapp: string;
  };
}

const PROJECT_IMAGES: Record<string, string> = {
  "ML Playground": "/projects/ml-playground.png",
};

export const CONFIG: Config = {
  name: SITE_CONTENT.name,
  nameLines: SITE_CONTENT.nameLines,
  role: SITE_CONTENT.role,
  logoText: SITE_CONTENT.logoText,
  logoSrc: "/emblem.webp",
  emblemSrc: "/emblem.webp",
  characterSrc: "/character.webp",
  availability: SITE_CONTENT.availability,
  heroNote: SITE_CONTENT.heroNote,
  tagline: SITE_CONTENT.tagline,
  cvHref: "/cv.pdf",
  loader: {
    src: "/loader.webp",
    tag: "Portfolio — 2026",
    skip: "Skip ↗",
    minDuration: 2800,
    messages: ["Initializing", "Loading assets", "Compiling interface", "Awakening the eye"],
    doneMessage: "Ready — entering",
  },
  marquee: SITE_CONTENT.marquee,
  socials: SITE_CONTENT.socials,
  about: {
    text: SITE_CONTENT.about.text,
    stats: SITE_CONTENT.about.stats.map((s) => {
      if (s.l.toLowerCase().includes("certif")) {
        return { ...s, n: String(certificatesData.length) };
      }
      if (s.l.toLowerCase().includes("project")) {
        return { ...s, n: String(SITE_CONTENT.projects.length) };
      }
      return s;
    }),
    stack: SITE_CONTENT.about.stack,
  },
  projects: SITE_CONTENT.projects.map((p) => ({
    ...p,
    image: PROJECT_IMAGES[p.name] || "",
  })),
  certificates: certificatesData as Certificate[],
  services: [
    {
      title: "Web Development",
      desc: "Clean, fast websites that make your business look professional.",
      points: ["Landing Pages", "Company Profiles", "Dashboards", "Web Apps"],
    },
    {
      title: "AI Integration",
      desc: "Practical AI features that fit smoothly into your product.",
      points: ["Chatbots", "Data Pipelines", "ML Models", "Automation"],
    },
    {
      title: "REST API",
      desc: "Reliable, well-documented backends your apps can build on.",
      points: ["API Design", "Auth", "Databases", "Deployment"],
    },
  ],
  contact: {
    text: SITE_CONTENT.contact.text,
    whatsapp: SITE_CONTENT.contact.whatsapp,
  },
};
