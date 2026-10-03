# Pratham Chatke — DevOps & Cloud Portfolio

Portfolio for a DevOps engineer: React 19 SPA with React Router v7, an interactive terminal hero, a simulated DevOps "Mission Control" (CI/CD pipeline + Kubernetes auto-scaling), an interactive cloud architecture diagram, an EmailJS contact form, and a live GitHub repositories page.

All visuals live in `src/styles/base.css` (design tokens for light and dark themes) and are driven by class names and state attributes, so components contain no styling logic.

Homepage sections (anchor ids): `home` · `about` · `skills` · `projects` · `devopsdashboard` · `cloudarchitecture` · `contact`.

## Stack

- React 19, React Router 7 (`react-router`)
- Vite 8 (build output in `build/`)
- Framer Motion (filter/modal/pod/section animations)
- IBM Plex Sans + JetBrains Mono (Google Fonts)
- react-icons, @emailjs/browser
- Vitest + Testing Library

## Getting started

```bash
npm install
cp .env.example .env      # then fill in the EmailJS values
npm run dev               # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build into `build/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Tests in watch mode |

## Environment variables

Vite is configured with `envPrefix: ["VITE_", "REACT_APP_"]`, so the CRA-style names work:

| Variable | Purpose |
|---|---|
| `REACT_APP_EMAILJS_SERVICE_ID` | EmailJS service id |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | EmailJS template id |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | EmailJS public key |

The EmailJS template receives `from_name`, `from_email`, `reply_to`, `subject`, and `message`. If the variables are missing or sending fails, the form shows an error with a `mailto:` fallback and keeps the user's input.

> These values are embedded in the client bundle (EmailJS public keys are meant to be public). Restrict allowed origins in the EmailJS dashboard.

## Project structure

```
src/
  App.jsx                 Router, ThemeProvider, MotionConfig (reduced motion)
  main.jsx
  components/
    Layout.jsx            Navbar + <main> + Footer on every route
    Navbar.jsx            Scroll-spy, scrolled state, sound/theme toggles, mobile drawer
    Footer.jsx
    ErrorBoundary.jsx     Per-section boundary with "Try Again" and optional `fallback`
    hero/                 Hero (status pill, headline, CTAs, metrics, tooling strip), Terminal
    About.jsx             Intro, quick facts, focus areas
    Skills.jsx  Projects.jsx  CaseStudyModal.jsx
    MissionControl.jsx    CI/CD pipeline + K8s surge simulator
    CloudArchitecture.jsx Tabs-pattern architecture diagram
    Contact.jsx  FilterTabs.jsx  SectionHeader.jsx
  context/
    ThemeContext.jsx      { darkMode, toggleTheme } → `dark` class + data-theme + localStorage.theme
    useSectionNavigation.js  Scroll on "/", or navigate("/", { state: { scrollTo } }) elsewhere
  data/                   ALL content: site/nav, hero, terminal, about, skills, projects,
                          dashboard, architecture, contact, repos, section copy
  pages/
    Home.jsx              Section order, cross-route scroll
    ReposPage.jsx         /projects (lazy-loaded)
  utils/                  audio, scroll, terminal, github, email, hooks
  styles/base.css         Design tokens (light/dark) and all component styles
```

## Design system

| Token | Light | Dark |
|---|---|---|
| Background | `#F8FAFC` | `#080D19` |
| Surface | `#FFFFFF` | `#0F172A` |
| Text | `#0F172A` | `#F1F5F9` |
| Muted text | `#475569` | `#A3B1C6` |
| Accent | `#15803D` | `#22C55E` |
| Border | `#E2E8F0` | `#1E293B` |

The terminal and log console stay dark in both themes. Text/background pairs meet WCAG AA (4.5:1).

## Styling hooks

State is exposed as attributes, never baked-in styles:

| Element | Hook |
|---|---|
| Header | `.navbar[data-scrolled="true"]`, `[data-menu-open]` |
| Active nav link | `.navbar__link[data-active="true"]` / `aria-current` |
| Filter tabs | `.filter-tabs__tab[aria-pressed="true"]` |
| Terminal lines | `.terminal__line[data-type="system|user|output|success|error"]` |
| Pipeline stages | `.pipeline__stage[data-status="pending|current|completed"]` |
| Log lines | `.log-console__line[data-kind="normal|success|alert"]` |
| Architecture node | `.arch-node[aria-selected="true"]`, arrows `.arch-flow-arrow[data-lit]` |
| Contact result | `.form-status[data-status="success|error"]`, submit `[data-state]` |
| Theme | `html.dark` / `html[data-theme="dark|light"]` |

## Deploying

The app is a static SPA. `/projects` needs a rewrite to `index.html` on refresh:

- **Netlify:** `public/_redirects` is copied into `build/`. Build command `npm run build`, publish directory `build`.
- **Vercel:** `vercel.json` rewrites all paths to `/index.html`. Framework preset "Vite", output directory `build`.
- **GitHub Pages:** copy `build/index.html` to `build/404.html` after building, and set `base` in `vite.config.js` if serving from a sub-path.

Remember to add the EmailJS variables in your host's environment settings.

## Before launch

- Confirm the LinkedIn URL in `src/data/site.js`.
- Review the claims and metrics in `src/data/hero.js`, `about.js`, and `projects.js`.
- Point project `github`/`live` links in `src/data/projects.js` at the real repos.
- Update the canonical/Open Graph URLs (`https://prathamchatke.dev/`) in `index.html` and add `public/og-image.png`.
