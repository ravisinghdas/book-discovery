import type { BookSummary, GoogleBooksResponse } from '~~/shared/types/book'
import { toBookSummary } from '~/utils/formatters'

const PAGE_SIZE = 20
const DEBOUNCE_MS = 350

/**
 * Encapsulates the search page's data concerns:
 *  - debounced querying as the user types
 *  - cursor-based pagination for infinite scroll (`startIndex`)
 *  - de-duplication (the API sometimes returns overlapping items)
 *  - stale-response guarding via a monotonically increasing request id
 *
 * The component stays declarative and just reacts to the returned refs.
 */
export function useBookSearch() {
  const query = ref('')
  const books = ref<BookSummary[]>([])
  const totalItems = ref(0)

  const isLoading = ref(false) // initial load for a new query
  const isLoadingMore = ref(false) // subsequent pages
  const error = ref<string | null>(null)
  const hasSearched = ref(false)

  const hasMore = computed(
    () => books.value.length > 0 && books.value.length < totalItems.value,
  )

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  // Guards against out-of-order responses when the user types quickly.
  let latestRequestId = 0

  async function fetchPage(reset: boolean) {
    const q = query.value.trim()
    if (!q) return

    if (!reset && (isLoadingMore.value || !hasMore.value)) return

    const requestId = ++latestRequestId
    const startIndex = reset ? 0 : books.value.length

    if (reset) isLoading.value = true
    else isLoadingMore.value = true
    error.value = null

    try {
      const data = await $fetch<GoogleBooksResponse>('/api/books/search', {
        params: { q, startIndex, maxResults: PAGE_SIZE },
      })

      // A newer request superseded this one — discard the result.
      if (requestId !== latestRequestId) return

      const incoming = (data.items ?? []).map(toBookSummary)
      totalItems.value = data.totalItems ?? 0

      if (reset) {
        books.value = incoming
      } else {
        const seen = new Set(books.value.map((b) => b.id))
        books.value = [...books.value, ...incoming.filter((b) => !seen.has(b.id))]
      }
      hasSearched.value = true
    } catch {
      if (requestId !== latestRequestId) return
      error.value = 'Something went wrong while searching. Please try again.'
    } finally {
      if (requestId === latestRequestId) {
        isLoading.value = false
        isLoadingMore.value = false
      }
    }
  }

  function loadMore() {
    return fetchPage(false)
  }

  /** Retry the current query after an error. */
  function retry() {
    return fetchPage(true)
  }

  watch(query, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    if (!value.trim()) {
      books.value = []
      totalItems.value = 0
      hasSearched.value = false
      error.value = null
      isLoading.value = false
      return
    }

    debounceTimer = setTimeout(() => fetchPage(true), DEBOUNCE_MS)
  })

  onScopeDispose(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
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
  }
}
