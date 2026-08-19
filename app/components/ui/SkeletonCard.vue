<script setup lang="ts">
/**
 * SkeletonCard — a pulsing placeholder shown while search results load.
 * Mirrors BookCard's proportions so the grid doesn't jump when data arrives.
 * Purely presentational (Storybook target).
 */
</script>

<template>
  <div
    class="flex flex-col overflow-hidden rounded-card bg-surface-light shadow-sm ring-1 ring-hairline"
    aria-hidden="true"
  >
    <div class="aspect-[2/3] animate-pulse bg-slate-200" />
    <div class="flex flex-col gap-2 p-3">
      <div class="h-3.5 w-11/12 animate-pulse rounded bg-slate-200" />
      <div class="h-3.5 w-3/5 animate-pulse rounded bg-slate-200" />
      <div class="h-3 w-2/5 animate-pulse rounded bg-slate-100" />
    </div>
  </div>
</template>
