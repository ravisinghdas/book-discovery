import type { Ref } from 'vue'

/**
 * useInfiniteScroll — fires a callback when a sentinel element scrolls into view.
 *
 * Wraps the IntersectionObserver API and ties its lifecycle to the component:
 * the observer is created on mount and torn down on unmount, so there are no
 * leaks. `rootMargin` pre-loads slightly before the sentinel is fully visible.
 *
 * Usage:
 *   const sentinel = ref<HTMLElement | null>(null)
 *   useInfiniteScroll(sentinel, () => loadMore())
 */
export function useInfiniteScroll(
  target: Ref<HTMLElement | null>,
  onIntersect: () => void,
  options: { rootMargin?: string; enabled?: Ref<boolean> } = {}
) {
  const { rootMargin = '300px', enabled } = options
  let observer: IntersectionObserver | null = null

  function observe() {
    // IntersectionObserver only exists in the browser — guard for SSR.
    if (typeof IntersectionObserver === 'undefined' || !target.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          // Respect an optional enabled flag (e.g. don't load while a fetch is in flight).
          if (!enabled || enabled.value) {
            onIntersect()
          }
        }
      },
      { rootMargin }
    )
    observer.observe(target.value)
  }

  function disconnect() {
    observer?.disconnect()
    observer = null
  }

  onMounted(observe)
  onBeforeUnmount(disconnect)

  // Re-attach if the sentinel element is swapped out/in (e.g. v-if toggles).
  watch(target, (el) => {
    disconnect()
    if (el) observe()
  })

  return { disconnect }
}
