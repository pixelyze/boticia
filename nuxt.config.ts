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
    "@nuxtjs/supabase",
    "@nuxt/content",
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: "fr",
      },
      title: "Boticia — Créatrice d'ambiance florale",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          key: "description",
          name: "description",
          content: "Boticia — Atelier de design floral par Laëtitia Schaeffer. Décoration florale de mariage, scénographie événementielle et ateliers d'art floral. Fleurs françaises en circuit court.",
        },
        { name: "author", content: "Boticia — Laëtitia Schaeffer" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Boticia — Créatrice d'ambiance florale",
        },
        {
          property: "og:description",
          content: "Atelier de design floral. Décoration de mariage, scénographie événementielle et ateliers d'art floral. Fleurs françaises en circuit court.",
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
          content: "Boticia — Créatrice d'ambiance florale",
        },
        {
          name: "twitter:description",
          content: "Atelier de design floral. Décoration de mariage, scénographie événementielle et ateliers d'art floral.",
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
      "Playfair Display": [400, 500, 600, 700, 800, 900],
      "Source Sans 3": [300, 400, 500, 600, 700],
    },
    display: "swap",
    preload: true,
  },

  // Global CSS
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  compatibilityDate: "2025-04-12",
  devtools: { enabled: true },

  // Supabase configuration
  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365, // 1 an
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
    clientOptions: {
      auth: {
        flowType: "implicit",
      },
    },
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private (server-side only)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    resendApiKey: process.env.RESEND_API_KEY,
    cronSecret: process.env.CRON_SECRET,
    supabase: {
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },
    // Public (accessible client-side)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://yourdomain.com",
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
});
