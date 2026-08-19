import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BookGrid from './BookGrid.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'

/**
 * Stories for BookGrid — the responsive grid container.
 * Uses SkeletonCard as slot content since it has no external dependencies,
 * making it easy to verify the column layout at each breakpoint.
 */
const meta: Meta<typeof BookGrid> = {
  title: 'Book/BookGrid',
  component: BookGrid,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookGrid>

/** 10 skeleton cards — the typical initial loading state. */
export const WithSkeletons: Story = {
  render: () => ({
    components: { BookGrid, SkeletonCard },
    template: `
      <BookGrid>
        <SkeletonCard v-for="n in 10" :key="n" />
      </BookGrid>
    `
  })
}
