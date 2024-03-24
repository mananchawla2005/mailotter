// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon", "@vueuse/nuxt"],
  css: ['~/assets/css/main.css'],
  nitro: {
    runtimeConfig: {
      "dbConnectionString": process.env.CONNECTION_STRING,
      "googleClientId": process.env.GOOGLE_CLIENT_ID,
      "googleClientSecret": process.env.GOOGLE_CLIENT_SECRET,
      "googleRedirectURI": process.env.GOOGLE_REDIRECT_URI
    }
  },
  build: {
    transpile: ['imapflow', 'encoding-japanese', 'iconv-lite', 'libbase64', 'libmime', 'libqp', 'mailsplit', 'nodemailer', 'pino', 'socks']
  }
})