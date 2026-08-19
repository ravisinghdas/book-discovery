<script setup lang="ts">
/**
 * BookGrid — responsive grid container.
 * A layout primitive: it just arranges whatever cards are slotted into it.
 * 2 cols on mobile scaling up to 5 on wide screens.
 */
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    <slot />
  </div>
</template>
