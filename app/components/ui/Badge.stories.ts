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

export const Primary: Story = {
  args: { label: 'Bestseller', variant: 'primary' }
}

export const Accent: Story = {
  args: { label: 'New', variant: 'accent' }
}

/** Several badges together — as they appear in a book's category list. */
export const CategoryList: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
        <Badge label="Business &amp; Economics" />
        <Badge label="Technology" variant="primary" />
        <Badge label="Self-Help" variant="accent" />
        <Badge label="Science" />
        <Badge label="Juvenile Fiction" variant="primary" />
      </div>
    `
  })
}
