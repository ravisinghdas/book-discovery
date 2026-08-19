import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SearchInput from './SearchInput.vue'

/**
 * Stories for SearchInput — the pill search field. The clear button appears
 * once there is text; the spinner shows while `loading` is true.
 */
const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="max-width: 640px"><story /></div>' })],
  args: {
    placeholder: 'Search by title, author, or genre…',
    loading: false,
  },
}

export default meta
type Story = StoryObj<typeof SearchInput>

/** Empty — placeholder visible, no clear button. */
export const Empty: Story = {}

/** Pre-filled — shows the clear (×) button. */
export const WithText: Story = {
  args: { modelValue: 'Tolkien' },
}

/** Loading — shows the spinner. */
export const Loading: Story = {
  args: { modelValue: 'Tolkien', loading: true },
}
