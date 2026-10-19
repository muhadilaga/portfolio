"use client";

import React, { useState } from "react";
import { CONFIG } from "../config";
import SocialIcon from "./SocialIcon";

interface ContactViewProps {
  active: boolean;
}

export default function ContactView({ active }: ContactViewProps) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = msg.trim();
    const text = encodeURIComponent(`Halo, saya ${trimmedName || "-"}. ${trimmedMsg}`);
    window.open(`https://wa.me/${CONFIG.contact.whatsapp}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className={`view ${active ? "is-active" : ""}`}
      id="contact"
      aria-label="Contact"
    >
      <div className="vl">
        <h2 className="title of rv" style={{ "--i": 0 } as React.CSSProperties}>
          Let’s<br />Talk
        </h2>
        <div>
          <p
            className="lead lead--w rv"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {CONFIG.contact.text}
          </p>
          <div
            className="socials-contact rv"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {CONFIG.socials.map((s, idx) => (
              <a
                key={idx}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="soc-btn"
                aria-label={s.label}
                title={s.label}
              >
                <SocialIcon label={s.label} size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <form
        className="vr"
        id="form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <p className="eyebrow rv" style={{ "--i": 1 } as React.CSSProperties}>
          Send a message
        </p>
        <label
          className="field rv"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          Your name
          <input
            id="fName"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label
          className="field rv"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          Your message
          <textarea
            id="fMsg"
            rows={4}
            placeholder="Tell me about your project…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </label>
        <button
          className="btn btn--solid rv"
          style={{ "--i": 4 } as React.CSSProperties}
          type="submit"
        >
          Send via WhatsApp ↗
        </button>
      </form>
    </section>
  );
}
