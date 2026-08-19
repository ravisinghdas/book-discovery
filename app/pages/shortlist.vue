<script setup lang="ts">
import BookGrid from '~/components/book/BookGrid.vue'
import { useShortlistStore } from '~~/stores/shortlist'
import { formatAuthors } from '~/utils/formatters'

/**
 * Shortlist page — the user's saved books.
 *
 * Renders straight from the persisted store's compact records (no API calls
 * needed, so saved books show instantly and work offline). Each tile links to
 * the full detail page and can be removed inline.
 */
const shortlist = useShortlistStore()

useHead({ title: 'Book Discovery — Your Shortlist' })
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-ink">Your Shortlist</h1>
      <p class="text-sm text-muted">
        {{ shortlist.count }} {{ shortlist.count === 1 ? 'book' : 'books' }} saved
      </p>
    </header>

    <!-- Empty state -->
    <div
      v-if="shortlist.count === 0"
      class="flex flex-col items-center gap-4 rounded-card border border-hairline bg-white py-20 text-center"
    >
      <div class="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
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
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-ink">No books saved yet</p>
        <p class="text-sm text-muted">Find something great and tap the bookmark to save it.</p>
      </div>
      <NuxtLink
        to="/"
        class="rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Start searching
      </NuxtLink>
    </div>

    <!-- Saved books -->
    <BookGrid v-else>
      <article
        v-for="book in shortlist.books"
        :key="book.id"
        class="group relative flex flex-col overflow-hidden rounded-card bg-surface-light shadow-sm ring-1 ring-hairline transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <NuxtLink :to="`/books/${book.id}`" class="flex flex-1 flex-col" :aria-label="`View details for ${book.title}`">
          <div class="relative aspect-[2/3] overflow-hidden bg-slate-100">
            <img
              v-if="book.thumbnail"
              :src="book.thumbnail"
              :alt="`Cover of ${book.title}`"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center"
            >
              <span class="line-clamp-3 text-xs font-medium text-slate-500">{{ book.title }}</span>
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-1 p-3">
            <h3 class="line-clamp-2 text-sm font-semibold leading-snug text-ink">{{ book.title }}</h3>
            <p class="line-clamp-1 text-xs text-muted">{{ formatAuthors(book.authors) }}</p>
            <p v-if="book.publishedYear" class="mt-auto pt-1 text-xs text-muted">
              {{ book.publishedYear }}
            </p>
          </div>
        </NuxtLink>

        <button
          type="button"
          :aria-label="`Remove ${book.title} from shortlist`"
          class="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-button bg-white/90 text-primary shadow-sm ring-1 ring-hairline transition-colors hover:bg-white"
          @click="shortlist.remove(book.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </article>
    </BookGrid>
  </div>
</template>
