"use client";

import React, { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";

const LOADER_LINES = [
  "M-2000 744 L3300 -422",
  "M-2000 1114 L3300 -31",
  "M424 -400 L90 1150",
  "M1213 -400 L872 1150",
];

interface LoaderProps {
  onDone: () => void;
  onDestroy: () => void;
}

export default function Loader({ onDone, onDestroy }: LoaderProps) {
  const [isDone, setIsDone] = useState(false);
  const [isExit, setIsExit] = useState(false);

  const numRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const msgRef = useRef<HTMLParagraphElement>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("noloader")) {
      onDone();
      onDestroy();
      return;
    }

    const L = CONFIG.loader;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minTime = reduce ? 500 : L.minDuration;

    const decode = (src: string) => {
      if (!src) return null;
      try {
        return new Promise((res) => {
          const i = new Image();
          i.onload = i.onerror = () => res(null);
          i.src = src;
        });
      } catch {
        return null;
      }
    };

    let fontPromise: Promise<unknown> | null = null;
    try {
      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        fontPromise = document.fonts.ready.catch(() => null);
      }
    } catch {
      fontPromise = null;
    }

    const waits = [
      fontPromise,
      decode(L.src),
      decode(CONFIG.characterSrc),
      decode(CONFIG.emblemSrc),
    ].filter(Boolean);

    let ready = false;
    Promise.race([
      Promise.all(waits),
      new Promise((r) => setTimeout(r, 7000)),
    ])
      .then(() => {
        ready = true;
      })
      .catch(() => {
        ready = true;
      });

    let shown = 0;
    let msgIdx = -1;
    let done = false;
    let raf = 0;
    const t0 = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(failsafeTimer);
      cancelAnimationFrame(raf);
      if (numRef.current) numRef.current.textContent = "100";
      if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      if (msgRef.current) msgRef.current.textContent = L.doneMessage;

      setIsDone(true);
      setTimeout(
        () => {
          setIsExit(true);
          setTimeout(onDone, reduce ? 0 : 450);
          setTimeout(onDestroy, reduce ? 80 : 1500);
        },
        reduce ? 0 : 550
      );
    };

    finishRef.current = finish;

    // Failsafe ABSOLUT: 9000ms tanpa syarat
    const failsafeTimer = setTimeout(() => {
      finish();
    }, 9000);

    const tick = (now: number) => {
      const t = Math.min((now - t0) / minTime, 1);
      const eased = 1 - Math.pow(1 - t, 2.2);
      const target = ready ? eased * 100 : Math.min(eased * 100, 92);
      shown += (target - shown) * 0.12;
      if (t >= 1 && ready && shown > 99.5) shown = 100;

      if (numRef.current) {
        numRef.current.textContent = String(Math.round(shown)).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${shown / 100})`;
      }

      const i = Math.min(
        L.messages.length - 1,
        Math.floor(shown / (100 / L.messages.length))
      );
      if (i !== msgIdx) {
        msgIdx = i;
        if (msgRef.current) {
          msgRef.current.textContent = L.messages[i];
          msgRef.current.classList.remove("swap");
          void msgRef.current.offsetWidth;
          msgRef.current.classList.add("swap");
        }
      }

      if (shown >= 100) return finish();
      raf = requestAnimationFrame(tick);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        finish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(failsafeTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDone, onDestroy]);

  const L = CONFIG.loader;

  return (
    <div
      className={`loader ${isDone ? "is-done" : ""} ${isExit ? "is-exit" : ""}`}
      role="status"
      aria-label="Memuat portfolio"
    >
      <div
        className="ld-bg"
        style={L.src ? { backgroundImage: `url("${L.src}")` } : undefined}
      ></div>
      <div className="ld-poster">
        {L.src ? <img className="ld-img" src={L.src} alt="" /> : null}
        <i className="ld-eye"></i>
        <i className="ld-ripple"></i>
        <i className="ld-ripple" style={{ animationDelay: "1.2s" }}></i>
        <svg className="ld-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="48" />
        </svg>
        <svg
          className="ld-lines"
          viewBox="-2614 -368 6535 1472"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {LOADER_LINES.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </svg>
      </div>
      <div className="ld-scan"></div>
      <div className="ld-ui">
        <div className="ld-top">
          <p
            className="ld-tag ld-rise"
            style={{ "--d": ".2s" } as React.CSSProperties}
          >
            {L.tag}
          </p>
          <button
            className="ld-skip ld-rise"
            style={{ "--d": ".3s" } as React.CSSProperties}
            id="ldSkip"
            type="button"
            onClick={() => finishRef.current()}
            onPointerDown={(e) => {
              if (e.button === 0) {
                finishRef.current();
              }
            }}
          >
            {L.skip}
          </button>
        </div>
        <div>
          <div className="ld-bottom">
            <h2
              className="ld-rise"
              style={{ "--d": ".5s" } as React.CSSProperties}
              aria-hidden="true"
            >
              <span className="ld-name of">
                {CONFIG.nameLines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </span>
            </h2>
            <p
              className="ld-count ld-rise"
              style={{ "--d": ".7s" } as React.CSSProperties}
              aria-hidden="true"
            >
              <b id="ldNum" ref={numRef}>
                000
              </b>
              <span>%</span>
            </p>
          </div>
          <div
            className="ld-foot ld-rise"
            style={{ "--d": ".9s" } as React.CSSProperties}
          >
            <p className="ld-msg" id="ldMsg" ref={msgRef}></p>
            <div className="ld-bar">
              <i id="ldBar" ref={barRef}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
