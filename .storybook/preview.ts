import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createPinia } from 'pinia'
import { h } from 'vue'

// Load the app's Tailwind v4 tokens + base styles so components look identical
// in Storybook and in the running app.
import '../app/assets/css/main.css'

/**
 * Bridge the Nuxt runtime pieces our components expect:
 *  - Pinia: ShortlistButton reads the shortlist store. (The `persist` option is
 *    a no-op here since the Nuxt persistence module isn't loaded — that's fine
 *    for isolated component rendering.)
 *  - NuxtLink: stubbed as a plain <a> so cards/links render without the router.
 */
setup((app) => {
  app.use(createPinia())
  app.component('NuxtLink', {
    props: { to: { type: [String, Object], default: '#' } },
    setup(props, { slots }) {
      return () => h('a', { href: typeof props.to === 'string' ? props.to : '#' }, slots.default?.())
    }
  })
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page', value: '#F5F6FD' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'dark', value: '#0F172A' }
      ]
    }
  }
}

export default preview
