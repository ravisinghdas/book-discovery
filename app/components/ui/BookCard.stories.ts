import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BookCard from './BookCard.vue'
import type { BookSummary } from '~~/shared/types/book'

/**
 * Stories for BookCard — the presentational result tile. These exercise the
 * "missing data" paths the Google Books API produces (no cover, no author,
 * overflowing titles) plus the shortlisted state.
 */
const baseBook: BookSummary = {
  id: 'pd6-tAEACAAJ',
  title: 'The Pragmatic Programmer',
  authors: ['Andrew Hunt', 'David Thomas'],
  thumbnail:
    'https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
  publishedYear: '1999',
}

const meta = {
  title: 'UI/BookCard',
  component: BookCard,
  tags: ['autodocs'],
  argTypes: {
    toggle: { action: 'toggle' },
  },
  // Constrain width so the 2/3 aspect card looks realistic in the canvas.
  decorators: [() => ({ template: '<div style="width:220px"><story /></div>' })],
  args: { book: baseBook, shortlisted: false },
} satisfies Meta<typeof BookCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Shortlisted: Story = {
  args: { book: baseBook, shortlisted: true },
}

export const NoCover: Story = {
  args: { book: { ...baseBook, thumbnail: null } },
}

export const NoAuthor: Story = {
  args: { book: { ...baseBook, authors: [] } },
}

export const LongTitle: Story = {
  args: {
    book: {
      ...baseBook,
      title:
        'A Remarkably Long Book Title That Keeps Going And Should Truncate Gracefully After Two Lines Without Breaking The Card Layout',
    },
  },
}

export const NoYear: Story = {
  args: { book: { ...baseBook, publishedYear: null } },
}
