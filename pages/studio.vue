<template>
  <!-- [PAGE-STUDIO] — « Le studio » (ancienne page « Qui suis-je ? »,
       /about redirigé vers /studio). Même rythme que Mariages et
       Entreprises : sections pleine largeur aux fonds alternés, titre à
       gauche et contenu à droite, appel final centré. -->
  <div>
    <!-- [EL-STUDIO-HERO] — Présentation + photo en arche -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-center
                 md:grid-cols-[3fr_2fr] md:gap-20"
        >
          <div>
            <span class="section-tagline">{{ t('about.tagline') }}</span>
            <h1 class="section-title-lg">{{ t('about.title') }}</h1>
            <p class="para-lead mt-6">{{ t('about.intro') }}</p>
            <p class="para mt-4">{{ t('about.approach') }}</p>
            <Button variant="cta" :to="localePath('devis')" class="mt-8">
              {{ t('nav.quote') }}
            </Button>
          </div>

          <!-- Laëtitia, en arche -->
          <div
            class="relative mx-auto w-full max-w-sm md:max-w-none aspect-[3/4]
                   overflow-hidden rounded-t-full"
          >
            <img
              src="/images/about/laetitia-schaeffer-boticia.webp"
              :alt="t('about.photo_alt')"
              width="1200"
              height="1600"
              class="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- [EL-STUDIO-VALUES] — « Boticia, c'est » : même modèle que « Notre
         savoir-faire » (surtitre, titre et phrase à gauche ; engagements
         titrés entre filets à droite) -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
                 md:grid-cols-[2fr_3fr] md:gap-20"
        >
          <div>
            <span class="section-tagline">{{ t('about.values_tagline') }}</span>
            <h2 class="section-title-lg">{{ t('about.values_title') }}</h2>
            <p class="para mt-6">{{ t('about.values_intro') }}</p>
          </div>
          <ul class="border-t border-dark/20">
            <li
              v-for="value in values"
              :key="value.key"
              class="flex items-start gap-5 py-8 border-b border-dark/20"
            >
              <IconPhosphor :name="value.icon" size="md" class="text-dark mt-1" />
              <div>
                <h3 class="item-heading mb-2">{{ t(`${value.key}_title`) }}</h3>
                <p class="para">{{ t(value.key) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- [EL-STUDIO-MAP] — Où nous trouver : texte + carte fixe dessinée -->
    <section
      aria-labelledby="studio-map-title"
      class="py-16 md:py-24 bg-cream-light"
    >
      <div class="container mx-auto px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 gap-10 items-center
                 md:grid-cols-[2fr_3fr] md:gap-20"
        >
          <div>
            <span class="section-tagline">{{ t('about.map_tagline') }}</span>
            <h2 id="studio-map-title" class="section-title-lg">
              {{ t('about.map_title') }}
            </h2>
            <p class="para mt-6">{{ t('about.map_text') }}</p>
            <address class="para not-italic mt-6">
              Boticia<br />
              410 rue de Cabrières Haut<br />
              13410 Lambesc, France
            </address>
            <Button
              variant="link"
              :href="ROUTE_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-8"
            >
              {{ t('about.map_route') }}
            </Button>
          </div>
          <StudioMap :label="t('about.map_alt')" />
        </div>
      </div>
    </section>

    <!-- [EL-STUDIO-CTA] — Appel final, comme les autres pages -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="section-title-lg mb-8 max-w-2xl mx-auto">
          {{ t('about.cta_text') }}
        </h2>
        <Button variant="cta" :to="localePath('devis')">
          {{ t('nav.quote') }}
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

// « Boticia, c'est » : trois engagements, icônes Phosphor
const values = [
  { key: "about.value_1", icon: "Palette" },
  { key: "about.value_2", icon: "Leaf" },
  { key: "about.value_3", icon: "Heart" },
];

// Itinéraire : ouvre l'application de cartes du visiteur (lien simple,
// aucune carte Google intégrée à la page)
const ROUTE_URL =
  "https://www.google.com/maps/search/?api=1&query=410%20rue%20de%20Cabri%C3%A8res%20Haut%2C%2013410%20Lambesc";

definePageMeta({
  layout: 'homepage',
  pageTransition: false,
});

const config = useRuntimeConfig();
const route = useRoute();

useSeoMeta({
  ogTitle: t('about.title') + ' | Boticia',
  ogDescription: t('seo.about_description'),
  ogUrl: `${config.public.siteUrl}${route.path}`,
  ogType: 'website',
  twitterTitle: t('about.title') + ' | Boticia',
  twitterDescription: t('seo.about_description'),
});

useHead({
  title: t('about.title') + ' | Boticia Provence',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: t('seo.about_description'),
    },
  ],
});
</script>
