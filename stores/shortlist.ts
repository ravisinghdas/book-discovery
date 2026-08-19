import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BookSummary } from '~~/shared/types/book'

/**
 * Shortlist store.
 *
 * State is persisted to localStorage via `pinia-plugin-persistedstate`, which
 * is SSR-safe and reactive — the shortlist survives a page refresh without any
 * manual `window.localStorage` juggling or hydration guards.
 */
export const useShortlistStore = defineStore(
  'shortlist',
  () => {
    const books = ref<BookSummary[]>([])

    const count = computed(() => books.value.length)

    const ids = computed(() => new Set(books.value.map((b) => b.id)))

    function isShortlisted(id: string): boolean {
      return ids.value.has(id)
    }

    function add(book: BookSummary) {
      if (!isShortlisted(book.id)) {
        books.value = [book, ...books.value]
      }
    }

    function remove(id: string) {
      books.value = books.value.filter((b) => b.id !== id)
    }

    function toggle(book: BookSummary) {
      if (isShortlisted(book.id)) remove(book.id)
      else add(book)
    }

    return { books, count, isShortlisted, add, remove, toggle }
  },
  {
    persist: true,
  },
)
