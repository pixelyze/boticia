<template>
  <!-- [COMP-FOOTER-V2] — Pied de page, version 2 (aérée)
       Remplace Footer (v1, gardée de côté) sur les pages publiques.
       Pleine largeur sur fond crème, sans logo couronne ni carte arrondie :
       trois colonnes (marque, pages, réseaux), puis une ligne fine avec le
       copyright et les mentions légales. Une colonne sur téléphone. -->
  <footer class="bg-cream text-dark font-body">
    <div class="container mx-auto px-6 pt-16 pb-8 md:pt-24">
      <div
        class="max-w-6xl mx-auto grid grid-cols-1 gap-12
               md:grid-cols-[1.6fr_1fr_1fr] md:gap-16"
      >
        <!-- [EL-FOOTER-BRAND] — Nom, sous-titre, lignes du héros -->
        <div>
          <p class="font-heading text-3xl uppercase tracking-[0.15em]">
            Boticia
          </p>
          <p class="para mt-3">{{ $t("footer.subtitle") }}</p>
          <p class="section-tagline !block mt-8 leading-loose">
            {{ $t("hero.heading_trade") }}<br />
            {{ $t("hero.heading_places") }}<br />
            {{ $t("hero.line_1") }}
          </p>
        </div>

        <!-- [EL-FOOTER-PAGES] -->
        <nav :aria-label="$t('footer.col_pages')">
          <p class="section-tagline !block mb-5">{{ $t("footer.col_pages") }}</p>
          <ul class="space-y-3">
            <li v-for="link in pages" :key="link.to">
              <Button
                variant="ghost"
                :to="localePath(link.to)"
                :class="LINK_CLASS"
              >
                {{ $t(link.label) }}
              </Button>
            </li>
          </ul>
        </nav>

        <!-- [EL-FOOTER-SOCIAL] -->
        <nav :aria-label="$t('footer.col_social')">
          <p class="section-tagline !block mb-5">{{ $t("footer.col_social") }}</p>
          <ul class="space-y-3">
            <li v-for="link in SOCIAL" :key="link.href">
              <Button
                variant="ghost"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :class="LINK_CLASS"
              >
                {{ link.label }}
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- [EL-FOOTER-BOTTOM] — Copyright et mentions légales -->
      <div
        class="max-w-6xl mx-auto mt-16 md:mt-24 pt-6 border-t border-dark/20
               flex flex-col gap-3 md:flex-row md:justify-between
               text-sm text-gray-500"
      >
        <p>{{ $t("footer.copyright") }}</p>
        <Button
          variant="ghost"
          :to="localePath('/legal')"
          :class="[LINK_CLASS, '!text-sm !text-gray-500 hover:!text-dark']"
        >
          {{ $t("footer.legal_link") }}
        </Button>
      </div>
    </div>
  </footer>
</template>

<script setup>
const localePath = useLocalePath();

// Liens texte : on neutralise la forme « bouton » du composant Button
const LINK_CLASS =
  "!p-0 !border-0 !rounded-none !font-normal !text-[17px] hover:!bg-transparent hover:underline underline-offset-4";

const pages = [
  { to: "/mariages", label: "nav.weddings" },
  { to: "/evenements", label: "nav.events" },
  { to: "/ateliers", label: "nav.workshops" },
  { to: "/studio", label: "nav.studio" },
  { to: "/faq", label: "footer.faq_link" },
  { to: "/devis", label: "nav.quote" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/boticia_" },
  { label: "Pinterest", href: "https://fr.pinterest.com/Boticia_Paris/" },
  { label: "Facebook", href: "https://www.facebook.com/BoticiaParis/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/la%C3%ABtitia-schaeffer-cr%C3%A9atrice-florale/" },
];
</script>
