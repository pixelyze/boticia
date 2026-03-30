<template>
  <!-- ==========================================
       [PAGE-HOME] — Page d'accueil Boticia
       Layout : homepage | SSR : oui
       Tokens CSS utilisés :
         .hero-title — text-3xl md:text-5xl lg:text-6xl font-medium text-dark
         .section-tagline — text-base md:text-lg uppercase tracking-[0.3em] text-dark/60
         .section-title-lg — text-3xl md:text-[2.5rem] font-medium mt-4 text-dark
         .feature-number — text-base uppercase tracking-[0.2em] text-terracotta
         .feature-title — font-heading text-2xl md:text-4xl text-dark
         .feature-description — text-dark/60 text-lg md:text-xl leading-relaxed
         .step-number — font-heading text-6xl md:text-7xl text-terracotta/20
         .step-title — font-heading text-2xl md:text-3xl text-dark
         .step-description — text-dark/60 text-lg md:text-xl leading-relaxed
         .plan-name — font-heading text-3xl text-dark
         .plan-price — font-heading text-2xl text-dark
       ========================================== -->
  <div>

    <!-- ==========================================
         [SECTION-HERO] — Bannière principale plein écran
         Hauteur : h-screen max-h-[900px] | Background : bg-cream
         Contenu centré : logo + titre H1 + sous-titre italic
         Composant : components/landing/HeroSection.vue
         ========================================== -->
    <!-- [COMP-HERO] — Section hero
         [EL-HERO-LOGO] — Logo Boticia centré | h-36 md:h-64 lg:h-72 | Source : useSiteLogo()
         [EL-HERO-TITLE] — H1 titre principal | .hero-title | i18n : hero.title
         [EL-HERO-SUBTITLE] — Sous-titre italic | font-heading text-base md:text-lg text-terracotta | i18n : hero.subtitle
         Responsive : Logo plus petit mobile, tailles texte adaptatives -->
    <HeroSection />

    <!-- ==========================================
         [SECTION-ALACARTE] — Offre à la carte 3 colonnes
         Padding : py-20 md:py-28 | Background : bg-white
         Composant : components/landing/AlaCarteSection.vue
         ========================================== -->
    <AlaCarteSection />

    <!-- ==========================================
         [SECTION-STORIES] — Grille d'histoires / réalisations
         Padding : py-16 md:py-24 | Background : bg-cream
         Composant : components/landing/StoriesSection.vue
         ========================================== -->
    <!-- [COMP-STORIES] — Section stories
         [EL-STORIES-TAGLINE] — Tagline | .section-tagline | i18n : stories.tagline
         [EL-STORIES-TITLE] — Titre H2 | .section-title-lg | i18n : stories.title
         [EL-STORIES-CARD] — Carte story x6 | rounded-[1.5rem] border-2 border-dark/10 | h-72 md:h-96
           - Image de fond (story_1 uniquement) ou gradient placeholder
           - Overlay dégradé : bg-gradient-to-t from-dark/60 via-transparent to-transparent
           - Label en bas : text-cream text-base font-semibold
           [STATE-STORIES-CARD-HOVER] — Image scale-105 → scale-100, transition 500ms
         Data : 6 stories computed, liens vers pages internes
         Responsive : grid-cols-3 md:grid-cols-6 -->
    <!-- StoriesSection retiré (remplacé par MasonryGallery) — composant conservé -->
    <!-- <StoriesSection /> -->

    <!-- ==========================================
         [SECTION-INTRO] — Bloc d'introduction / philosophie
         Padding : py-20 md:py-28 | Background : bg-white
         Composant : components/landing/IntroSection.vue
         ========================================== -->
    <!-- [COMP-INTRO] — Section intro
         [EL-INTRO-TAGLINE] — Tagline | .section-tagline | i18n : intro.tagline
         [EL-INTRO-TITLE] — Titre H2 | .section-title-lg | i18n : intro.title
         [EL-INTRO-DESC] — Description | .feature-description | max-w-2xl centré | i18n : intro.description
         [EL-INTRO-CTA] — Bouton ghost | Composant Button variant="ghost" rightIcon="MoveRight"
           Lien vers /pricing | i18n : intro.cta -->
    <IntroSection />

    <!-- ==========================================
         [SECTION-MASONRY] — Galerie portfolio masonry
         Composant : components/landing/MasonryGallery.vue
         Data : API /api/galleries/portfolio
         Géré depuis /dashboard/galleries
         ========================================== -->
    <MasonryGallery />

    <!-- ==========================================
         [SECTION-FEATURES] — Fonctionnalités numérotées
         Padding : py-20 md:py-28 | Background : bg-cream
         Composant : components/landing/FeaturesSection.vue
         ========================================== -->
    <!-- [COMP-FEATURES] — Section features
         [EL-FEATURES-TAGLINE] — Tagline | .section-tagline | i18n : features.tagline
         [EL-FEATURES-TITLE] — Titre H2 | .section-title-lg | i18n : features.title
         [EL-FEATURES-ITEM] — Feature x3 | max-w-xl | espacement space-y-16 md:space-y-20
           [EL-FEATURES-NUMBER] — Numéro "01" "02" "03" | .feature-number
           [EL-FEATURES-ITEM-TITLE] — Titre feature | .feature-title
           [EL-FEATURES-ITEM-DESC] — Description | .feature-description
         Data : 3 features computed depuis i18n
         Responsive : max-w-4xl centré -->
    <FeaturesSection />

    <!-- ==========================================
         [SECTION-PROCESS] — Étapes du processus (1-2-3)
         Padding : py-20 md:py-28 | Background : bg-white
         Composant : components/landing/ProcessSection.vue
         ========================================== -->
    <!-- [COMP-PROCESS] — Section process
         [EL-PROCESS-TAGLINE] — Tagline | .section-tagline | i18n : process.tagline
         [EL-PROCESS-TITLE] — Titre H2 | .section-title-lg | i18n : process.title
         [EL-PROCESS-STEP] — Step x3 | text-center | gap-16 md:gap-8
           [EL-PROCESS-NUMBER] — Numéro géant | .step-number (terracotta/20)
           [EL-PROCESS-STEP-TITLE] — Titre step | .step-title
           [EL-PROCESS-STEP-DESC] — Description | .step-description | max-w-xs centré
         Data : 3 steps computed depuis i18n
         Responsive : grid-cols-1 md:grid-cols-3 | max-w-5xl centré -->
    <ProcessSection />

    <!-- ==========================================
         [SECTION-BLOCKQUOTE] — Citation éditoriale avec image
         Background : image + cream (split desktop)
         Composant : components/ui/BlockQuote.vue
         ========================================== -->
    <!-- [COMP-BLOCKQUOTE] — Citation pleine largeur
         Props : quote (string), author (string) | i18n : hero.quote, hero.quote_author
         Mobile : image plein cadre h-[70vh] rounded-[2rem] + overlay gradient + citation en bas
           [EL-QUOTE-TEXT-MOBILE] — font-heading text-2xl italic text-white
           [EL-QUOTE-AUTHOR-MOBILE] — text-cream/70 text-sm tracking-widest uppercase
         Desktop : grid 2 cols min-h-[85vh] rounded-[2rem] border-2 border-dark/10
           [EL-QUOTE-IMAGE] — Image bouquet | object-cover scale-105
             [STATE-QUOTE-IMAGE-HOVER] — scale-100 transition 1.5s ease-out
           [EL-QUOTE-TEXT-DESKTOP] — text-3xl lg:text-4xl xl:text-5xl font-heading italic text-dark/85
           [EL-QUOTE-AUTHOR-DESKTOP] — text-dark/50 text-sm tracking-[0.2em] uppercase -->
    <BlockQuote
      :quote="$t('hero.quote')"
      :author="$t('hero.quote_author')"
    />

    <!-- ==========================================
         [SECTION-FAQ] — Questions fréquentes (accordéon)
         Padding : py-20 md:py-28 | Background : bg-white
         Composant : components/landing/FAQSection.vue
         ========================================== -->
    <!-- [COMP-FAQ] — Section FAQ
         [EL-FAQ-TAGLINE] — Tagline | .section-tagline | i18n : faq.tagline
         [EL-FAQ-TITLE] — Titre H2 | .section-title-lg | i18n : faq.title
         [COMP-FAQ-ACCORDION] — Composant FAQ | max-w-5xl centré
           Props : items (array of { question, answer })
           Data : 4 questions/réponses depuis i18n (faq.q1-q4, faq.a1-a4)
         [SLOT-FAQ-ITEMS] — Contenu dynamique i18n | 4 items min -->
    <FAQSection />

  </div>
