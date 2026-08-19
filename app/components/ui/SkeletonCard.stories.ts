import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SkeletonCard from './SkeletonCard.vue'

/**
 * Stories for SkeletonCard — the loading placeholder shown while search
 * results are in flight. It mirrors BookCard's proportions so the grid doesn't
 * shift when real data arrives.
 */
const meta: Meta<typeof SkeletonCard> = {
  title: 'UI/SkeletonCard',
  component: SkeletonCard,
  tags: ['autodocs'],
  decorators: [
    () => ({ template: '<div style="max-width: 220px"><story /></div>' })
  ]
}

export default meta
type Story = StoryObj<typeof SkeletonCard>

/** Single pulsing placeholder card. */
export const Default: Story = {}

/** A row of skeletons, as they appear together in the loading grid. */
export const Grid: Story = {
  decorators: [
    () => ({
      template:
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;max-width:900px"><story /><story /><story /><story /></div>'
    })
  ]
}
