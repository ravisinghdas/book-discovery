import type { GoogleBookVolume, GoogleBooksResponse } from '~~/shared/types/book'

/** How many results we request per page (Google allows up to 40). */
const PAGE_SIZE = 20

/** Debounce window for the search input, in milliseconds. */
const DEBOUNCE_MS = 300

/**
 * useBookSearch — owns all search state and the talking-to-the-API logic.
 *
 * Responsibilities:
 *  - Debounce the query so we don't fire a request on every keystroke.
 *  - Fetch the first page (search) and subsequent pages (loadMore).
 *  - Track granular loading flags so the UI can show skeletons vs. a spinner.
 *  - Cope with Google's quirks: missing `items`, duplicate ids across pages,
 *    and an unreliable `totalItems`.
 *  - Ignore out-of-order responses when the query changes mid-flight.
 */
export function useBookSearch() {
  const query = ref('')
  const books = ref<GoogleBookVolume[]>([])
  const isLoading = ref(false) // first page / fresh search
  const isLoadingMore = ref(false) // appending a page
  const hasMore = ref(false)
  const error = ref<string | null>(null)
  const totalItems = ref(0)
  const hasSearched = ref(false) // distinguishes "no query yet" from "no results"

  const startIndex = ref(0)

  // Bumped on every fresh search so stale in-flight responses can be discarded.
  let requestToken = 0

  async function fetchPage(reset: boolean) {
    const term = query.value.trim()

    // Empty query resets to the initial (pre-search) state.
    if (!term) {
      books.value = []
      totalItems.value = 0
      hasMore.value = false
      hasSearched.value = false
      error.value = null
      return
    }

    const token = ++requestToken

    if (reset) {
      isLoading.value = true
      startIndex.value = 0
      error.value = null
    } else {
      isLoadingMore.value = true
    }

    try {
      const data = await $fetch<GoogleBooksResponse>('/api/books/search', {
        params: { q: term, startIndex: startIndex.value, maxResults: PAGE_SIZE }
      })

      // A newer search started while this was in flight — drop the result.
      if (token !== requestToken) return

      const items = data.items ?? [] // `items` can be missing even with totalItems > 0
      totalItems.value = data.totalItems ?? 0

      if (reset) {
        books.value = items
      } else {
        // Dedupe: Google occasionally repeats ids across page boundaries.
        const seen = new Set(books.value.map((b) => b.id))
        books.value.push(...items.filter((b) => !seen.has(b.id)))
      }

      startIndex.value += items.length

      // A short page (or an empty one) means we've reached the end.
      hasMore.value = items.length === PAGE_SIZE
      hasSearched.value = true
    } catch (err) {
      if (token !== requestToken) return
      console.error('[useBookSearch] search failed:', err)
      error.value = 'Something went wrong while searching. Please try again.'
      hasMore.value = false
    } finally {
      if (token === requestToken) {
        isLoading.value = false
        isLoadingMore.value = false
      }
    }
  }

  /** Run a fresh search from the top. */
  function search() {
    return fetchPage(true)
  }

  /** Append the next page. No-ops if already loading or nothing left. */
  function loadMore() {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return
    return fetchPage(false)
  }

  /** Retry after an error, keeping the current query. */
  function retry() {
    return fetchPage(true)
  }

  // Debounced reactive search: wait for typing to settle before firing.
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  watch(query, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fetchPage(true), DEBOUNCE_MS)
  })

  onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    query,
    books,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    totalItems,
    hasSearched,
    search,
    loadMore,
    retry,
    PAGE_SIZE
  }
}
