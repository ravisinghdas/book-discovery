import type { Ref } from 'vue'

interface UseInfiniteScrollOptions {
  /** Called when the sentinel scrolls into view and loading is allowed. */
  onLoadMore: () => void
  /** Gate that decides whether a load should actually fire. */
  canLoadMore: () => boolean
  /** Distance from the viewport at which to trigger (default 300px). */
  rootMargin?: string
}

/**
 * Watches a sentinel element with an IntersectionObserver and invokes
 * `onLoadMore` when it becomes visible. Kept dependency-free and framework
 * agnostic so it is easy to reason about and test.
 */
export function useInfiniteScroll(
  sentinel: Ref<HTMLElement | null>,
  { onLoadMore, canLoadMore, rootMargin = '300px' }: UseInfiniteScrollOptions,
) {
  let observer: IntersectionObserver | null = null

  function observe(el: HTMLElement) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && canLoadMore()) {
          onLoadMore()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
  }

  onMounted(() => {
    if (sentinel.value) observe(sentinel.value)
  })

  // Re-bind if the sentinel element is re-created (e.g. v-if toggles).
  watch(sentinel, (el) => {
    observer?.disconnect()
    observer = null
    if (el) observe(el)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
