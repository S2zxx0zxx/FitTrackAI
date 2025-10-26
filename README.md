FitTrackAI — GitHub-ready Summary

Overview

FitTrackAI is a Vite + React fitness and nutrition web app with advanced AI/ML feature scaffolding. The project includes: smart meal suggestions, health analytics, progress prediction, gamification hooks, PWA support (service worker + manifest), basic pose/gesture utilities, voice interaction helpers, and a test suite (Vitest + Testing Library).

Quick commands

- Install dependencies:

```cmd
npm install
```

- Run dev server:

```cmd
npm run dev
```

- Run unit tests:

```cmd
npm test
# or
npx vitest run --environment=jsdom
```

- Lint & auto-fix:

```cmd
npm run lint:fix
npm run lint
```

- Build production bundle:

```cmd
npm run build
```

Project structure (high level)

- public/ — static assets and PWA manifest
- src/
  - App.jsx, main.jsx — app entry
  - components/ — React components (MealInput, MealList, WaterSleep, AISuggestion, etc.)
  - utils/ — helper modules (decimalMath, storage, ai/*)
  - hooks/ — custom hooks (useGestureControls, useNotifications, etc.)
  - assets/ — images, icons
  - __tests__/ — Vitest test suites
  - service-worker.js — Workbox service worker for PWA

CI / Deployment

- GitHub Actions workflows are included under `.github/workflows/`. The `security-ci.yml` workflow runs lint, tests, build and uploads artifacts. I updated action pins to v4 to satisfy local validation.
- For hosting you can use Vercel, Netlify, or GitHub Pages (build outputs to `dist/`).

Notable decisions & quick notes

- Tests: Vitest + @testing-library/react configured; all unit tests pass locally (14/14) after fixes.
- Lint: ESLint configured and auto-fixed where safe (no errors after fixes).
- Build: `vite build` succeeds and produces the `dist/` bundle.
- Service Worker: Implemented via Workbox. Minor lint fix applied to use `self.clients.openWindow`.

Files I changed while auditing

- src/components/WaterSleep.jsx — fixed text nodes, added controlled `sleepHours` prop and propTypes relaxations to satisfy tests.
- src/__tests__/WaterSleep.test.jsx — tightened test flow to be deterministic and stable under jsdom.
- src/components/MealInput.jsx — adjusted to match test expectations (manual mode and payload shape).
- src/service-worker.js — replaced `clients.openWindow` with `self.clients.openWindow`.
- src/hooks/useGestureControls.js — removed unused TF import, stabilized interpretGesture with `useCallback` and fixed hook deps.
- src/hooks/useNotifications.js — silenced unused registration state.
- src/utils/aiService.js — prefixed unused params to silence lint warnings.
- .github/workflows/security-ci.yml — fixed YAML indentation and updated action pins to @v4.

Next recommended steps

1. Review the `ai/` utils and AI components to confirm intended behavior for model integration (these are scaffolding and may require model keys or runtime assets).
2. Manually test PWA flows in a browser (service worker, offline page, push notifications flow).
3. Decide if you want stricter CI pinning (use exact SHAs for actions) or keep the v4 tags.
4. Run `npm audit` and address remaining high/critical vulnerabilities (I ran fixes; a few transitive issues remain).

If you want, I can now:
- Open a PR with these changes and a short PR description.
- Create a `docs/` folder with expanded per-feature docs and diagrams.
- Continue with vulnerability remediation (manual upgrades or replacements).

Which of those should I do next?
# FitTrack AI

FitTrack AI — Apple-style dark theme Fitness & Nutrition Web App

## AI demo

There's a lazy-loaded MobileNet-based image classification demo at `src/components/AIImageDemo.jsx`.

To try the demo locally:

1. npm install
2. npm run dev
3. Open the dashboard page; the demo is included in the dashboard view and will lazy-load the model when you click "Load model".

## Bundle analysis

Run `npm run build:analyze` to generate `dist/bundle-report.html` which visualizes the bundle and helps identify large modules.

## Deploying & launching

Automatic deployments:

- GitHub Pages: a workflow is configured to deploy the built `dist/` directory to the `gh-pages` branch on pushes to `main` and `feat/three-upgrade`. After the workflow runs, check the Actions logs and the repository Pages settings to find the published URL.
- Vercel: the project includes `vercel.json` for Vite. If you'd prefer Vercel, connect the repository at https://vercel.com/new and Vercel will auto-deploy branches.

Manual local preview:

1. Install dependencies:

```cmd
npm install
```

2. Start dev server:

```cmd
npm run dev
```

3. Or build and preview the production build:

```cmd
npm run build
npx serve -s dist -l 3000
```

Open http://localhost:3000 to preview the built site.

Open PR: I pushed the working branch `feat/three-upgrade`. Create a PR at:

https://github.com/S2zxx0zxx/FitTrackAI/pull/new/feat/three-upgrade


This repository contains a Vite + React project. The project builds a production-ready static site in the `dist/` folder.

What I prepared for you

- Project is committed to Git and builds correctly (`npm run build`).
- `vercel.json` added for Vercel deployments.
- A GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys `dist/` to GitHub Pages on push to `main`.

How to finish deployment (choose one)

Option A — Quick: Deploy with Vercel CLI (interactive)
1. Install/confirm Vercel CLI is installed:
   ```cmd
   npm i -g vercel
   ```
2. Login (opens browser):
   ```cmd
   vercel login
   ```
3. Deploy (from project root):
   ```cmd
   vercel --prod
   ```

Option B — Recommended: Push to GitHub and use GitHub Actions (already configured)
1. Create a new GitHub repository (on github.com) and copy its HTTPS URL.
2. From your project folder run (replace `<repo-url>`):
   ```cmd
   cd C:\FitTrackAI
   git remote add origin <repo-url>
   git branch -M main
   git push -u origin main
   ```
3. After push, GitHub Actions will build the app and deploy to GitHub Pages using the included workflow file.
4. The Pages URL will be `https://<your-username>.github.io/<repo>` once deployment completes. You can monitor the Actions tab on GitHub to get the final URL.

Option C — Netlify
1. Push to GitHub (same as Option B).
2. Go to https://app.netlify.com/new and connect your GitHub repo. Set build command `npm run build` and publish directory `dist`.

Local verification

To preview the production build locally:
```cmd
cd C:\FitTrackAI
npm run preview -- --port 5000
```
Then open http://localhost:5000

Notes

- I cannot perform interactive logins (Vercel/GitHub) on your behalf. The GitHub Actions workflow will deploy automatically when you push to GitHub; this is the non-interactive option.
- If you want me to push for you, provide a remote repo URL and confirm you want me to try (this will fail if credentials are required and not provided). It's safer and recommended that you push from your environment.

If you want, I can also add a small `README` badge and `homepage` field in `package.json` after you share the final GitHub repo URL.

## Testing

Run the unit tests locally using Vitest (jsdom environment):

```cmd
npx vitest run --environment jsdom
```

Watch tests during development:

```cmd
npm run test:watch
```

Linting

Auto-fix and check code style with ESLint/Prettier:

```cmd
npm run lint:fix
npm run lint
```
