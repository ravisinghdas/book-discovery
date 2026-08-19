import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

/**
 * Standalone Storybook config (Vue 3 + Vite).
 *
 * Deliberately NOT using any Nuxt-specific Storybook integration — per the
 * brief, we run Storybook as a plain Vue 3 + Vite workshop. Nuxt's auto-imports
 * (ref, computed, etc.) don't exist here, so stories import from 'vue' and we
 * alias the '~~' / '~' paths Storybook needs to resolve our component imports.
 */
const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.@(ts|js)'],

  addons: ['@storybook/addon-docs'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },

  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins ?? []

    // Storybook 10's vue3-vite framework doesn't register @vitejs/plugin-vue
    // under Vite 8 (Rolldown), so .vue files reach the JS parser untransformed.
    // Adding it explicitly fixes SFC handling. `unshift` ensures it runs first.
    viteConfig.plugins.unshift(vue())

    // Reuse the same Tailwind v4 pipeline as the app so tokens/classes match.
    viteConfig.plugins.push(tailwindcss())

    // Mirror Nuxt's path aliases so component imports resolve in Storybook.
    viteConfig.resolve = viteConfig.resolve ?? {}
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      '~': fileURLToPath(new URL('../app', import.meta.url)),
      '~~': fileURLToPath(new URL('..', import.meta.url)),
      '@': fileURLToPath(new URL('../app', import.meta.url))
    }

    return viteConfig
  }
}

export default config
