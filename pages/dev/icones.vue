<template>
  <!-- DEV-ONLY — Comparaison de banques d'icônes pour le site public.
       Les icônes externes viennent de l'API publique Iconify (SVG). -->
  <div class="min-h-screen bg-white px-6 py-16">
    <div class="max-w-6xl mx-auto">
      <h1 class="font-heading text-4xl text-dark mb-2">Banques d'icônes</h1>
      <p class="text-dark/60 mb-12 max-w-2xl">
        Les mêmes dix icônes dans chaque style, à la taille et à la couleur du
        site. Seules les icônes du site public changeraient ; le tableau de
        bord peut garder les siennes.
      </p>

      <div class="space-y-12">
        <section
          v-for="family in families"
          :key="family.key"
          class="border-t border-dark/20 pt-8"
        >
          <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6">
            <h2 class="font-heading text-2xl text-dark">{{ family.name }}</h2>
            <p class="text-sm text-dark/60">{{ family.note }}</p>
          </div>
          <ul
            class="grid gap-y-8"
            style="grid-template-columns: repeat(auto-fill, minmax(88px, 1fr))"
          >
            <li
              v-for="(concept, i) in CONCEPTS"
              :key="concept"
              class="flex flex-col items-center gap-3"
            >
              <IconLucid
                v-if="family.lucide"
                :name="family.icons[i]"
                size="lg"
                :stroke-width="family.stroke"
                class="text-dark"
              />
              <img
                v-else
                :src="`https://api.iconify.design/${family.prefix}/${family.icons[i]}.svg?color=%232B2B2B&height=32`"
                :alt="concept"
                class="h-8 w-8"
              />
              <span class="text-xs text-dark/60">{{ concept }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// DEV-ONLY
if (!import.meta.dev) {
  throw createError({ statusCode: 404 });
}

definePageMeta({ layout: false });

const CONCEPTS = [
  "Mariage", "Fleur", "Feuille", "Éclat", "Palette",
  "Lieu", "Horaire", "Avis", "Photo", "Entreprise",
];

const families = [
  {
    key: "lucide",
    name: "Lucide, actuel",
    note: "Trait épais (2), ce qu'on voit aujourd'hui sur le site.",
    lucide: true,
    stroke: 2,
    icons: ["Heart", "Flower2", "Leaf", "Sparkles", "Palette", "MapPin", "Clock", "Star", "Camera", "Building2"],
  },
  {
    key: "lucide-fin",
    name: "Lucide, trait fin",
    note: "Mêmes icônes, trait 1. Aucun changement de bibliothèque.",
    lucide: true,
    stroke: 1,
    icons: ["Heart", "Flower2", "Leaf", "Sparkles", "Palette", "MapPin", "Clock", "Star", "Camera", "Building2"],
  },
  {
    key: "ph-light",
    name: "Phosphor Light",
    note: "Gratuite (MIT). Fleurs variées : tulipe, lotus, plante.",
    prefix: "ph",
    icons: ["heart-light", "flower-tulip-light", "leaf-light", "sparkle-light", "palette-light", "map-pin-light", "clock-light", "star-light", "camera-light", "buildings-light"],
  },
  {
    key: "ph-thin",
    name: "Phosphor Thin",
    note: "La même, en trait très fin : le plus « luxe ».",
    prefix: "ph",
    icons: ["heart-thin", "flower-tulip-thin", "leaf-thin", "sparkle-thin", "palette-thin", "map-pin-thin", "clock-thin", "star-thin", "camera-thin", "buildings-thin"],
  },
  {
    key: "iconoir",
    name: "Iconoir",
    note: "Gratuite (MIT). Dessin sobre et géométrique.",
    prefix: "iconoir",
    icons: ["heart", "flower", "leaf", "sparks", "palette", "map-pin", "clock", "star", "camera", "building"],
  },
  {
    key: "hugeicons",
    name: "Hugeicons Stroke Rounded",
    note: "Gratuite pour cette version. Formes douces et arrondies.",
    prefix: "hugeicons",
    icons: ["favourite", "flower", "leaf-01", "sparkles", "paint-board", "location-01", "clock-01", "star", "camera-01", "building-03"],
  },
];
</script>
