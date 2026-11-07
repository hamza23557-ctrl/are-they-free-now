import type { CapacitorConfig } from "@capacitor/cli";

// Android packaging: the shell loads the hosted app because AI answers rely on
// server functions that cannot run inside a static Android bundle.
// IMPORTANT: server.url MUST be the published (public) URL, not a preview URL —
// preview URLs require a Lovable login, so the APK would show a login wall and
// appear "not opening". After publishing, replace the URL below with the
// published URL and run `npm run cap:sync` before building the APK.
const config: CapacitorConfig = {
  appId: "app.lovable.quranreader",
  appName: "تقوى القلوب",
  webDir: "dist/client",
  server: {
    // Published (public) URL of the app — preview URLs require a Lovable login
    // and would break the APK. Update only to a published URL, then `npm run cap:sync`.
    url: "https://open-door-web-foundation.lovable.app?forceHideBadge=true",
    cleartext: true,
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    Admob: {
      // Publisher app ID provided by the user (2026-10-25).
      appID: "ca-app-pub-4072506919111365~3383451970",
      // Ad unit IDs in src/quran/lib/ads.ts are the user's real ids (2026-10-25);
      // live ads, so initializeForTesting is false.
      initializeForTesting: false,
    },
  },
};

export default config;
