import type { ImageLinks, VolumeInfo, GoogleBookVolume, ShortlistedBook } from '~~/shared/types/book'

/**
 * Small, pure formatting helpers that centralise how we cope with the
 * Google Books API's inconsistent data. Keeping them here (rather than inline
 * in components) means the fallback rules live in one place and are easy to test.
 */

/** Fallback text shown when a book has no listed author. */
export const UNKNOWN_AUTHOR = 'Unknown Author'

/**
 * Join an authors array into a readable string.
 * Returns a sensible fallback when the array is missing or empty.
 */
export function formatAuthors(authors?: string[]): string {
  if (!authors || authors.length === 0) return UNKNOWN_AUTHOR
  return authors.join(', ')
}

/**
 * Extract just the year from Google's variable date formats:
 * "2005", "2005-11", "2005-11-15" all yield "2005".
 * Returns null when there's nothing usable.
 */
export function formatPublishedYear(publishedDate?: string): string | null {
  if (!publishedDate) return null
  const match = publishedDate.match(/^\d{4}/)
  return match ? match[0] : null
}

/**
 * Google sometimes serves cover URLs over insecure http:// which get blocked
 * as mixed content on an https:// site. Force https and return null if absent.
 */
export function secureImageUrl(url?: string): string | null {
  if (!url) return null
  return url.replace(/^http:\/\//i, 'https://')
}

/**
 * Pick the best available thumbnail for a card-sized cover.
 * Falls through the sizes Google may or may not provide.
 */
export function getThumbnail(imageLinks?: ImageLinks): string | null {
  if (!imageLinks) return null
  return secureImageUrl(imageLinks.thumbnail ?? imageLinks.smallThumbnail)
}

/**
 * Pick the best available large cover for the detail page.
 */
export function getCover(imageLinks?: ImageLinks): string | null {
  if (!imageLinks) return null
  return secureImageUrl(
    imageLinks.extraLarge ??
      imageLinks.large ??
      imageLinks.medium ??
      imageLinks.small ??
      imageLinks.thumbnail ??
      imageLinks.smallThumbnail
  )
}

/**
 * Strip HTML tags/entities from a description so it can be rendered as plain
 * text safely (Google descriptions can contain markup). For rich rendering the
 * detail page decides separately how much to trust it.
 */
export function stripHtml(html?: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Map a full Google volume down to the compact shape we persist in the
 * shortlist store. Done once, at save time, so saved cards never depend on the
 * API being reachable again.
 */
export function toShortlistedBook(volume: GoogleBookVolume): ShortlistedBook {
  const info: VolumeInfo = volume.volumeInfo
  return {
    id: volume.id,
    title: info.title ?? 'Untitled',
    authors: info.authors ?? [],
    thumbnail: getThumbnail(info.imageLinks),
    publishedYear: formatPublishedYear(info.publishedDate)
  }
}
