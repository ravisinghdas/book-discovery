import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './Badge.vue'

/**
 * Stories for Badge — the small pill used for book categories and metadata.
 */
const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'accent']
    }
  },
  args: {
    label: 'Fiction',
    variant: 'neutral'
  }
}

export default meta
type Story = StoryObj<typeof Badge>

export const Neutral: Story = {}
export const Primary: Story = { args: { label: 'Bestseller', variant: 'primary' } }
export const Accent: Story = { args: { label: 'New', variant: 'accent' } }

/** Several badges together, e.g. a category list on the detail page. */
export const CategoryList: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
        <Badge label="Business & Economics" />
        <Badge label="Technology" variant="primary" />
        <Badge label="Self-Help" variant="accent" />
      </div>
    `
  })
}
