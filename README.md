# Book Discovery

A book discovery app: search the Google Books catalogue, open a book's detail page at its own URL, and save books to a personal shortlist that survives a page refresh.

Built with **Nuxt 4**, **Vue 3** (Composition API + `<script setup>`), **TypeScript**, **Tailwind CSS v4**, **Pinia**, and **Storybook**.

## Live demo

**[book-discovery.ravisinghdas2026.workers.dev](https://book-discovery.ravisinghdas2026.workers.dev/)**

Deployed on Cloudflare Workers. Runs locally at `http://localhost:3000`.

## Features

- **Search** — debounced search by title/author/keyword with infinite scroll, plus loading, empty, and error states.
- **Detail** — each book has its own URL (`/books/{id}`) showing a large cover, description, publisher, page count, categories, and rating. The "Back" link returns you to wherever you came from (search or shortlist).
- **Shortlist** — bookmark books from anywhere; the list persists across refreshes via `localStorage`. A header badge shows the count, and there's a dedicated shortlist page with an empty state.
- **Resilient** — search results and scroll position survive back-navigation, and the query is mirrored to the URL (`?q=`) so searches are shareable.
- **Responsive & accessible** — 2→5 column responsive grid, semantic HTML, `alt` text on covers, `aria-label`s on icon buttons, and visible focus rings.

## Getting started

### Prerequisites

- Node.js 18+ and npm 9+
- A Google Books API key ([Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials))

### Setup

```bash
git clone https://github.com/ravisinghdas/book-discovery.git
cd book-discovery
npm install
cp .env.example .env
# add your key to .env → NUXT_GOOGLE_BOOKS_API_KEY=...
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment variables

| Variable | Description |
|----------|-------------|
| `NUXT_GOOGLE_BOOKS_API_KEY` | Google Books API key. Read server-side only — it is **never** exposed to the client. |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run storybook` | Launch Storybook on port 6006 |
| `npm run build-storybook` | Build the static Storybook |

## Architecture

### Key decisions

- **Server proxy for the API key.** All Google Books calls go through Nuxt server routes (`server/api/books/search.get.ts` and `[id].get.ts`), which inject the key from `runtimeConfig`. The browser only ever talks to `/api/books/*`, so the key stays server-side.
- **Normalized data model.** Raw Google volumes are messy (almost every field is optional). They're normalized once, at the edge (`app/utils/formatters.ts`), into `BookSummary` / `BookDetails`. Components then consume clean, fully-typed data instead of scattering optional-chaining and fallbacks through the templates. This also centralises the "gotchas": forcing `https://` on cover URLs, extracting the year from inconsistent date formats, upscaling cover images via the CDN `zoom` param, and the author fallback.
- **Pinia + persisted state.** The shortlist is a Pinia store with `persist: true`. It's SSR-safe, reactive, and survives refresh without manual `localStorage` juggling. UI that reads persisted state is wrapped in `<ClientOnly>` to avoid hydration mismatches.
- **Composables for behaviour.** `useBookSearch` owns querying, debouncing, pagination, de-duplication, and stale-response guarding; `useInfiniteScroll` wraps an `IntersectionObserver`. Search state lives in `useState` so it persists across navigation.
- **Component structure.** `ui/` = presentational (Storybook-ready), `book/` = domain components, `layout/` = app shell. `BookCard` is deliberately store-free: it emits a `toggle` event and takes a `shortlisted` prop, so the page owns the logic and the card stays trivial to test.
- **Design tokens.** All colours, radii, and the font are defined once as Tailwind v4 `@theme` tokens in `app/assets/css/main.css` — no arbitrary values (`text-[#...]`) in markup.

### Project structure

```
app/
  assets/css/main.css        Tailwind v4 @theme design tokens
  components/
    ui/                      Presentational: BookCard, SearchInput, Badge, Skeletons
    book/                    Domain: BookDetail, BookGrid, ShortlistButton
    layout/                  AppHeader
  composables/               useBookSearch, useInfiniteScroll
  pages/                     index.vue, books/[id].vue, shortlist.vue
  utils/formatters.ts        Normalization + missing-data helpers
  error.vue                  Global 404 / 500 page
shared/types/book.ts         API + normalized types
stores/shortlist.ts          Pinia store (persisted)
server/api/books/            Key-hiding proxy routes
.storybook/                  Standalone Vue 3 + Vite config
```

## Assumptions

- "Shortlist" is the product term for the saved-books feature (used consistently in the nav, badge, and buttons).
- Only the fields the UI actually shows are stored per book, so the shortlist stays small in `localStorage`.
- `totalItems` from Google is treated as approximate (it's a known-inaccurate value), so "has more" is derived from what's actually loaded.
- A book opened from a shared/deep link (no origin) sensibly defaults its back link to search.

## Tradeoffs

### Accepted

- **Infinite scroll over pagination** — better for browsing; `IntersectionObserver` keeps it lightweight.
- **Lazy fetch on the detail page** (`useLazyAsyncData`) — navigation isn't blocked and a skeleton shows immediately, at the cost of the very first paint on a hard refresh not being server-rendered with data.
- **Search state in `useState`** — instant restore on back-navigation with no refetch flash; state is in-memory (cleared on full reload, though the URL query re-runs the search).

### With more time

- Add unit tests (store logic, formatters) and a component/interaction test or two.
- Add request caching / rate-limit handling on the server routes.
- Server-render the detail page's initial data for better first-load SEO.
- Richer description rendering and a skeleton for the shortlist page.

## Status

- ✅ Core features complete: search, detail, shortlist (persisted), responsive + accessible UI, error page, Storybook.
- ✅ **Deployed** to Cloudflare Workers — [live demo](https://book-discovery.ravisinghdas2026.workers.dev/).
- ⏳ **Screen recording** — pending.
- ❌ No automated tests yet (see Tradeoffs).

## Storybook

Storybook runs as a **standalone Vue 3 + Vite** workshop (no Nuxt-specific integration). 8 components are documented across 23 stories.

One gotcha worth noting: on this Vite 8 (Rolldown) setup, Storybook 10's `vue3-vite` framework did not auto-register `@vitejs/plugin-vue`, so `.vue` files reached the JS parser untransformed. The fix was to add the Vue plugin explicitly in `.storybook/main.ts` (`viteFinal`). Storybook's own `init` CLI also hangs when it detects Nuxt, so the config was set up manually. Both were resolved well within the time box.

## AI tooling

This project was built with AI assistance (Kiro) for scaffolding, boilerplate, and first drafts of components and docs. Human review and overrides shaped the important decisions, including:

- Choosing the **normalized `BookSummary`/`BookDetails` model** rather than passing raw API shapes around.
- Replacing the blueprint's deprecated `@pinia-plugin-persistedstate/nuxt` with the maintained `pinia-plugin-persistedstate` (v4) after hitting a peer-dependency conflict.
- Diagnosing and fixing the **Storybook + Vite 8** plugin issue.
- Adding **search-state persistence + URL sync** and **context-aware back navigation** after reviewing the real UX.

Every file is intended to be walkable and explainable line by line.
