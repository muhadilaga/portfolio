# Portfolio — Muhammad Adilaga

Personal portfolio site for Muhammad Adilaga, built with Next.js 16 (App Router) and React 19. Live at [portfolio.muhadilaga.my.id](https://portfolio.muhadilaga.my.id).

## Sections

- **Work** — selected projects, plus a GitHub activity chart rendered by the site itself.
- **About / Contact** — background, links to GitHub and LinkedIn.

## GitHub activity chart

The Work section's contribution chart is self-rendered in the site's dark theme. A Route Handler (`src/app/api/github-activity`) fetches the public contributions page from GitHub and returns per-day counts (cached for 24 hours); the `GithubActivity` client component draws the week grid from that data. No third-party chart service is involved.

## Development

```bash
npm install
npm run dev     # local dev server
npm run build   # production build
npm run start   # serve the production build
```
