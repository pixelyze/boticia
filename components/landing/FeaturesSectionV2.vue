<template>
  <!-- [COMP-FEATURES-V2] — « Notre savoir-faire », version 2
       Même contenu que FeaturesSection (v1, gardée de côté). Mise en page
       de revue, pour ne pas répéter les trois colonnes du bloc « Trois
       étapes » juste en dessous : le titre à gauche, en grand, et les trois
       engagements empilés à droite, séparés par un filet fin.
       Sur téléphone : titre puis liste.
       Padding : py-20 md:py-28 | Background : bg-cream-light -->
  <section class="py-20 md:py-28 bg-cream-light">
    <div class="container mx-auto px-6">
      <div
        class="max-w-6xl mx-auto grid grid-cols-1 gap-12
               md:grid-cols-[2fr_3fr] md:gap-20"
      >
        <!-- [EL-FEATURES-HEADER] -->
        <div class="md:self-start">
          <span class="section-tagline">{{ $t("features.tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("features.title") }}</h2>
        </div>

        <!-- [EL-FEATURES-LIST] -->
        <ol class="border-t border-dark/20">
          <li
            v-for="feature in features"
            :key="feature.icon"
            class="flex items-start gap-5 py-8 border-b border-dark/20"
          >
            <IconPhosphor :name="feature.icon" size="md" class="text-dark mt-1" />
            <div>
              <h3 class="item-heading mb-2">{{ feature.title }}</h3>
              <p class="para">{{ feature.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();

const features = computed(() => [
  {
    icon: "FlowerTulip",
    title: t("features.feature_1_title"),
    description: t("features.feature_1_description"),
  },
  {
    icon: "Palette",
    title: t("features.feature_2_title"),
    description: t("features.feature_2_description"),
  },
  {
    icon: "Leaf",
    title: t("features.feature_3_title"),
    description: t("features.feature_3_description"),
  },
]);
</script>
