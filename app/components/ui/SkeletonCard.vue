<script setup lang="ts">
/**
 * SkeletonCard — pulsing placeholder shown while search results load.
 * Mirrors BookCard's dimensions so the grid doesn't jump when data arrives.
 */
</script>

<template>
  <div class="overflow-hidden rounded-card bg-surface ring-1 ring-border" aria-hidden="true">
    <div class="skeleton aspect-[2/3] w-full" />
    <div class="space-y-2 p-3">
      <div class="skeleton h-4 w-11/12 rounded" />
      <div class="skeleton h-4 w-2/3 rounded" />
      <div class="skeleton mt-3 h-3 w-1/3 rounded" />
    </div>
  </div>
</template>
