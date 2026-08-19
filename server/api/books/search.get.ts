import type { GoogleBooksResponse } from '~~/shared/types/book'

/**
 * Proxy route for Google Books search.
 *
 * The API key is read from server-side runtimeConfig and appended here, so it
 * never reaches the browser. The client only ever talks to `/api/books/search`.
 *
 *   GET /api/books/search?q=harry+potter&startIndex=0&maxResults=20
 */
export default defineEventHandler(async (event): Promise<GoogleBooksResponse> => {
  const { googleBooksApiKey } = useRuntimeConfig()
  const { q, startIndex = '0', maxResults = '20' } = getQuery(event)

  // A blank query would make Google return a 400 — fail fast with a clear message.
  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "q" is required'
    })
  }

  try {
    return await $fetch<GoogleBooksResponse>('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q,
        startIndex,
        maxResults,
        // `printType=books` filters out magazines; `projection=lite` trims payload.
        printType: 'books',
        ...(googleBooksApiKey ? { key: googleBooksApiKey } : {})
      }
    })
  } catch (error) {
    // Log the real error server-side; return a generic message to the client.
    console.error('[api/books/search] Google Books request failed:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch from Google Books API'
    })
  }
})
