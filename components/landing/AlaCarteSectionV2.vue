<template>
  <!-- [COMP-ALACARTE-V2] — Bloc « Décoration florale », version 2
       Mêmes textes que AlaCarteSection (v1, gardée de côté), mise en page
       inspirée de la proposition de design : trois colonnes séparées par
       un filet fin, sans numéros, sans cartes ni icônes. Sans bouton en bas,
       à la demande de Laëtitia. -->
  <section
    aria-labelledby="alacarte-title"
    class="py-20 md:py-28"
    :class="bgClass"
  >
    <div class="container mx-auto px-6">
      <!-- [EL-ALACARTE-HEADER] — Petit titre, titre, introduction -->
      <div class="text-center mb-14 md:mb-20">
        <span class="section-tagline">
          {{ $t("alacarte.tagline") }}
        </span>
        <h2 id="alacarte-title" class="section-title-lg">
          {{ $t("alacarte.title") }}
        </h2>
        <p class="para-lead mt-5 max-w-2xl mx-auto">
          {{ $t("alacarte.subtitle") }}
        </p>
      </div>

      <!-- [EL-ALACARTE-COLUMNS] — Filets verticaux sur ordinateur,
           horizontaux sur téléphone -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto
               border-t border-dark/20 md:border-t-0"
      >
        <article
          v-for="group in groups"
          :key="group.key"
          class="flex flex-col gap-5 py-10 border-b border-dark/20
                 md:py-2 md:px-10 md:border-b-0 md:border-l
                 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
        >
          <!-- [EL-ALACARTE-TITLE] -->
          <h3 class="item-heading">
            {{ group.name }}
          </h3>
          <!-- [EL-ALACARTE-ITEMS] -->
          <ul class="space-y-4">
            <li
              v-for="(item, i) in group.items"
              :key="i"
              class="flex items-start gap-3"
            >
              <span class="mt-3 w-3 h-px bg-dark/40 shrink-0" />
              <span class="para">{{ item }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
// Fond : blanc par défaut (accueil), crème clair sur la page Mariages
// pour alterner avec ses voisins
defineProps({
  bgClass: { type: String, default: "bg-white" },
});
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Textes de Laëtitia (MODIF SITE, nov. 2026), partagés avec la v1
const groups = computed(() => [
  {
    key: "wedding",
    name: t("alacarte.wedding_title"),
    items: [1, 2, 3, 4].map((n) => t(`alacarte.wedding_${n}`)),
  },
  {
    key: "business",
    name: t("alacarte.business_title"),
    items: [1, 2, 3].map((n) => t(`alacarte.business_${n}`)),
  },
  {
    key: "workshop",
    name: t("alacarte.workshop_title"),
    items: [1, 2, 3].map((n) => t(`alacarte.workshop_${n}`)),
  },
]);
</script>
