/**
 * Type definitions for the Google Books API and our internal book models.
 *
 * These live in `shared/` so they can be imported from both the Nuxt server
 * routes (`server/api/**`) and the client-side app code without duplication.
 *
 * Every field that the Google Books API can omit is marked optional here —
 * the API is notoriously inconsistent, so the rest of the app treats missing
 * data as the norm rather than the exception.
 */

/** Top-level shape returned by the `volumes` search endpoint. */
export interface GoogleBooksResponse {
  kind: string
  /** Google's own estimate — known to be inaccurate, treat as a hint only. */
  totalItems: number
  /** Can be `undefined` even when `totalItems > 0` (documented API quirk). */
  items?: GoogleBookVolume[]
}

/** A single volume (book) entry. */
export interface GoogleBookVolume {
  id: string
  volumeInfo: VolumeInfo
}

/** The descriptive metadata for a volume. Most fields are optional. */
export interface VolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  pageCount?: number
  categories?: string[]
  imageLinks?: ImageLinks
  averageRating?: number
  ratingsCount?: number
  language?: string
  previewLink?: string
  infoLink?: string
}

/** Cover art in various sizes. All optional; URLs may be insecure `http://`. */
export interface ImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

/**
 * The trimmed-down book model we persist in the shortlist store.
 * We store only what the shortlist UI needs so localStorage stays small and
 * we never depend on re-fetching a volume to render a saved card.
 */
export interface ShortlistedBook {
  id: string
  title: string
  authors: string[]
  thumbnail: string | null
  publishedYear: string | null
}
