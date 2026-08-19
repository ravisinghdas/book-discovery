<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BookSummary } from '~~/shared/types/book'
import { formatAuthors } from '~/utils/formatters'

/**
 * BookCard — a purely presentational result tile.
 *
 * It owns no store: the parent passes the `shortlisted` state and listens for
 * the `toggle` event. This keeps the card trivial to render in isolation
 * (Storybook) and lets the page decide how saving works.
 */
const props = withDefaults(
  defineProps<{
    book: BookSummary
    shortlisted?: boolean
    /** Where this card is shown — lets the detail page render a matching
     *  "Back to …" link. Defaults to the search page. */
    from?: 'search' | 'shortlist'
  }>(),
  { shortlisted: false, from: 'search' },
)

const emit = defineEmits<{
  toggle: [book: BookSummary]
}>()

// Only add the ?from= param when it's not the default, keeping search URLs clean.
const detailLink = computed(() => ({
  path: `/books/${props.book.id}`,
  query: props.from === 'shortlist' ? { from: 'shortlist' } : {},
}))

const imageFailed = ref(false)
const authorLine = computed(() => formatAuthors(props.book.authors))
const coverSrc = computed(() =>
  !props.book.thumbnail || imageFailed.value
    ? '/book-placeholder.svg'
    : props.book.thumbnail,
)

function onToggle(event: MouseEvent) {
  // The card is a link — don't navigate when tapping the bookmark.
  event.preventDefault()
  event.stopPropagation()
  emit('toggle', props.book)
}
</script>

<template>
  <NuxtLink
    :to="detailLink"
    class="group relative flex flex-col overflow-hidden rounded-card bg-surface ring-1 ring-border transition duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-primary/40 focus-visible:-translate-y-1"
  >
    <!-- Cover -->
    <div class="relative aspect-[2/3] w-full overflow-hidden bg-surface-raised">
      <img
        :src="coverSrc"
        :alt="`Cover of ${book.title}`"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        @error="imageFailed = true"
      />

      <!-- Shortlist toggle — ClientOnly: persisted state unavailable during SSR -->
      <ClientOnly>
        <button
          type="button"
          :aria-label="shortlisted ? 'Remove from shortlist' : 'Add to shortlist'"
          :aria-pressed="shortlisted"
          class="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition hover:bg-white active:scale-90"
          :class="shortlisted ? 'text-primary' : 'text-content-subtle'"
          @click="onToggle"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5"
            :fill="shortlisted ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </ClientOnly>
    </div>

    <!-- Meta -->
    <div class="flex flex-1 flex-col gap-1 p-3">
      <h3 class="line-clamp-2 font-semibold leading-snug text-content">
        {{ book.title }}
      </h3>
      <p class="line-clamp-1 text-sm text-content-muted">{{ authorLine }}</p>
      <p v-if="book.publishedYear" class="mt-auto pt-2 text-xs text-content-subtle">
        {{ book.publishedYear }}
      </p>
    </div>
  </NuxtLink>
</template>
