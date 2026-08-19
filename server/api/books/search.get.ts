import type { GoogleBooksResponse } from '~~/shared/types/book'

/**
 * GET /api/books/search?q=...&startIndex=...&maxResults=...
 *
 * Proxies the Google Books search endpoint. The API key is read from server
 * runtime config and appended here, so it never reaches the browser.
 */
export default defineEventHandler(async (event): Promise<GoogleBooksResponse> => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  const q = String(query.q ?? '').trim()
  const startIndex = Number.parseInt(String(query.startIndex ?? '0'), 10) || 0
  const requestedMax = Number.parseInt(String(query.maxResults ?? '20'), 10) || 20
  // Google caps maxResults at 40.
  const maxResults = Math.min(Math.max(requestedMax, 1), 40)

  if (!q) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "q" is required.',
    })
  }

  if (!config.googleBooksApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server is missing the Google Books API key.',
    })
  }

  try {
    return await $fetch<GoogleBooksResponse>(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q,
          startIndex,
          maxResults,
          printType: 'books',
          key: config.googleBooksApiKey,
        },
      },
    )
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch results from the Google Books API.',
    })
  }
})
