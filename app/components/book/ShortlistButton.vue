<script setup lang="ts">
import { computed } from 'vue'
import { useShortlistStore } from '~~/stores/shortlist'
import type { BookSummary } from '~~/shared/types/book'

/**
 * The primary save/remove action, used on the detail page. Takes the compact
 * BookSummary so it can persist the record directly. Reads/writes the store.
 */
const props = defineProps<{ book: BookSummary }>()

const store = useShortlistStore()
const active = computed(() => store.isShortlisted(props.book.id))
</script>

<template>
  <!--
    ClientOnly: shortlisted state is persisted to localStorage, only available
    in the browser — rendering server-side would cause a hydration mismatch.
  -->
  <ClientOnly>
    <button
      type="button"
      :aria-pressed="active"
      class="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold shadow-sm transition active:scale-95"
      :class="
        active
          ? 'bg-surface-raised text-primary ring-1 ring-primary/30 hover:bg-surface-hover'
          : 'bg-primary text-white hover:bg-primary-strong'
      "
      @click="store.toggle(book)"
    >
      <svg
        viewBox="0 0 24 24"
        class="h-5 w-5"
        :fill="active ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path
          d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z"
          stroke-linejoin="round"
        />
      </svg>
      {{ active ? 'Saved to shortlist' : 'Add to shortlist' }}
    </button>

    <template #fallback>
      <div class="h-11 w-48 rounded-lg bg-surface-raised" />
    </template>
  </ClientOnly>
</template>
