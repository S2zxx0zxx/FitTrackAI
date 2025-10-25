# FitTrack AI

FitTrack AI — Apple-style dark theme Fitness & Nutrition Web App

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
