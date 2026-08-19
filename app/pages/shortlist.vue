<script setup lang="ts">
import BookGrid from '~/components/book/BookGrid.vue'
import BookCard from '~/components/ui/BookCard.vue'
import { useShortlistStore } from '~~/stores/shortlist'
import type { BookSummary } from '~~/shared/types/book'

useHead({ title: 'Shortlist — Book Discovery' })

const store = useShortlistStore()

function onToggle(book: BookSummary) {
  store.toggle(book)
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
          My Shortlist
        </h1>
        <ClientOnly>
          <p class="mt-1 text-content-muted">
            {{ store.count }} book{{ store.count === 1 ? '' : 's' }} saved
          </p>
        </ClientOnly>
      </div>
    </div>

    <!--
      ClientOnly: the list is driven by a localStorage-persisted store that only
      hydrates in the browser.
    -->
    <ClientOnly>
      <BookGrid v-if="store.count > 0">
        <BookCard
          v-for="book in store.books"
          :key="book.id"
          :book="book"
          :shortlisted="true"
          from="shortlist"
          @toggle="onToggle"
        />
      </BookGrid>

      <!-- Empty state -->
      <div v-else class="py-20 text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-raised text-content-subtle"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-8 w-8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="mt-4 text-lg font-semibold text-content">
          Your shortlist is empty
        </p>
        <p class="mt-1 text-content-muted">
          Bookmark books while browsing and they'll appear here.
        </p>
        <NuxtLink
          to="/"
          class="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-strong"
        >
          Start discovering
        </NuxtLink>
      </div>

      <template #fallback>
        <div class="py-20" aria-hidden="true" />
      </template>
    </ClientOnly>
  </div>
</template>
