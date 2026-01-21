// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n', '@vite-pwa/nuxt'],

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    geminiApiKey: ''
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' }
    ],
    defaultLocale: 'en',
  },

  pwa: {
    manifest: {
      name: 'ATS Scanner',
      short_name: 'ATS Scanner',
      description: 'AI-powered ATS scanner that helps you to scan and improve your resume to maximize your chances of getting hired.',
      theme_color: '#679390',
      background_color: '#0E182C',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait',
      icons: [
        {
          src: '/favicon.svg',
          sizes: '512x512',
          type: 'image/svg'
        }
      ]
    },
  }
})
