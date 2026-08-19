<script setup lang="ts">
import { useShortlistStore } from '~~/stores/shortlist'
import { toShortlistedBook } from '~/utils/formatters'
import type { GoogleBookVolume } from '~~/shared/types/book'

/**
 * Toggles a book in/out of the shortlist.
 *
 * Takes the full volume so it can build the compact stored record at save time.
 * Renders a bookmark that fills when saved. Works on both the card (compact)
 * and the detail page (label variant).
 */
const props = withDefaults(
  defineProps<{
    book: GoogleBookVolume
    /** 'icon' = bookmark only (cards); 'labeled' = bookmark + text (detail). */
    variant?: 'icon' | 'labeled'
  }>(),
  { variant: 'icon' }
)

const shortlist = useShortlistStore()
const saved = computed(() => shortlist.isShortlisted(props.book.id))

// Brief scale pop on toggle for tactile feedback.
const animating = ref(false)
function onToggle() {
  shortlist.toggle(toShortlistedBook(props.book))
  animating.value = true
  window.setTimeout(() => (animating.value = false), 200)
}

const label = computed(() => (saved.value ? 'Remove from shortlist' : 'Add to shortlist'))
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :aria-pressed="saved"
    :title="label"
    class="inline-flex items-center justify-center gap-1.5 rounded-button transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    :class="[
      variant === 'icon'
        ? 'h-9 w-9 bg-white/90 text-ink shadow-sm ring-1 ring-hairline hover:bg-white'
        : 'px-4 py-2 text-sm font-semibold ring-1 ring-hairline',
      saved && variant === 'labeled' ? 'bg-primary text-white ring-primary' : '',
      !saved && variant === 'labeled' ? 'bg-white text-ink hover:bg-slate-50' : '',
      animating ? 'scale-110' : 'scale-100'
    ]"
    @click.stop.prevent="onToggle"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :fill="saved ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-5 w-5"
      :class="variant === 'icon' && saved ? 'text-primary' : ''"
      aria-hidden="true"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
    <span v-if="variant === 'labeled'">{{ saved ? 'Saved' : 'Shortlist' }}</span>
  </button>
</template>
