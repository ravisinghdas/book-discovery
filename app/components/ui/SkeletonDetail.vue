<script setup lang="ts">
/**
 * SkeletonDetail — full-page loading placeholder for the book detail view.
 * Mirrors BookDetail's two-column layout so the page doesn't reflow on load.
 */
</script>

<template>
  <div class="grid gap-10 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]" aria-hidden="true">
    <!-- Cover -->
    <div class="mx-auto w-48 shrink-0 md:mx-0 md:w-full">
      <div class="skeleton aspect-[2/3] w-full rounded-card" />
    </div>

    <!-- Text column -->
    <div class="space-y-4">
      <div class="skeleton h-9 w-3/4 rounded" />
      <div class="skeleton h-5 w-1/2 rounded" />

      <div class="flex gap-2 pt-2">
        <div class="skeleton h-6 w-20 rounded-pill" />
        <div class="skeleton h-6 w-24 rounded-pill" />
        <div class="skeleton h-6 w-16 rounded-pill" />
      </div>

      <div class="space-y-2 pt-4">
        <div class="skeleton h-4 w-full rounded" />
        <div class="skeleton h-4 w-full rounded" />
        <div class="skeleton h-4 w-11/12 rounded" />
        <div class="skeleton h-4 w-4/5 rounded" />
        <div class="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  </div>
</template>
