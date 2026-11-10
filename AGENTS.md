<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Render the shared bottom navigation from Layout and reserve its safe-area height in scrollable content so it never covers page actions.
- Quran search uses the bundled Uthmani corpus and typed ayah query parameters; selected-ayah listening uses individual Minshawy murattal recordings from EveryAyah because bundled whole-surah audio has no verse timestamps.

- Illuminated Book answers via server-only AI SDK Responses drawing on well-known Islamic scholarship, attributing non-bundled claims by book name; only bundled excerpts are shown as verified references, so the app never displays unverifiable source text.
- Keep the Illuminated Book video area explicitly unavailable until the user's video is supplied; never simulate playback, answers, or rewarded-ad credits.

- Fonts must be bundled locally through `@fontsource*` packages imported in `src/styles.css`; never load them from a remote font CDN — the app has to render correctly with no internet.
- Qibla uses north-referenced device orientation only, requests sensor permission from a user action, and rotates the dial and needle with continuous angles to avoid false bearings and full-turn jumps.

- Android packaging is an offline Capacitor APK: `npm run cap:sync` builds a static SPA (CAPACITOR_BUILD=1) into dist/client with no server.url, because the user wants the APK to work fully on-device; online-only features (AI answers, per-ayah streaming) degrade without internet.
- Startup artwork is bundled locally; the root shell and native Android overlay show real spinning indicators until hydration, initial images and fonts are ready, using the DOM appReady marker rather than a fixed splash delay.
