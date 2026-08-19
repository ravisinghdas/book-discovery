import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BookDetail from './BookDetail.vue'
import type { BookDetails } from '~~/shared/types/book'

/**
 * Stories for BookDetail — the normalized detail view. Covers the happy path
 * plus the sparse-data cases: missing cover, missing description, no rating.
 */
const longDescription =
  '<p>The definitive account of one of the most remarkable companies of our time. ' +
  'Drawing on unprecedented access, it traces the journey from a Stanford dorm room to a ' +
  'global powerhouse that reshaped how the world finds information.</p>' +
  '<p>Along the way it explores the founders\u2019 principles, the culture they built, and the ' +
  'tension between rapid growth and staying true to a mission.</p>'

const completeBook: BookDetails = {
  id: 'story-complete',
  title: 'The Google Story',
  subtitle: 'Inside the Hottest Business, Media, and Technology Success of Our Time',
  authors: ['David A. Vise', 'Mark Malseed'],
  thumbnail: 'https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
  cover: 'https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=3&source=gbs_api',
  publishedYear: '2005',
  publishedDate: '2005-11-15',
  publisher: 'Random House Digital, Inc.',
  description: longDescription,
  pageCount: 207,
  categories: ['Business & Economics', 'Technology'],
  averageRating: 3.5,
  ratingsCount: 136,
  language: 'en',
}

const meta = {
  title: 'Book/BookDetail',
  component: BookDetail,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="max-width: 1024px; padding: 1rem"><story /></div>' })],
  args: { book: completeBook },
} satisfies Meta<typeof BookDetail>

export default meta
type Story = StoryObj<typeof meta>

/** All fields present: cover, rating, meta, categories, rich description. */
export const Default: Story = {}

/** No cover art — falls back to the placeholder image. */
export const WithoutCover: Story = {
  args: { book: { ...completeBook, cover: null } },
}

/** No description — shows the "no description available" note. */
export const WithoutDescription: Story = {
  args: { book: { ...completeBook, description: null } },
}

/** Sparse record: only a title, no authors, no rating, no categories. */
export const MinimalData: Story = {
  args: {
    book: {
      id: 'story-minimal',
      title: 'Bare Minimum Volume',
      authors: [],
      thumbnail: null,
      cover: null,
      publishedYear: null,
      publishedDate: null,
      subtitle: null,
      publisher: null,
      description: null,
      pageCount: null,
      categories: [],
      averageRating: null,
      ratingsCount: null,
      language: null,
    },
  },
}
