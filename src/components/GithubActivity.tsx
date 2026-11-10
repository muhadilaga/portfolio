"use client";

import React, { useEffect, useMemo, useState } from "react";

interface DayEntry {
  date: string;
  count: number | null;
  level: number;
}

interface ActivityData {
  total: number;
  days: DayEntry[];
  updatedAt: string;
}

const LEVEL_COLORS = [
  "rgba(255, 255, 255, 0.07)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function buildWeeks(days: DayEntry[]) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: (DayEntry | null)[][] = [];
  let current: (DayEntry | null)[] = [];
  const first = sorted[0];
  if (first) {
    const dow = new Date(first.date + "T00:00:00Z").getUTCDay();
    for (let i = 0; i < dow; i++) current.push(null);
  }
  for (const d of sorted) {
    current.push(d);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }
  return weeks;
}

export default function GithubActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-activity")
      .then((res) => {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then((json: ActivityData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = useMemo(() => (data ? buildWeeks(data.days) : []), [data]);

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    let prevMonth = -1;
    weeks.forEach((week, i) => {
      const first = week.find((d) => d !== null);
      if (!first) return;
      const month = new Date(first.date + "T00:00:00Z").getUTCMonth();
      if (month !== prevMonth) {
        labels.push({ index: i, label: MONTHS[month] });
        prevMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  if (failed) {
    return (
      <p className="gh-chart-note">
        Couldn&apos;t load the chart — see it on{" "}
        <a
          href="https://github.com/muhadilaga"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </p>
    );
  }

  if (!data) {
    return <p className="gh-chart-note">Loading GitHub activity…</p>;
  }

  return (
    <div className="gh-chart-scroll">
      <div
        className="gh-chart-grid"
        style={{ width: weeks.length * PITCH - GAP }}
      >
        <div className="gh-chart-months">
          {monthLabels.map((m) => (
            <span key={m.index} style={{ left: m.index * PITCH }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="gh-chart-weeks">
          {weeks.map((week, wi) => (
            <div key={wi} className="gh-chart-week">
              {week.map((day, di) => (
                <span
                  key={di}
                  className="gh-chart-cell"
                  title={
                    day
                      ? `${day.count ?? "?"} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
                      : ""
                  }
                  style={{
                    backgroundColor: day
                      ? LEVEL_COLORS[Math.min(day.level, 4)]
                      : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="gh-chart-footer">
          <span>{data.total} contributions in the last year</span>
          <span className="gh-chart-legend">
            Less
            {LEVEL_COLORS.map((c, i) => (
              <span
                key={i}
                className="gh-chart-cell gh-chart-legend-cell"
                style={{ backgroundColor: c }}
              />
            ))}
            More
          </span>
        </div>
      </div>
    </div>
  );
}
