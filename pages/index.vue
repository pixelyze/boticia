<template>
  <!-- ==========================================
       [PAGE-HOME] — Page d'accueil Boticia, design « gravure et encre »
       Layout : editorial (cadre fin, palette en variables CSS --ed-*)
       Gravures : Pierre-Joseph Redouté, domaine public
         (public/images/redoute/)
       Textes : i18n editorial.*
       ========================================== -->
  <div>
    <EditorialHero />
    <EditorialStudio />
    <EditorialWeddings />
    <EditorialServices />
    <EditorialSeason />
    <EditorialCreations />
    <EditorialTestimonials />
    <EditorialClosing />
  </div>
</template>

<script setup lang="ts">
// [PAGE-HOME] — Layout : homepage | Head : titre dynamique i18n
definePageMeta({
  layout: 'editorial',
  pageTransition: false,
  layoutTransition: false,
});

const { t, locale } = useI18n();
const config = useRuntimeConfig();
const route = useRoute();
const siteUrl = config.public.siteUrl;

useSeoMeta({
  ogTitle: "Boticia — Floral designer | Provence · Paris",
  ogDescription: t("hero.subtitle"),
  ogUrl: `${config.public.siteUrl}${route.path}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: "Boticia — Floral designer | Provence · Paris",
  twitterDescription: t("hero.subtitle"),
});

useHead({
  title: "Boticia — Floral designer | Provence · Paris",
  meta: [
    {
      key: 'description',
      name: 'description',
      content: t('seo.home_description'),
    },
  ],
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/redoute/rosier-de-provins.webp',
      fetchpriority: 'high',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Boticia',
        url: siteUrl,
        logo: `${siteUrl}/logo-boticia.png`,
        sameAs: [
          'https://instagram.com/boticia_',
          'https://www.linkedin.com/in/la%C3%ABtitia-schaeffer-cr%C3%A9atrice-florale/',
          'https://www.facebook.com/BoticiaParis/',
          'https://fr.pinterest.com/Boticia_Paris/',
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Florist',
        '@id': `${siteUrl}/#florist`,
        name: 'Boticia',
        alternateName: 'Boticia — Laëtitia Schaeffer',
        description: t('footer.description'),
        url: siteUrl,
        image: `${siteUrl}/logo-boticia.png`,
        logo: `${siteUrl}/logo-boticia.png`,
        priceRange: '€€-€€€',
        currenciesAccepted: 'EUR',
        paymentAccepted: 'Cash, Credit Card, Bank Transfer',
        address: {
          '@type': 'PostalAddress',
          addressRegion: "Provence-Alpes-Côte d'Azur",
          addressCountry: 'FR',
        },
        areaServed: [
          { '@type': 'State', name: "Provence-Alpes-Côte d'Azur" },
          { '@type': 'Country', name: 'France' },
        ],
        founder: {
          '@type': 'Person',
          name: 'Laëtitia Schaeffer',
        },
        sameAs: [
          'https://instagram.com/boticia_',
          'https://www.linkedin.com/in/la%C3%ABtitia-schaeffer-cr%C3%A9atrice-florale/',
          'https://www.facebook.com/BoticiaParis/',
          'https://fr.pinterest.com/Boticia_Paris/',
        ],
        makesOffer: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Décoration florale de mariage',
              url: `${siteUrl}/fr/mariages`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Scénographie florale événementielle',
              url: `${siteUrl}/fr/evenements`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: "Ateliers d'art floral",
              url: `${siteUrl}/fr/ateliers`,
            },
          },
        ],
      }),
    },
  ],
});
</script>
