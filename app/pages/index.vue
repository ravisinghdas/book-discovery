<script setup lang="ts">
import SearchInput from '~/components/ui/SearchInput.vue'
import BookGrid from '~/components/book/BookGrid.vue'
import BookCard from '~/components/ui/BookCard.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import { useBookSearch } from '~/composables/useBookSearch'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'
import { useShortlistStore } from '~~/stores/shortlist'
import type { BookSummary } from '~~/shared/types/book'

useHead({ title: 'Book Discovery' })

const {
  query,
  books,
  totalItems,
  isLoading,
  isLoadingMore,
  error,
  hasSearched,
  hasMore,
  loadMore,
  retry,
} = useBookSearch()

const store = useShortlistStore()

const sentinel = ref<HTMLElement | null>(null)
useInfiniteScroll(sentinel, {
  onLoadMore: loadMore,
  canLoadMore: () => hasMore.value && !isLoadingMore.value && !isLoading.value,
})

function onToggle(book: BookSummary) {
  store.toggle(book)
}

const showEmptyState = computed(
  () =>
    hasSearched.value &&
    !isLoading.value &&
    !error.value &&
    books.value.length === 0,
)

const hints = [
  { label: '📖 Fiction', value: 'fiction' },
  { label: '🔬 Science', value: 'science' },
  { label: '🧠 Psychology', value: 'psychology' },
  { label: '🌍 History', value: 'history' },
  { label: '💡 Self Help', value: 'self help' },
]

function applyHint(value: string) {
  query.value = value
}
</script>

<template>
  <div>
    <!-- ───── Hero: vertically centred landing ───── -->
    <section
      v-if="!hasSearched"
      class="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-6 pb-16 pt-8 text-center"
    >
      <!-- Brand -->
      <div class="mb-8 flex flex-col items-center gap-3">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl">
          <span class="text-gradient">Book Discovery</span>
        </h1>
        <p class="max-w-xs text-sm text-content-muted sm:max-w-none sm:text-base">
          Search millions of titles. Save the ones that matter.
        </p>
      </div>

      <!-- Search bar -->
      <div class="w-full max-w-xl">
        <SearchInput v-model="query" :loading="isLoading" />
      </div>

      <!-- Hint chips -->
      <div class="mt-5 flex flex-wrap justify-center gap-2">
        <button
          v-for="hint in hints"
          :key="hint.value"
          type="button"
          class="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-content-muted shadow-sm transition hover:border-primary/40 hover:bg-surface-raised hover:text-content"
          @click="applyHint(hint.value)"
        >
          {{ hint.label }}
        </button>
      </div>
    </section>

    <!-- ───── Compact header once searching ───── -->
    <template v-else>
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div class="flex-1">
          <SearchInput v-model="query" :loading="isLoading" />
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="rounded-card border border-danger/20 bg-danger/5 p-6 text-center"
      >
        <p class="text-content">{{ error }}</p>
        <button
          type="button"
          class="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
          @click="retry"
        >
          Try again
        </button>
      </div>

      <!-- Initial loading skeletons -->
      <BookGrid v-else-if="isLoading">
        <SkeletonCard v-for="n in 10" :key="n" />
      </BookGrid>

      <!-- Empty state -->
      <div v-else-if="showEmptyState" class="py-20 text-center">
        <p class="text-4xl">📚</p>
        <p class="mt-3 text-lg font-semibold text-content">No books found</p>
        <p class="mt-1 text-content-muted">Try a different title, author, or keyword.</p>
      </div>

      <!-- Results -->
      <div v-else-if="books.length">
        <p class="mb-4 text-sm text-content-subtle">
          {{ totalItems.toLocaleString() }} result{{ totalItems === 1 ? '' : 's' }}
        </p>

        <BookGrid>
          <BookCard
            v-for="book in books"
            :key="book.id"
            :book="book"
            :shortlisted="store.isShortlisted(book.id)"
            @toggle="onToggle"
          />
          <template v-if="isLoadingMore">
            <SkeletonCard v-for="n in 5" :key="`more-${n}`" />
          </template>
        </BookGrid>

        <div ref="sentinel" class="h-px w-full" aria-hidden="true" />

        <p
          v-if="!hasMore && books.length"
          class="py-8 text-center text-sm text-content-subtle"
        >
          You've seen everything — happy reading!
        </p>
      </div>
    </template>
  </div>
</template>
