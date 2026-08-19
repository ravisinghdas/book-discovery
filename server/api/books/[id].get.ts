import type { GoogleBookVolume } from '~~/shared/types/book'

/**
 * Proxy route for a single Google Books volume by ID.
 *
 *   GET /api/books/:id
 *
 * Same rationale as the search route — the API key stays on the server.
 */
export default defineEventHandler(async (event): Promise<GoogleBookVolume> => {
  const { googleBooksApiKey } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Volume ID is required'
    })
  }

  try {
    return await $fetch<GoogleBookVolume>(
      `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`,
      {
        params: {
          ...(googleBooksApiKey ? { key: googleBooksApiKey } : {})
        }
      }
    )
  } catch (error) {
    console.error(`[api/books/${id}] Google Books request failed:`, error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch volume details'
    })
  }
})
