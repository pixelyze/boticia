<template>
  <!-- [COMP-FAQ-COLUMNS] — FAQ des pages internes (Mariages, Événements…)
       Même mise en page que la FAQ de l'accueil (FAQSectionV2) : titre à
       gauche, questions à droite (composant FAQ). Les réponses restent dans
       la page même fermées (v-show), lisibles par Google. -->
  <section class="py-16 md:py-24" :class="bgClass">
    <div class="container mx-auto px-6">
      <div
        class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
               md:grid-cols-[2fr_3fr] md:gap-20"
      >
        <div>
          <span class="section-tagline">{{ tagline }}</span>
          <h2 class="section-title-lg">{{ title }}</h2>
        </div>
        <FAQ :items="items" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  tagline: { type: String, required: true },
  title: { type: String, required: true },
  // [{ question, answer }]
  items: { type: Array, required: true },
  bgClass: { type: String, default: "bg-white" },
});
</script>
