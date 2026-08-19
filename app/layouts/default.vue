<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

/**
 * Default layout — app shell shared by every page.
 * Sticky header, flexible main region, footer pinned to the bottom on short pages.
 * The skip link lets keyboard users jump straight to content.
 */
</script>

<template>
  <div class="flex min-h-screen flex-col bg-page">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>

    <AppHeader />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
