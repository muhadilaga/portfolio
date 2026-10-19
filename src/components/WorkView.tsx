"use client";

import React, { useState } from "react";
import { CONFIG } from "../config";
import SocialIcon from "./SocialIcon";

interface WorkViewProps {
  active: boolean;
}

export default function WorkView({ active }: WorkViewProps) {
  const [selectedProj, setSelectedProj] = useState(0);
  const [displayedProj, setDisplayedProj] = useState(0);
  const [fading, setFading] = useState(false);

  const handleSelectProj = (i: number) => {
    if (i === selectedProj) return;
    setSelectedProj(i);
    setFading(true);
    setTimeout(() => {
      setDisplayedProj(i);
      setFading(false);
    }, 220);
  };

  const project = CONFIG.projects[displayedProj] || CONFIG.projects[0];
  const repoName = project.link.includes("github.com/muhadilaga/")
    ? project.link.replace("https://github.com/muhadilaga/", "")
    : "";

  return (
    <section
      className={`view view--work ${active ? "is-active" : ""}`}
      id="work"
      aria-label="Work"
    >
      <div className="work-showcase">
        <div className="vl">
          <h2 className="title of rv" style={{ "--i": 0 } as React.CSSProperties}>
            Work
          </h2>
          <ol className="wlist rv" style={{ "--i": 2 } as React.CSSProperties}>
            {CONFIG.projects.map((p, i) => (
              <li key={i}>
                <button
                  data-proj={i}
                  className={selectedProj === i ? "on" : ""}
                  onClick={() => handleSelectProj(i)}
                  onMouseEnter={() => handleSelectProj(i)}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="vr">
          <div
            className="proj rv"
            style={{
              "--i": 1,
              opacity: fading ? 0 : undefined,
              transition: "opacity 0.22s ease",
            } as React.CSSProperties}
            id="proj"
          >
            {project.image ? (
              <div className="proj-card">
                <div
                  className="shot"
                  style={{
                    backgroundImage: `url('${project.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
                <h3>{project.name}</h3>
                <p className="lead sm">{project.desc}</p>
                <div className="chips">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  className="btn btn--solid"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project ↗
                </a>
              </div>
            ) : (
              <div className="gh-repo-card">
                <div className="gh-repo-top">
                  <div className="gh-repo-badge">
                    <SocialIcon label="GitHub" size={16} />
                    <span className="gh-repo-path">
                      <span className="gh-repo-user">muhadilaga</span>
                      <span className="gh-repo-slash">/</span>
                      <span className="gh-repo-name">{repoName || project.name.toLowerCase().replace(/\s+/g, "-")}</span>
                    </span>
                  </div>
                  <span className="gh-repo-pill">Repository</span>
                </div>
                <h3>{project.name}</h3>
                <p className="lead sm gh-repo-desc">{project.desc}</p>
                <div className="chips">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="gh-repo-action">
                  <a
                    className="btn btn--solid gh-repo-btn"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon label="GitHub" size={16} />
                    <span>View on GitHub ↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Activity Section */}
      <div className="gh-activity-section rv" style={{ "--i": 3 } as React.CSSProperties}>
        <div className="gh-activity-header">
          <div>
            <p className="eyebrow">Open Source</p>
            <h3 className="gh-activity-title">GitHub Activity</h3>
          </div>
          <a
            href="https://github.com/muhadilaga"
            target="_blank"
            rel="noopener noreferrer"
            className="gh-activity-profile-link"
          >
            <SocialIcon label="GitHub" size={16} />
            <span>@muhadilaga ↗</span>
          </a>
        </div>
        <div className="gh-chart-box">
          <img
            src="https://ghchart.rshah.org/muhadilaga"
            alt="Muhammad Adilaga's GitHub Contributions Chart"
            className="gh-chart-svg"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
