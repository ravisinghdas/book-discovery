import type {
  BookDetails,
  BookSummary,
  GoogleBookVolume,
  ImageLinks,
} from '~~/shared/types/book'

/**
 * Google Books occasionally returns cover URLs over plain HTTP, which get
 * blocked as mixed content on an HTTPS site. Force HTTPS so covers always load.
 */
function secureImageUrl(url?: string | null): string | null {
  if (!url) return null
  return url.replace(/^http:\/\//i, 'https://')
}

/** publishedDate comes in as "2005", "2005-11" or "2005-11-15" — grab the year. */
function extractYear(date?: string | null): string | null {
  if (!date) return null
  const match = date.match(/\d{4}/)
  return match ? match[0] : null
}

/** Human-friendly author line with a graceful fallback. */
export function formatAuthors(authors?: string[] | null): string {
  if (!authors || authors.length === 0) return 'Unknown author'
  if (authors.length <= 2) return authors.join(', ')
  return `${authors[0]}, ${authors[1]} +${authors.length - 2} more`
}

/** Pick the smallest reasonable cover for cards/lists. */
function pickThumbnail(links?: ImageLinks): string | null {
  if (!links) return null
  return secureImageUrl(links.thumbnail ?? links.smallThumbnail ?? null)
}

/** Pick the largest reasonable cover for the detail hero. */
function pickCover(links?: ImageLinks): string | null {
  if (!links) return null
  const url =
    links.extraLarge ??
    links.large ??
    links.medium ??
    links.small ??
    links.thumbnail ??
    links.smallThumbnail ??
    null
  const secure = secureImageUrl(url)
  if (!secure) return null
  // Google Books CDN URLs accept a `zoom` param that controls image size.
  // Bumping it to 5 gets a full-cover-sized image regardless of which size
  // field the API happened to populate.
  return secure.replace(/([?&]zoom=)\d+/, '$15')
}

/** Normalize a raw volume into the compact shape used by cards + shortlist. */
export function toBookSummary(volume: GoogleBookVolume): BookSummary {
  const info = volume.volumeInfo ?? {}
  return {
    id: volume.id,
    title: info.title?.trim() || 'Untitled',
    authors: info.authors ?? [],
    thumbnail: pickThumbnail(info.imageLinks),
    publishedYear: extractYear(info.publishedDate),
  }
}

/** Normalize a raw volume into the richer shape used by the detail page. */
export function toBookDetails(volume: GoogleBookVolume): BookDetails {
  const info = volume.volumeInfo ?? {}
  return {
    ...toBookSummary(volume),
    subtitle: info.subtitle?.trim() || null,
    description: info.description?.trim() || null,
    publisher: info.publisher?.trim() || null,
    pageCount: typeof info.pageCount === 'number' ? info.pageCount : null,
    categories: info.categories ?? [],
    cover: pickCover(info.imageLinks),
    averageRating:
      typeof info.averageRating === 'number' ? info.averageRating : null,
    ratingsCount:
      typeof info.ratingsCount === 'number' ? info.ratingsCount : null,
  }
}
