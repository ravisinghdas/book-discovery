import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BookCard from './BookCard.vue'
import type { GoogleBookVolume } from '~~/shared/types/book'

/**
 * Stories for BookCard — the result tile used across the search and shortlist
 * grids. These exercise the "missing data" paths that the Google Books API
 * throws at us in production (no cover, no author, overflowing titles).
 */

// A fully-populated volume used as the happy-path baseline.
const completeBook: GoogleBookVolume = {
  id: 'complete-1',
  volumeInfo: {
    title: 'The Pragmatic Programmer',
    authors: ['Andrew Hunt', 'David Thomas'],
    publishedDate: '1999-10-30',
    imageLinks: {
      thumbnail:
        'https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&source=gbs_api'
    }
  }
}

const meta: Meta<typeof BookCard> = {
  title: 'UI/BookCard',
  component: BookCard,
  tags: ['autodocs'],
  // Constrain width so the card renders at a realistic grid size.
  decorators: [
    () => ({ template: '<div style="max-width: 220px"><story /></div>' })
  ],
  args: {
    book: completeBook
  }
}

export default meta
type Story = StoryObj<typeof BookCard>

/** All data present: cover, title, authors, year. */
export const Default: Story = {}

/** No cover art — falls back to the titled placeholder. */
export const WithoutCover: Story = {
  args: {
    book: {
      id: 'no-cover-1',
      volumeInfo: {
        title: 'A Book With No Cover Available',
        authors: ['Jane Doe'],
        publishedDate: '2018'
      }
    }
  }
}

/** No listed author — shows the "Unknown Author" fallback. */
export const WithoutAuthor: Story = {
  args: {
    book: {
      id: 'no-author-1',
      volumeInfo: {
        title: 'An Anonymous Work',
        publishedDate: '2012-05',
        imageLinks: { thumbnail: completeBook.volumeInfo.imageLinks?.thumbnail }
      }
    }
  }
}

/** Very long title — verifies the 2-line clamp. */
export const LongTitle: Story = {
  args: {
    book: {
      id: 'long-title-1',
      volumeInfo: {
        title:
          'A Remarkably and Unnecessarily Long Book Title That Keeps Going On and On to Test Line Clamping Behaviour',
        authors: ['Verbose Author With A Long Name Too'],
        publishedDate: '2021-01-15',
        imageLinks: { thumbnail: completeBook.volumeInfo.imageLinks?.thumbnail }
      }
    }
  }
}

/** No metadata at all beyond a title — worst-case sparse record. */
export const MinimalData: Story = {
  args: {
    book: {
      id: 'minimal-1',
      volumeInfo: {
        title: 'Bare Minimum'
      }
    }
  }
}
