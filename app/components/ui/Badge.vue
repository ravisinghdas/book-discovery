<script setup lang="ts">
/**
 * Badge — a small pill used for categories and metadata chips.
 * Presentational only (Storybook target). Variant switches the colour scheme.
 */
withDefaults(
  defineProps<{
    label: string
    variant?: 'neutral' | 'primary' | 'accent'
  }>(),
  { variant: 'neutral' },
)

const variants: Record<string, string> = {
  neutral: 'bg-surface-raised text-content-muted ring-border',
  primary: 'bg-primary/10 text-primary ring-primary/25',
  accent:  'bg-accent/10 text-accent-strong ring-accent/25',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium ring-1 ring-inset"
    :class="variants[variant]"
  >
    {{ label }}
  </span>
</template>
