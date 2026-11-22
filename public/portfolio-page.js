// Singleton page object for the portfolio. The React app registers real data at
// mount (AgentAssistant.tsx); site-actions.js and site.js import this same module
// URL, so all three share one instance. No facts are hard-coded here except the
// email address the site already publishes.
export const PortfolioPage = {
  _data: null,
  _section: "home",

  registerData(data) {
    this._data = data;
  },

  getState() {
    if (!this._data) {
      return { ok: false, reason: "Portfolio data is not ready yet." };
    }
    // Work the date out from the clock each time the state is read, not from values
    // set when the page loaded: the page may stay open past midnight.
    const now = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = {
      iso: now.toISOString().slice(0, 10),
      weekday: weekdays[now.getDay()],
      display: now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    // The React app updates the hash on every navigation, so it names the current
    // section even when the visitor scrolled with the page's own controls.
    let section = this._section;
    if (typeof window !== "undefined" && window.location && typeof window.location.hash === "string") {
      const hash = window.location.hash.slice(1);
      if (this._data.sections.some((s) => s.id === hash)) {
        section = hash;
      }
    }
    // Return a copy, not the live registered data.
    const data = JSON.parse(JSON.stringify(this._data));
    return { ok: true, today, currentSection: section, ...data };
  },

  navigateToSection(id) {
    let el = null;
    if (typeof document !== "undefined") {
      try {
        el = document.getElementById(id) || document.getElementById("v-" + id);
      } catch (e) {
        el = null;
      }
    }
    if (!el) {
      return { ok: false, reason: `Unknown section: ${id}`, field: "section" };
    }
    if (typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth" });
    }
    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", "#" + id);
      } catch (e) {
        // ignore
      }
    }
    this._section = id;
    return { ok: true, section: id };
  },

  openProjectLink(name) {
    if (!this._data) {
      return { ok: false, reason: "Portfolio data is not ready yet." };
    }
    const project = this._data.projects.find((p) => p.name === name);
    if (!project) {
      return { ok: false, reason: `Unknown project: ${name}`, field: "project" };
    }
    if (!project.link) {
      return { ok: false, reason: `${name} has no public link.`, field: "project" };
    }
    if (typeof window === "undefined" || typeof window.open !== "function") {
      return {
        ok: false,
        reason: "Your browser blocked the new tab. Here is the link instead.",
        link: project.link,
      };
    }
    const opened = window.open(project.link, "_blank", "noopener");
    if (!opened) {
      return {
        ok: false,
        reason: "Your browser blocked the new tab. Here is the link instead.",
        link: project.link,
      };
    }
    return { ok: true, project: name, link: project.link };
  },

  async copyEmail() {
    const email = "muhadilaga07@gmail.com";
    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard ||
      typeof navigator.clipboard.writeText !== "function"
    ) {
      return { ok: false, reason: "Clipboard is not available in this browser." };
    }
    try {
      await navigator.clipboard.writeText(email);
    } catch (e) {
      return { ok: false, reason: "Clipboard is not available in this browser." };
    }
    return { ok: true, email };
  },
};
