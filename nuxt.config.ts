export default defineNuxtConfig({
  // Auto-import des composants sans préfixe de dossier
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "nuxt-lucide-icons",
    "@vueuse/nuxt",
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: "fr",
      },
      title: "My App",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          key: "description",
          name: "description",
          content: "My App - A modern SaaS application.",
        },
        { name: "author", content: "My App" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "My App",
        },
        {
          property: "og:description",
          content: "My App - A modern SaaS application.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://yourdomain.com" },
        {
          property: "og:image",
          content: "https://yourdomain.com/og-image.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "My App",
        },
        {
          name: "twitter:description",
          content: "My App - A modern SaaS application.",
        },
        {
          name: "twitter:image",
          content: "https://yourdomain.com/og-image.png",
        },
        // Theme colors
        { name: "theme-color", content: "#000000" },
        { name: "msapplication-TileColor", content: "#000000" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
      ],

      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "icon", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "canonical", href: "https://yourdomain.com" },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },

  i18n: {
    lazy: true,
    langDir: "locales",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: "fr",
    },
    locales: [
      {
        code: "fr",
        name: "Fran\u00e7ais",
        file: "fr.json",
        iso: "fr-FR",
      },
      {
        code: "en",
        name: "English",
        file: "en.json",
        iso: "en-US",
      },
      {
        code: "ja",
        name: "\u65e5\u672c\u8a9e",
        file: "ja.json",
        iso: "ja-JP",
      },
    ],
    defaultLocale: "fr",
    baseUrl: "https://yourdomain.com",
    skipSettingLocaleOnNavigate: false,
    compilation: {
      strictMessage: true,
      escapeHtml: true,
    },
  },

  // Google Fonts
  googleFonts: {
    families: {
      "Space Grotesk": [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: "swap",
    preload: true,
  },

  // Global CSS
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2025-04-12",
  devtools: { enabled: true },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private (server-side only)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    resendApiKey: process.env.RESEND_API_KEY,
    cronSecret: process.env.CRON_SECRET,
    // Public (accessible client-side)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://yourdomain.com",
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
});
