<script setup lang="ts">
import BookDetail from '~/components/book/BookDetail.vue'
import SkeletonDetail from '~/components/ui/SkeletonDetail.vue'
import type { GoogleBookVolume } from '~~/shared/types/book'
import { toBookDetails } from '~/utils/formatters'

const route = useRoute()
const id = computed(() => String(route.params.id))

// `lazy` so navigation isn't blocked and the skeleton is shown while the
// request is in flight. Tradeoff (see README): the very first paint on a hard
// refresh isn't server-rendered with data. Acceptable for a discovery UI.
const { data, status, error } = useLazyAsyncData(
  () => `book-${id.value}`,
  () => $fetch<GoogleBookVolume>(`/api/books/${id.value}`),
  { watch: [id] },
)

const book = computed(() => (data.value ? toBookDetails(data.value) : null))

useHead(() => ({
  title: book.value ? `${book.value.title} — Book Discovery` : 'Book — Book Discovery',
}))
</script>

<template>
  <div>
    <!-- Back link -->
    <NuxtLink
      to="/"
      class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-content-muted transition hover:text-content"
    >
      <svg
        viewBox="0 0 24 24"
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Back to search
    </NuxtLink>

    <!-- Loading -->
    <SkeletonDetail v-if="status === 'pending'" />

    <!-- Error -->
    <div
      v-else-if="error || !book"
      class="rounded-card border border-danger/30 bg-danger/10 p-8 text-center"
    >
      <p class="text-lg font-semibold text-content">Couldn't load this book</p>
      <p class="mt-1 text-content-muted">
        The book may not exist or the request failed.
      </p>
      <NuxtLink
        to="/"
        class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
      >
        Back to search
      </NuxtLink>
    </div>

    <!-- Detail -->
    <BookDetail v-else :book="book" />
  </div>
</template>
