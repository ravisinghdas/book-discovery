import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SkeletonDetail from './SkeletonDetail.vue'

/**
 * Stories for SkeletonDetail — the full-page loading placeholder shown on the
 * book detail route while the volume is being fetched.
 */
const meta: Meta<typeof SkeletonDetail> = {
  title: 'UI/SkeletonDetail',
  component: SkeletonDetail,
  tags: ['autodocs'],
  decorators: [
    () => ({ template: '<div style="max-width: 1024px; padding: 1rem"><story /></div>' })
  ]
}

export default meta
type Story = StoryObj<typeof SkeletonDetail>

export const Default: Story = {}
