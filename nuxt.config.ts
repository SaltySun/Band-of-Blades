// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;700&family=ZCOOL+XiaoWei&family=JetBrains+Mono:wght@400;500&display=swap' },
      ],
    },
  },
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