</template>

<script setup lang="ts">
// [PAGE-HOME] — Layout : homepage | Head : titre dynamique i18n
definePageMeta({
  layout: 'homepage',
  pageTransition: false,
});

const { t, locale } = useI18n();
const config = useRuntimeConfig();
const route = useRoute();
const siteUrl = config.public.siteUrl;

useSeoMeta({
  ogTitle: `${t("hero.title")} | Boticia Côte d'Azur`,
  ogDescription: t("hero.subtitle"),
  ogUrl: `${config.public.siteUrl}${route.fullPath}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: `${t("hero.title")} | Boticia Côte d'Azur`,
  twitterDescription: t("hero.subtitle"),
});

useHead({
  title: `${t("hero.title")} | Boticia Côte d'Azur`,
  meta: [
    {
      key: 'description',
      name: 'description',
      content: t('seo.home_description'),
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
        name: 'Boticia',
        description: t('footer.description'),
        url: siteUrl,
        image: `${siteUrl}/logo-boticia.png`,
        address: {
          '@type': 'PostalAddress',
          addressRegion: "Côte d'Azur",
          addressCountry: 'FR',
        },
        areaServed: [
          { '@type': 'State', name: "Provence-Alpes-Côte d'Azur" },
          { '@type': 'Country', name: 'France' },
        ],
      }),
    },
  ],
});
</script>
