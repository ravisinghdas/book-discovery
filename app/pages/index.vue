<script setup lang="ts">
import SearchInput from '~/components/ui/SearchInput.vue'
import BookCard from '~/components/ui/BookCard.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import BookGrid from '~/components/book/BookGrid.vue'
import { useBookSearch } from '~/composables/useBookSearch'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'

/**
 * Search page.
 *
 * Two visual modes sharing one search field:
 *  - Hero (centered) before any search — matches the reference landing view.
 *  - Compact (top-aligned) once a search is active, with results below.
 *
 * All async states are handled explicitly: initial, loading, empty, error,
 * loading-more, and end-of-results.
 */
const {
  query,
  books,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  totalItems,
  hasSearched,
  loadMore,
  retry
} = useBookSearch()

// Show the big centered hero only before an active search.
const showHero = computed(() => !hasSearched.value && !isLoading.value && !error.value)

// Quick-start category shortcuts from the reference design.
const categories = [
  { label: 'Fiction', emoji: '📖' },
  { label: 'Science', emoji: '🔬' },
  { label: 'Psychology', emoji: '🧠' },
  { label: 'History', emoji: '🌍' },
  { label: 'Self-Help', emoji: '💡' }
]

function pickCategory(label: string) {
  query.value = label
}

// Infinite scroll: observe the sentinel, load the next page when it appears.
const sentinel = ref<HTMLElement | null>(null)
const canLoadMore = computed(() => hasMore.value && !isLoading.value && !isLoadingMore.value)
useInfiniteScroll(sentinel, loadMore, { enabled: canLoadMore })

useHead({
  title: 'Book Discovery — Search',
  meta: [
    {
      name: 'description',
      content: 'Search millions of books by title, author, or genre and save your favorites.'
    }
  ]
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <!-- ============ HERO / SEARCH ============ -->
    <section
      :class="[
        'flex flex-col items-center text-center transition-all',
        showHero ? 'min-h-[70vh] justify-center gap-6' : 'gap-4 py-8'
      ]"
    >
      <div v-if="showHero" class="space-y-3">
        <h1
          class="bg-gradient-to-r from-brand-cyan to-brand-teal bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
        >
          Book Discovery
        </h1>
        <p class="text-base text-muted sm:text-lg">
          Search millions of titles. Save the ones that matter.
        </p>
      </div>

      <div class="w-full max-w-2xl">
        <SearchInput v-model="query" autofocus />
      </div>

      <!-- Category quick-picks (hero only) -->
      <ul v-if="showHero" class="flex flex-wrap justify-center gap-2">
        <li v-for="cat in categories" :key="cat.label">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow"
            @click="pickCategory(cat.label)"
          >
            <span aria-hidden="true">{{ cat.emoji }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- ============ RESULTS ============ -->
    <section v-if="!showHero" class="pb-16" aria-live="polite">
      <!-- Results heading -->
      <div v-if="!isLoading && !error && books.length" class="mb-4">
        <h2 class="text-lg font-semibold text-ink">
          Results for “{{ query.trim() }}”
        </h2>
        <p class="text-sm text-muted">
          Showing {{ books.length }}{{ totalItems ? ` of about ${totalItems.toLocaleString()}` : '' }} books
        </p>
      </div>

      <!-- Loading: skeleton grid -->
      <BookGrid v-if="isLoading">
        <SkeletonCard v-for="n in 10" :key="n" />
      </BookGrid>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="flex flex-col items-center gap-4 rounded-card border border-hairline bg-white py-16 text-center"
      >
        <div class="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-7 w-7"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-ink">{{ error }}</p>
          <p class="text-sm text-muted">Check your connection and try again.</p>
        </div>
        <button
          type="button"
          class="rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          @click="retry"
        >
          Retry
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="hasSearched && !books.length"
        class="flex flex-col items-center gap-3 rounded-card border border-hairline bg-white py-16 text-center"
      >
        <div class="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-7 w-7"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-ink">No books found for “{{ query.trim() }}”</p>
          <p class="text-sm text-muted">Try a different title, author, or keyword.</p>
        </div>
      </div>

      <!-- Results grid -->
      <template v-else>
        <BookGrid>
          <BookCard v-for="book in books" :key="book.id" :book="book" />
        </BookGrid>

        <!-- Infinite-scroll sentinel + loading-more indicator -->
        <div ref="sentinel" class="h-px w-full" />

        <div v-if="isLoadingMore" class="flex justify-center py-8">
          <span
            class="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
            role="status"
            aria-label="Loading more books"
          />
        </div>

        <p
          v-else-if="!hasMore && books.length"
          class="py-8 text-center text-sm text-muted"
        >
          You’ve reached the end of the results.
        </p>
      </template>
    </section>
  </div>
</template>
