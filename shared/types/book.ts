/**
 * Types for the Google Books API and the app's normalized book shapes.
 *
 * The raw API responses are intentionally loose: almost every field on
 * `volumeInfo` is optional. See the docs for the caveats:
 * https://developers.google.com/books/docs/v1/using
 *
 * We normalize the raw volumes into `BookSummary` / `BookDetails` at the edge
 * (see `app/utils/formatters.ts`) so the rest of the app works with predictable,
 * fully-typed data instead of scattering optional-chaining everywhere.
 */

/** Cover image variants returned by the API (any of them may be missing). */
export interface ImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

/** The `volumeInfo` object on a raw Google Books volume. */
export interface VolumeInfo {
  title?: string
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
}

/** A single raw volume as returned by the API. */
export interface GoogleBookVolume {
  id: string
  volumeInfo?: VolumeInfo
}

/** The raw search response. `items` can be missing even when totalItems > 0. */
export interface GoogleBooksResponse {
  kind: string
  totalItems: number
  items?: GoogleBookVolume[]
}

/**
 * Normalized shape used across search results, cards and the shortlist.
 * Everything is guaranteed present (with sensible fallbacks) except the
 * thumbnail/year which are explicitly nullable so the UI can branch on them.
 */
export interface BookSummary {
  id: string
  title: string
  authors: string[]
  thumbnail: string | null
  publishedYear: string | null
}

/** Normalized shape for the detail page. Extends the summary. */
export interface BookDetails extends BookSummary {
  subtitle: string | null
  description: string | null
  publisher: string | null
  publishedDate: string | null
  pageCount: number | null
  categories: string[]
  cover: string | null
  averageRating: number | null
  ratingsCount: number | null
  language: string | null
}
