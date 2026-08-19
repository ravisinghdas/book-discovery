import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SearchInput from './SearchInput.vue'

/**
 * Stories for SearchInput — the pill search field. The clear button only
 * appears once there's text, so the "WithText" story pre-fills the model.
 */
const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  decorators: [
    () => ({ template: '<div style="max-width: 640px"><story /></div>' })
  ],
  args: {
    placeholder: 'Search by title, author, or genre...'
  }
}

export default meta
type Story = StoryObj<typeof SearchInput>

/** Empty state — placeholder visible, no clear button. */
export const Empty: Story = {}

/** Pre-filled — shows the clear (×) button. */
export const WithText: Story = {
  args: {
    modelValue: 'Tolkien'
  }
}
