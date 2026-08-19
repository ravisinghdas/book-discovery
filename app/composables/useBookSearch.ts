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
 * Search state (query, results, scroll position) is held in `useState` rather
 * than local refs, so it SURVIVES navigation: opening a book and pressing
 * "Back to search" restores the previous results and scroll position instead of
 * resetting to an empty page. The query is also mirrored to the URL (`?q=`) so
 * results are shareable and bookmarkable.
 */
export function useBookSearch() {
  const route = useRoute()
  const router = useRouter()

  // ── Persistent state (shared across mounts via useState) ──
  const query = useState<string>('search:query', () =>
    typeof route.query.q === 'string' ? route.query.q : '',
  )
  const books = useState<BookSummary[]>('search:books', () => [])
  const totalItems = useState<number>('search:totalItems', () => 0)
  const hasSearched = useState<boolean>('search:hasSearched', () => false)
  const scrollY = useState<number>('search:scrollY', () => 0)

  // ── Transient per-view state (fine to reset on remount) ──
  const isLoading = ref(false) // initial load for a new query
  const isLoadingMore = ref(false) // subsequent pages
  const error = ref<string | null>(null)

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

  // Debounced search + URL sync whenever the query changes.
  watch(query, (value) => {
    const q = value.trim()

    // Mirror the query into the URL (replace, so we don't spam history).
    const current = typeof route.query.q === 'string' ? route.query.q : ''
    if (current !== q) {
      router.replace({ query: q ? { q } : {} })
    }

    if (debounceTimer) clearTimeout(debounceTimer)

    if (!q) {
      books.value = []
      totalItems.value = 0
      hasSearched.value = false
      error.value = null
      isLoading.value = false
      return
    }

    debounceTimer = setTimeout(() => fetchPage(true), DEBOUNCE_MS)
  })

  onMounted(() => {
    const q = query.value.trim()
    const urlQ = typeof route.query.q === 'string' ? route.query.q : ''

    // Arrived via a plain link (e.g. "Back to search" → "/") while a query is
    // still in shared state: reflect it back into the URL so it stays shareable.
    if (q && !urlQ) {
      router.replace({ query: { q } })
    }

    // Coming from a shared URL (or a hard refresh with ?q=): run the search.
    if (q && !hasSearched.value) {
      fetchPage(true)
      return
    }

    // Returning from a detail page: results are already in shared state —
    // just restore the scroll position the user left from.
    if (books.value.length && scrollY.value > 0) {
      nextTick(() => window.scrollTo({ top: scrollY.value }))
    }
  })

  // Remember scroll position so we can restore it when the user returns.
  onBeforeUnmount(() => {
    if (import.meta.client) scrollY.value = window.scrollY
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
