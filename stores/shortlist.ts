import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShortlistedBook } from '~~/shared/types/book'

/**
 * Shortlist store — the user's personal saved-books list.
 *
 * Uses Pinia's setup-store syntax. `persist: true` (via
 * pinia-plugin-persistedstate) transparently mirrors state to localStorage,
 * so the shortlist survives a page refresh. It's SSR-safe: persistence only
 * runs on the client, avoiding "window is undefined" during server render.
 */
export const useShortlistStore = defineStore(
  'shortlist',
  () => {
    const books = ref<ShortlistedBook[]>([])

    /** True if a given volume id is already saved. */
    function isShortlisted(bookId: string): boolean {
      return books.value.some((b) => b.id === bookId)
    }

    /** Add a book, ignoring duplicates. */
    function add(book: ShortlistedBook): void {
      if (!isShortlisted(book.id)) {
        books.value.push(book)
      }
    }

    /** Remove a book by id. */
    function remove(bookId: string): void {
      books.value = books.value.filter((b) => b.id !== bookId)
    }

    /** Add if absent, remove if present. Returns the new saved state. */
    function toggle(book: ShortlistedBook): boolean {
      if (isShortlisted(book.id)) {
        remove(book.id)
        return false
      }
      add(book)
      return true
    }

    const count = computed(() => books.value.length)

    return { books, isShortlisted, add, remove, toggle, count }
  },
  {
    persist: true
  }
)
