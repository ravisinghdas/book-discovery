<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'

/**
 * Default layout — the app shell shared by every page.
 * Sticky header + a centred, responsive main content column.
 */
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-canvas">
    <AppHeader />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
