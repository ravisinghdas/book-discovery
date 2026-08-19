<script setup lang="ts">
import ShortlistButton from '~/components/book/ShortlistButton.vue'
import { formatAuthors, formatPublishedYear, getThumbnail } from '~/utils/formatters'
import type { GoogleBookVolume } from '~~/shared/types/book'

/**
 * BookCard — the result tile used in search + shortlist grids.
 *
 * Presentational apart from the ShortlistButton it hosts. All the "missing
 * data" logic is delegated to the formatter helpers so the template stays
 * declarative. The whole card is a link to the detail page; the shortlist
 * button stops propagation so saving doesn't navigate.
 */
const props = defineProps<{
  book: GoogleBookVolume
}>()

const cover = computed(() => getThumbnail(props.book.volumeInfo.imageLinks))
const authors = computed(() => formatAuthors(props.book.volumeInfo.authors))
const year = computed(() => formatPublishedYear(props.book.volumeInfo.publishedDate))
const title = computed(() => props.book.volumeInfo.title || 'Untitled')
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-card bg-surface-light shadow-sm ring-1 ring-hairline transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
  >
    <NuxtLink
      :to="`/books/${book.id}`"
      class="flex flex-1 flex-col"
      :aria-label="`View details for ${title}`"
    >
      <!-- Cover -->
      <div class="relative aspect-[2/3] overflow-hidden bg-slate-100">
        <img
          v-if="cover"
          :src="cover"
          :alt="`Cover of ${title}`"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
        <!-- Fallback when no cover is available -->
        <div
          v-else
          class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="h-10 w-10 text-slate-400"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span class="line-clamp-3 text-xs font-medium text-slate-500">{{ title }}</span>
        </div>
      </div>

      <!-- Meta -->
      <div class="flex flex-1 flex-col gap-1 p-3">
        <h3 class="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {{ title }}
        </h3>
        <p class="line-clamp-1 text-xs text-muted">{{ authors }}</p>
        <p v-if="year" class="mt-auto pt-1 text-xs text-muted">{{ year }}</p>
      </div>
    </NuxtLink>

    <!-- Shortlist toggle, floated over the cover -->
    <div class="absolute right-2 top-2">
      <ShortlistButton :book="book" variant="icon" />
    </div>
  </article>
</template>
