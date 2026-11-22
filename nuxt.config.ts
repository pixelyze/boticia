export default defineNuxtConfig({
  vite: { logLevel: 'warn' }, // calme le verbiage Vite en dev (garde warn + erreurs)
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
      title: "Boticia — Studio de design floral",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          key: "description",
          name: "description",
          content: "Boticia — Studio de design floral par Laëtitia Schaeffer. Décoration florale de mariage, scénographie événementielle et ateliers d'art floral. Fleurs de saison en circuit court.",
        },
        { name: "author", content: "Boticia — Laëtitia Schaeffer" },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "Boticia — Studio de design floral",
        },
        {
          property: "og:description",
          content: "Studio de design floral. Décoration de mariage, scénographie événementielle et ateliers d'art floral. Fleurs de saison en circuit court.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Boticia" },
        {
          property: "og:url",
          content: process.env.NUXT_PUBLIC_SITE_URL || "https://boticia.fr",
        },
        {
          property: "og:image",
          content: `${process.env.NUXT_PUBLIC_SITE_URL || "https://boticia.fr"}/og-image.png`,
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Boticia — Studio de design floral",
        },
        {
          name: "twitter:description",
          content: "Studio de design floral. Décoration de mariage, scénographie événementielle et ateliers d'art floral.",
        },
        {
          name: "twitter:image",
          content: `${process.env.NUXT_PUBLIC_SITE_URL || "https://boticia.fr"}/og-image.png`,
        },
        // Theme colors
        { name: "theme-color", content: "#000000" },
        { name: "msapplication-TileColor", content: "#000000" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
      ],

      script: [
        {
          src: "https://analytics.metaphorestudio.fr/script.js",
          "data-website-id": "8dea2e30-d340-4a71-a0b7-0a7cdc37650c",
          defer: true,
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
      ],
    },
    pageTransition: false,
    layoutTransition: false,
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
        language: "fr-FR",
      },
      {
        code: "en",
        name: "English",
        file: "en.json",
        language: "en-US",
      },
      {
        code: "ja",
        name: "\u65e5\u672c\u8a9e",
        file: "ja.json",
        language: "ja-JP",
      },
    ],
    defaultLocale: "fr",
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://boticia.fr",
    skipSettingLocaleOnNavigate: true,
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
      "Source Serif 4": { wght: [400, 600], ital: [400] },
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
  // Pastille Nuxt DevTools en bas de page : désactivée (inutile ici)
  devtools: { enabled: false },

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
    // Pas de clientOptions.auth.flowType ici : @supabase/ssr force "pkce"
    // dans createBrowserClient, la valeur était donc sans effet. Les liens
    // magiques passent par verifyOtp(), insensible au flux.
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://boticia.fr",
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },

  routeRules: {
    "/**": {
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      },
    },
    "/dashboard/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/admin/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/mon-projet/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/login": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/confirm": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/*/login": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/*/confirm": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    // Connexion admin par mot de passe : ni indexée, ni dans robots.txt
    // (robots.txt est public, il donnerait l'adresse de la page)
    "/connexion-admin": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/*/connexion-admin": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/*/dashboard/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/*/admin/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    // Redirects des anciennes URLs Shopify → homepage (301 pour Google)
    "/blogs/**": { redirect: { to: "/", statusCode: 301 } },
    "/pages/**": { redirect: { to: "/", statusCode: 301 } },
    "/collections/**": { redirect: { to: "/", statusCode: 301 } },
    "/products/**": { redirect: { to: "/", statusCode: 301 } },
    // Coming-soon : noindex (page temporaire, pas à indexer)
    "/coming-soon": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/*/coming-soon": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
  },
});
