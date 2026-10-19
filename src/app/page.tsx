"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import TopBar, { SECTION_IDS, SectionId } from "../components/TopBar";
import Loader from "../components/Loader";
import HomeView from "../components/HomeView";
import AboutView from "../components/AboutView";
import WorkView from "../components/WorkView";
import CertificationsView from "../components/CertificationsView";
import ServicesView from "../components/ServicesView";
import ContactView from "../components/ContactView";
import Marquee from "../components/Marquee";

export default function Page() {
  const [currentSection, setCurrentSection] = useState<SectionId>("home");
  const [revealedSections, setRevealedSections] = useState<Set<SectionId>>(
    new Set(["home"])
  );
  const [showLoader, setShowLoader] = useState(true);
  const isScrollingRef = useRef(false);

  const scrollToSection = useCallback((id: SectionId) => {
    setCurrentSection(id);
    setRevealedSections((prev) => new Set([...prev, id]));
    isScrollingRef.current = true;

    const el = document.getElementById(id) || document.getElementById("v-" + id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }

    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", "#" + id);
      } catch (e) {
        // ignore
      }
    }

    setTimeout(() => {
      isScrollingRef.current = false;
      setRevealedSections((prev) => new Set([...prev, id]));
    }, 800);
  }, []);

  const handleLoaderDone = useCallback(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1) as SectionId;
      if (SECTION_IDS.includes(hash)) {
        scrollToSection(hash);
        return;
      }
    }
    setRevealedSections((prev) => new Set([...prev, "home"]));
  }, [scrollToSection]);

  const handleLoaderDestroy = useCallback(() => {
    setShowLoader(false);
  }, []);

  // Scroll spy & reveal trigger
  useEffect(() => {
    const checkVisibility = () => {
      let currentInView: SectionId = "home";

      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id) || document.getElementById("v-" + id);
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // Reveal section if it has entered the screen
        if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
          setRevealedSections((prev) => {
            if (prev.has(id)) return prev;
            return new Set([...prev, id]);
          });
        }

        // Calculate overlap with center of viewport for scroll spy
        const viewCenter = window.innerHeight / 2;
        if (rect.top <= viewCenter && rect.bottom >= viewCenter) {
          currentInView = id;
        }
      });

      if (!isScrollingRef.current) {
        setCurrentSection(currentInView);
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    // Initial checks
    checkVisibility();
    const t1 = setTimeout(checkVisibility, 200);
    const t2 = setTimeout(checkVisibility, 800);

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Listen to hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      if (SECTION_IDS.includes(hash)) {
        scrollToSection(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [scrollToSection]);

  return (
    <div className="app" id="app">
      <div className="panel panel--l" aria-hidden="true">
        <div className="glow"></div>
      </div>
      <div className="panel panel--r" aria-hidden="true"></div>

      <TopBar currentSection={currentSection} onNavigate={scrollToSection} />

      <main id="content">
        <HomeView
          active={revealedSections.has("home")}
          onNavigate={scrollToSection}
        />
        <AboutView
          active={revealedSections.has("about")}
          onNavigate={scrollToSection}
        />
        <WorkView active={revealedSections.has("work")} />
        <CertificationsView active={revealedSections.has("certifications")} />
        <ServicesView active={revealedSections.has("services")} />
        <ContactView active={revealedSections.has("contact")} />
      </main>

      <Marquee />

      {showLoader && (
        <Loader onDone={handleLoaderDone} onDestroy={handleLoaderDestroy} />
      )}
    </div>
  );
}
