import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { h } from 'vue'

/**
 * Stories for ShortlistButton visual states.
 *
 * ShortlistButton couples tightly to the Pinia store + pinia-plugin-persistedstate
 * which isn't available in the plain-Vue Storybook environment. Rather than
 * mock the full plugin chain, we render the button's two visual states directly
 * so the UI is documented without pulling in store machinery.
 */

// Inline button — mirrors ShortlistButton's exact markup so the story is
// pixel-accurate without needing the store.
function makeButton(active: boolean) {
  return {
    setup() {
      return () =>
        h(
          'button',
          {
            type: 'button',
            class: [
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold shadow-sm transition',
              active
                ? 'bg-surface-raised text-primary ring-1 ring-primary/30 hover:bg-surface-hover'
                : 'bg-primary text-white hover:bg-primary-strong',
            ].join(' '),
          },
          [
            h(
              'svg',
              {
                viewBox: '0 0 24 24',
                class: 'h-5 w-5',
                fill: active ? 'currentColor' : 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
              },
              [h('path', { d: 'M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z', 'stroke-linejoin': 'round' })],
            ),
            active ? 'Saved to shortlist' : 'Add to shortlist',
          ],
        )
    },
  }
}

const meta: Meta = {
  title: 'Book/ShortlistButton',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/** Not yet saved — primary violet button. */
export const Default: Story = {
  render: () => makeButton(false),
}

/** Already saved — subtle outline button. */
export const Saved: Story = {
  render: () => makeButton(true),
}
