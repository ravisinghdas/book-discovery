import type { GoogleBookVolume } from '~~/shared/types/book'

/**
 * GET /api/books/:id
 *
 * Proxies the Google Books "single volume" endpoint. As with search, the API
 * key is injected server-side only.
 */
export default defineEventHandler(async (event): Promise<GoogleBookVolume> => {
  const config = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A volume id is required.',
    })
  }

  if (!config.googleBooksApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server is missing the Google Books API key.',
    })
  }

  try {
    return await $fetch<GoogleBookVolume>(
      `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`,
      {
        params: { key: config.googleBooksApiKey },
      },
    )
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch this book from the Google Books API.',
    })
  }
})
