<script setup lang="ts">
import { useShortlistStore } from '~~/stores/shortlist'

/**
 * Top navigation bar.
 * - No brand logo here by design — the "Book Discovery" wordmark lives in the
 *   hero on the home page, keeping the chrome minimal.
 * - Right-aligned Home / Shortlist tabs with an active-route underline.
 * - The shortlist count badge is wrapped in <ClientOnly>: the count comes from
 *   a localStorage-persisted store that only hydrates in the browser, so
 *   rendering it during SSR would cause a hydration mismatch.
 */
const store = useShortlistStore()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur">
    <div class="mx-auto flex h-14 w-full max-w-6xl items-stretch justify-end px-4 sm:px-6 lg:px-8">
      <nav class="flex items-stretch">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 border-b-2 border-transparent px-4 text-sm font-semibold tracking-wide text-content-muted transition-colors hover:border-primary/40 hover:bg-primary/8 hover:text-content"
          active-class="border-primary bg-primary/10 text-content"
          exact
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 12L12 3l9 9" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 21V12h6v9" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5 10v11h14V10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="hidden sm:inline">Home</span>
        </NuxtLink>

        <NuxtLink
          to="/shortlist"
          class="flex items-center gap-2 border-b-2 border-transparent px-4 text-sm font-semibold tracking-wide text-content-muted transition-colors hover:border-primary/40 hover:bg-primary/8 hover:text-content"
          active-class="border-primary bg-primary/10 text-content"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" stroke-linejoin="round" />
          </svg>
          <span class="hidden sm:inline">Shortlist</span>
          <ClientOnly>
            <span
              v-if="store.count > 0"
              class="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white"
            >
              {{ store.count }}
            </span>
          </ClientOnly>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
