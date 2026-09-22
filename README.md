# Muhammad Suhaib — CV / Portfolio

Personal CV site for muhammadsuhaib.com. React + TypeScript + Vite, Tailwind CSS v4, Framer Motion.

## Stack

- **Vite + React + TypeScript** — app shell
- **Tailwind CSS v4** (`@tailwindcss/vite`) — styling, theme via CSS variables (`src/index.css`)
- **Framer Motion** — scroll-reveal animations, animated skill bars, count-up stats, scroll progress bar
- **react-icons** — icon set

## Structure

- `src/data/resume.ts` — all CV content lives here (profile, skills, experience, publications, certifications, education). Edit this file to update the site's content.
- `src/components/` — one component per section (`Hero`, `About`, `Skills`, `Experience`, `Publications`, `Education`, `Contact`) plus shared UI (`Section`, `Nav`, `Background`, `ScrollProgress`, `ThemeToggle`, `TypeRotator`).
- `src/hooks/` — `useTheme` (dark/light, persisted to localStorage), `useScrollSpy` (active nav link), `useCountUp` (animated stat counters).

## Running locally

```bash
npm install
npm run dev
```

## Building for production

```bash
npm run build
```

Outputs a static site to `dist/` — deployable to Vercel, Netlify, or any static host.

## To do before going live

- [ ] Swap the initials avatar in `Hero.tsx` for a real photo (drop the image in `src/assets/` and update the component).
- [ ] Replace `public/favicon.svg` with a custom favicon.
- [ ] Point `muhammadsuhaib.com` DNS at the chosen host once deployed.

## Print / PDF

The "PDF" button in the nav calls `window.print()`. Section paddings collapse and non-essential chrome (nav, background, footer) is hidden via the `.no-print` class and a `@media print` block in `src/index.css`.
