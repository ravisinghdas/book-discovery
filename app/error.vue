<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Global error page — shown for unhandled errors and 404s.
 * `clearError` resets the error state and redirects home.
 */
defineProps<{ error: NuxtError }>()

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div
    class="flex min-h-dvh flex-col items-center justify-center gap-6 bg-canvas px-4 text-center"
  >
    <p class="text-7xl font-extrabold text-primary">
      {{ error.statusCode || 500 }}
    </p>
    <h1 class="text-2xl font-bold text-content">
      {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
    </h1>
    <p class="max-w-md text-content-muted">
      {{
        error.statusCode === 404
          ? "We couldn't find the page you were looking for."
          : 'An unexpected error occurred. Please try again.'
      }}
    </p>
    <button
      type="button"
      class="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-strong"
      @click="handleClear"
    >
      Back to search
    </button>
  </div>
</template>
