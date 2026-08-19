<script setup lang="ts">
import { computed, ref } from 'vue'
import Badge from '~/components/ui/Badge.vue'
import ShortlistButton from '~/components/book/ShortlistButton.vue'
import type { BookDetails } from '~~/shared/types/book'
import { formatAuthors } from '~/utils/formatters'

/**
 * BookDetail — the presentational detail view for a normalized BookDetails.
 *
 * Every optional field renders conditionally, so a sparse record still looks
 * clean. The description is rendered with v-html (Google returns light HTML);
 * scoped `.book-prose` styles tame the markup and the API response is trusted
 * only for basic tags.
 */
const props = defineProps<{ book: BookDetails }>()

const imageFailed = ref(false)
const authorLine = computed(() => formatAuthors(props.book.authors))
const coverSrc = computed(() =>
  !props.book.cover || imageFailed.value
    ? '/book-placeholder.svg'
    : props.book.cover,
)
</script>

<template>
  <article class="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
    <!-- Cover column -->
    <div class="mx-auto w-full max-w-xs md:mx-0">
      <div class="overflow-hidden rounded-card bg-surface-raised shadow-md ring-1 ring-border">
        <img
          :src="coverSrc"
          :alt="`Cover of ${book.title}`"
          class="aspect-[2/3] w-full object-cover"
          @error="imageFailed = true"
        />
      </div>
    </div>

    <!-- Details column -->
    <div class="min-w-0">
      <h1 class="text-3xl font-extrabold leading-tight text-content sm:text-4xl">
        {{ book.title }}
      </h1>
      <p v-if="book.subtitle" class="mt-2 text-lg text-content-muted">
        {{ book.subtitle }}
      </p>

      <p class="mt-3 text-lg text-content-muted">by {{ authorLine }}</p>

      <!-- Quick facts -->
      <dl class="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div v-if="book.publishedYear">
          <dt class="text-content-subtle">Published</dt>
          <dd class="font-semibold text-content">{{ book.publishedYear }}</dd>
        </div>
        <div v-if="book.publisher">
          <dt class="text-content-subtle">Publisher</dt>
          <dd class="font-semibold text-content">{{ book.publisher }}</dd>
        </div>
        <div v-if="book.pageCount">
          <dt class="text-content-subtle">Pages</dt>
          <dd class="font-semibold text-content">{{ book.pageCount }}</dd>
        </div>
        <div v-if="book.averageRating">
          <dt class="text-content-subtle">Rating</dt>
          <dd class="font-semibold text-content">
            {{ book.averageRating }}★
            <span v-if="book.ratingsCount" class="text-content-subtle">
              ({{ book.ratingsCount }})
            </span>
          </dd>
        </div>
      </dl>

      <!-- Categories -->
      <div v-if="book.categories.length" class="mt-5 flex flex-wrap gap-2">
        <Badge
          v-for="category in book.categories"
          :key="category"
          :label="category"
          variant="primary"
        />
      </div>

      <!-- Shortlist action -->
      <div class="mt-6">
        <ShortlistButton :book="book" />
      </div>

      <!-- Description -->
      <section class="mt-8">
        <h2 class="text-lg font-bold text-content">About this book</h2>
        <div
          v-if="book.description"
          class="book-prose mt-3 max-w-none space-y-3 leading-relaxed text-content-muted"
          v-html="book.description"
        />
        <p v-else class="mt-3 text-content-subtle">
          No description available for this title.
        </p>
      </section>
    </div>
  </article>
</template>

<style scoped>
.book-prose :deep(p) {
  margin-bottom: 0.75rem;
}
.book-prose :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}
.book-prose :deep(b),
.book-prose :deep(strong) {
  color: var(--color-content);
}
</style>
