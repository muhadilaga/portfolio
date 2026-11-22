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

## Agent assistant (Portfolio Guide)

The portfolio is agentified for the Open Agentic Web Challenge: a "Portfolio Guide"
assistant answers questions about Muhammad's projects, skills, education and
certifications, and can show visitors around the site (scroll to a section, open a
project link, copy his email address). It runs entirely in the visitor's browser —
there is no agent server.

- **Network URL:** https://portfolio.muhadilaga.my.id/portfolio_guide
- **Network source:** `public/portfolio_guide.hocon` (build it with
  `node ../agentic-web/skills/agentify-website/scripts/build_network.mjs public/portfolio_guide.hocon --manifest public/agent-manifest.json`,
  run from the goal folder; the build writes `public/portfolio_guide.network.json`,
  `public/agent-mcp.json`, `public/.well-known/nsdeploy*.json` and
  `public/bridge/` — never hand-edit generated files)
- **Manifest:** `public/agent-manifest.json` · **Actions:** `public/site-actions.js`
  (wraps `public/portfolio-page.js`) · **Mount:** `public/site.js`, rendered by
  `src/components/AgentAssistant.tsx` · **Runtime:** `public/runtime/` (copied
  unchanged from the agentify-website skill, Apache-2.0) · **Tests:**
  `tests/agentified.test.mjs` (`node --test "tests/*.test.mjs"`)
- **Privacy (BYOK):** the assistant sends the visitor's messages, and the page data
  it reads, to the LLM provider the visitor picks in the settings panel (default:
  hosted Otari). The site owner pays nothing and holds no key; nothing is sent
  anywhere until the visitor adds their own key. To remove a saved key, select
  **Delete setup** under **Advanced settings (optional)** in the settings panel,
  then close the tab.
- **What it cannot do:** apply for jobs or send messages/emails on Muhammad's behalf,
  change the portfolio's content, run or deploy code, or access his accounts.
- **Other agent sites** can call this network (see `public/bridge/`), but they get no
  `website_*` tools — their assistant points to this site's page. This site calls no
  partner sites.

## License

MIT — see [LICENSE](LICENSE).
