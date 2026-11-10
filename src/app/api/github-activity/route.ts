const USERNAME = "muhadilaga";
const CONTRIBUTIONS_URL = `https://github.com/users/${USERNAME}/contributions`;

interface DayEntry {
  date: string;
  count: number | null;
  level: number;
}

export async function GET() {
  try {
    const res = await fetch(CONTRIBUTIONS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (portfolio contribution chart)",
        Accept: "text/html",
      },
      // GitHub's own graph only changes once a day, so cache for 24h.
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      throw new Error(`GitHub responded ${res.status}`);
    }
    const html = await res.text();

    const dayMatches = [
      ...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g),
    ];
    const tipMatches = [
      // "contribution" (not "contributions") so 1-contribution days match too.
      ...html.matchAll(/<tool-tip[^>]*>([^<]*contribution[^<]*)<\/tool-tip>/g),
    ];

    const days: DayEntry[] = dayMatches.map((m, i) => {
      const tip = tipMatches[i]?.[1] ?? "";
      const num = tip.match(/^(\d+)/);
      return {
        date: m[1],
        count: num ? parseInt(num[1], 10) : tip.startsWith("No") ? 0 : null,
        level: parseInt(m[2], 10),
      };
    });

    if (days.length === 0) {
      throw new Error("No contribution days parsed");
    }

    const totalMatch = html.match(/([\d,]+)\s+contributions\s+in the last year/);
    const total = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : days.reduce((sum, d) => sum + (d.count ?? 0), 0);

    return Response.json({ total, days, updatedAt: new Date().toISOString() });
  } catch {
    return Response.json(
      { error: "Failed to load GitHub activity" },
      { status: 502 },
    );
  }
}
