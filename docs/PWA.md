# PWA & Service Worker

The app includes a Workbox-based service worker (`src/service-worker.js`) and `public/manifest.json` for PWA support.

What to test:
- Install the app on Chrome/Edge (Lighthouse PWA audit).
- Offline fallback: visit the app, then go offline and navigate; offline.html should be served for navigations.
- Push notifications: a service worker push flow is scaffolded; configure a push service and test subscription flows.

Notes:
- `src/service-worker.js` is generated to use Workbox runtime strategies; modify caching rules to fit your backend API and assets.
- CI currently uploads a bundle analysis artifact; you can use that to inspect large modules.
