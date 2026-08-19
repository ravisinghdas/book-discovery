<script setup lang="ts">
import { useShortlistStore } from '~~/stores/shortlist'

/**
 * Top navigation bar.
 * - Brand wordmark links home.
 * - Home / Shortlist nav with an active-route highlight.
 * - Shortlist link shows a live count badge (only when > 0).
 *
 * `count` is read from the persisted Pinia store, so it stays in sync across
 * every page and survives refreshes.
 */
const shortlist = useShortlistStore()
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-hairline bg-page/80 backdrop-blur"
  >
    <div
      class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
    >
      <!-- Brand -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 rounded-button"
        aria-label="Book Discovery home"
      >
        <span
          class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-cyan to-brand-teal text-white"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </span>
        <span
          class="bg-gradient-to-r from-brand-cyan to-brand-teal bg-clip-text text-lg font-extrabold tracking-tight text-transparent"
        >
          Book Discovery
        </span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="flex items-center gap-1" aria-label="Primary">
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 rounded-button px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          active-class="bg-primary/10 text-primary"
          exact-active-class="bg-primary/10 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
          <span>Home</span>
        </NuxtLink>

        <NuxtLink
          to="/shortlist"
          class="relative flex items-center gap-1.5 rounded-button px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          active-class="bg-primary/10 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>Shortlist</span>
          <span
            v-if="shortlist.count > 0"
            class="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white"
            :aria-label="`${shortlist.count} saved`"
          >
            {{ shortlist.count }}
          </span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
