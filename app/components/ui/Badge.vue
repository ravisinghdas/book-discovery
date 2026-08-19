<script setup lang="ts">
/**
 * Badge — a small pill used for categories and metadata chips.
 * Presentational only (Storybook target). Variant switches the color scheme.
 */
withDefaults(
  defineProps<{
    label: string
    variant?: 'neutral' | 'primary' | 'accent'
  }>(),
  { variant: 'neutral' }
)

const variantClasses: Record<string, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-amber-700'
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
    :class="variantClasses[variant]"
  >
    {{ label }}
  </span>
</template>
