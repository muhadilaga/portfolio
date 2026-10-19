// ============================================================
// SITE-CONTENT.ts — DATA ASLI Muhammad Adilaga
// Cara pakai: saat convert portfolio-final-2.html ke Next.js,
// pakai object SITE_CONTENT ini sebagai ISI dari CONFIG.
// (Jangan pakai placeholder "Project One" / WA 6281234567890
//  yang ada di file HTML.)
// ============================================================

export const SITE_CONTENT = {
  name: "Muhammad Adilaga",
  nameLines: ["Muhammad", "Adilaga"],
  role: "Web & AI Developer",
  logoText: "MA",
  availability: "Open to work",
  heroNote: "Fast web apps. Smart AI systems.",
  tagline: ["Code that works", "AI that ships"],
  cvHref: "/cv.pdf",

  marquee: ["Web Development", "AI Systems", "Machine Learning", "REST API", "Open to Work"],

  socials: [
    { label: "WhatsApp", href: "https://wa.me/6285721309752" },
    { label: "GitHub", href: "https://github.com/muhadilaga" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-adilaga-b9717a386/" },
  ],

  about: {
    text: "Fresh graduate with a B.S. in Informatics from Universitas Nahdlatul Ulama Cirebon. I build reliable, high-performance web systems and integrate practical AI workflows \u2014 from full-stack platforms and REST microservices to applied machine learning and local LLM automations.",
    stats: [
      { n: "4", l: "Featured projects" },
      { n: "10", l: "Certifications" },
      { n: "10", l: "Technologies" },
    ],
    stack: ["JavaScript", "TypeScript", "React", "Next.js", "PHP", "Laravel", "Python", "PostgreSQL", "MySQL", "REST API"],
  },

  projects: [
    {
      name: "ML Playground",
      desc: "No-code machine learning web app — upload CSV datasets, train scikit-learn models, and generate a ready-to-use /predict REST API.",
      tags: ["Next.js", "FastAPI", "scikit-learn"],
      link: "https://ml.muhadilaga.my.id",
    },
    {
      name: "LeafGuard",
      desc: "Plant pest detection system — Laravel web platform paired with a YOLO object-detection microservice.",
      tags: ["Laravel", "YOLO", "FastAPI"],
      link: "https://github.com/muhadilaga/leafguard-ai-pest-detection",
    },
    {
      name: "Bareskrim Rekrutmen",
      desc: "Full-stack recruitment & online exam platform untuk komunitas Roblox roleplay (Bareskrim Polri RP) — registrasi casis dengan verifikasi identitas Roblox, ujian 20 soal (15 pilihan ganda + 5 essay) dengan auto-grading server-side, admin panel dengan 2-step verification, laporan real-time ke Discord, dan anti-cheat.",
      tags: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "Vitest", "Playwright"],
      link: "https://github.com/muhadilaga/bareskrim-rekrutmen",
    },
    {
      name: "Smart Home Energy Monitoring",
      desc: "Undergraduate thesis: ESP32 sensor telemetry combined with Random Forest regression for household energy efficiency.",
      tags: ["ESP32", "Random Forest", "IoT"],
      link: "https://github.com/muhadilaga/smart-energy-firebase-complete",
    },
  ],

  contact: {
    text: "Have a project in mind? Send me a message and let\u2019s build it together.",
    whatsapp: "6285721309752", // format internasional tanpa +
  },
};
