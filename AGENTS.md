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

- Illuminated Book answers via server-only AI SDK Responses drawing on well-known Islamic scholarship, attributing non-bundled claims by book name; only bundled excerpts are shown as verified references, so the app never displays unverifiable source text.
- Keep the Illuminated Book video area explicitly unavailable until the user's video is supplied; never simulate playback, answers, or rewarded-ad credits.

- Fonts must be bundled locally through `@fontsource*` packages imported in `src/styles.css`; never load them from a remote font CDN — the app has to render correctly with no internet.
- Qibla uses north-referenced device orientation only, requests sensor permission from a user action, and rotates the dial and needle with continuous angles to avoid false bearings and full-turn jumps.

- Android packaging uses Capacitor with server.url pointing at the hosted app, because AI answers rely on server functions that cannot run inside a static Android bundle. server.url must always be the published (public) URL, never a preview URL — preview hosts require a Lovable login and the APK would show a login wall instead of opening. After publishing, update server.url and run `npm run cap:sync`.
