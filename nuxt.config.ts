import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/google-fonts'
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  // Pinia stores live at the project root per the blueprint structure.
  pinia: {
    storesDirs: ['./stores/**']
  },

  googleFonts: {
    families: { Inter: [300, 400, 500, 600, 700, 800] },
    display: 'swap',
    preload: true
  },

  // Server-only secret. Populated at runtime from NUXT_GOOGLE_BOOKS_API_KEY.
  // Never exposed to the client — used exclusively inside server/api routes.
  runtimeConfig: {
    googleBooksApiKey: ''
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Book Discovery',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Search millions of books and save the ones that matter to your personal shortlist.'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
