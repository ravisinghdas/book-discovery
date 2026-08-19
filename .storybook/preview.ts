import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createPinia } from 'pinia'
import { h } from 'vue'

// Load the app's Tailwind v4 tokens + base styles so components look identical
// in Storybook and in the running app.
import '../app/assets/css/main.css'

/**
 * Bridge the Nuxt runtime pieces our components expect, since Storybook runs
 * plain Vue 3 (no Nuxt):
 *  - Pinia: ShortlistButton reads the shortlist store.
 *  - NuxtLink: stubbed as a plain <a> so cards/links render.
 *  - ClientOnly: stubbed to render its default slot (Nuxt normally defers this
 *    to the client; in Storybook we just render it directly).
 */
setup((app) => {
  app.use(createPinia())
  app.component('NuxtLink', {
    props: { to: { type: [String, Object], default: '#' } },
    setup(props, { slots }) {
      return () => h('a', { href: typeof props.to === 'string' ? props.to : '#' }, slots.default?.())
    },
  })
  app.component('ClientOnly', {
    setup(_, { slots }) {
      return () => slots.default?.()
    },
  })
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#f8f7ff' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#0f0a1e' },
      ],
    },
  },
}

export default preview
