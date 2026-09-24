# muhammadsuhaib.com

My personal CV site. It's a single page built with React and TypeScript, and it can also produce the CV as a PDF in three layouts.

## Running it

```bash
npm install
npm run dev
```

## Where things live

- `src/data/resume.ts` holds everything shown on the site and in the PDFs: profile, skills, experience, certifications, education and publications. Change it there and both update.
- `src/components/` has one file per section plus the shared pieces (navigation, background, command palette and so on).
- `src/cv/` has the three PDF templates and the download code. The PDF library is only loaded when someone clicks download.
- `public/profile.webp` is the portrait used in the hero, the photo CV and the link preview image.
- `scripts/` has small helpers that regenerate the link preview image, favicons and the Earth textures.

## Tests and checks

```bash
npm test              # unit, component, PDF and security tests
npm run typecheck
npm run lint
npm run audit:prod    # known vulnerabilities in production dependencies
npm run build:prod    # tests, then build, then the security scan of the output
```

The security scan (`scripts/security-check.mjs`) fails the build if it finds source maps, third-party scripts, inline scripts, secrets, tracked environment files, or missing security headers.

## Deploying

Pushing to `master` deploys to Vercel. The build runs `npm run build:prod`, so a failing test stops the deploy.

Security headers (CSP, HSTS, frame and referrer policies, permissions policy) are set in `vercel.json`. Fonts are bundled with the site, so the page makes no third-party requests.

## Reporting a problem

Contact details are in `/.well-known/security.txt`.
