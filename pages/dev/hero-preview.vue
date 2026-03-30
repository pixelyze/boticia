<template>
  <div>
    <!-- Selector -->
    <div class="fixed top-4 right-4 z-[100] bg-dark text-cream rounded-2xl px-5 py-3 flex gap-3 shadow-xl">
      <button
        v-for="v in versions"
        :key="v.id"
        @click="active = v.id"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
        :class="active === v.id ? 'bg-cream text-dark' : 'text-cream/60 hover:text-cream'"
      >
        {{ v.label }}
      </button>
    </div>

    <!-- Version 1 : Actuelle -->
    <HeroSection v-if="active === 1" />

    <!-- Version 2 : Laëtitia -->
    <HeroV2 v-if="active === 2" />

    <!-- Version 3 : Plein écran -->
    <HeroV3 v-if="active === 3" />

    <!-- Version 4 : Split moderne -->
    <HeroV4 v-if="active === 4" />

    <!-- Version 5 : Dynamique -->
    <HeroV5 v-if="active === 5" />

    <!-- Label -->
    <div class="text-center py-8 bg-cream-light">
      <p class="text-dark/40 text-sm">
        {{ versions.find(v => v.id === active)?.desc }}
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false, ssr: false });

const active = ref(1);

const versions = [
  { id: 1, label: "V1 · Actuelle", desc: "Logo + titre H1 + subtitle SEO" },
  { id: 2, label: "V2 · Laëtitia", desc: "Photo + Boticia Créatrice d'ambiance florale" },
  { id: 3, label: "V3 · Plein écran", desc: "Photo plein écran + overlay sombre + CTA" },
  { id: 4, label: "V4 · Split", desc: "Texte à gauche + photo à droite avec forme organique" },
  { id: 5, label: "V5 · Dynamique", desc: "Photo + zoom + pétales flottants + animations d'entrée séquentielles" },
];
</script>
