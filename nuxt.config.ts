// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  components: [
    {
      path: '~/components/wiki',
      pathPrefix: false,
    },
    {
      path: '~/components',
      pathPrefix: true,
    },
  ],
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    dbUrl: process.env.NUXT_DB_URL || 'file:./data/campaign.db',
    gmTokenSecret: process.env.NUXT_GM_TOKEN_SECRET || 'dev-secret-change-in-production'
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
