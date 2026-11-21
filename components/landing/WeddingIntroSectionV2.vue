<template>
  <!-- ==========================================
       [SECTION-WEDDING-INTRO-V2] — Bloc d'intro mariage, version 2
       Même contenu que WeddingIntroSection (v1, gardée de côté), sans
       cartes blanches ni carrés d'icônes : les trois étapes sont séparées
       par un filet fin, comme le bloc « Décoration florale » (v2).
       Utilisé sur la homepage et en haut de la page Mariages.
       Padding : py-20 md:py-28 | Background : bg-cream-light
       ========================================== -->
  <section class="py-20 md:py-28 bg-cream-light">
    <div class="container mx-auto px-6">
      <div
        class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
               md:grid-cols-[2fr_3fr] md:gap-20"
      >
        <!-- [EL-WEDDING-INTRO-TEXT] -->
        <div>
          <span class="section-tagline">
            {{ $t("weddings.tagline") }}
          </span>
          <component
            :is="titleTag"
            class="section-title-lg"
          >
            {{ $t("weddings.title") }}
          </component>
          <p
            class="para-lead mt-6"
          >
            {{ $t("weddings.intro") }}
          </p>
          <Button
            variant="cta"
            :to="localePath('devis')"
            class="mt-8"
          >
            {{ $t("weddings.cta") }}
          </Button>
        </div>

        <!-- [EL-WEDDING-INTRO-STEPS] — Étapes séparées par un filet -->
        <ol class="border-t border-dark/20">
          <li
            v-for="step in steps"
            :key="step.title"
            class="flex items-start gap-5 py-7 border-b border-dark/20"
          >
            <IconPhosphor
              :name="step.icon"
              size="md"
              class="text-dark mt-1"
            />
            <div>
              <h3 class="item-heading mb-2">
                {{ step.title }}
              </h3>
              <p class="para">
                {{ step.desc }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  titleTag?: "h1" | "h2";
}

withDefaults(defineProps<Props>(), {
  titleTag: "h2",
});

const { t } = useI18n();
const localePath = useLocalePath();

const steps = computed(() => [
  {
    icon: "ChatCircle",
    title: t("weddings.step_1_title"),
    desc: t("weddings.step_1_desc"),
  },
  {
    icon: "Palette",
    title: t("weddings.step_2_title"),
    desc: t("weddings.step_2_desc"),
  },
  {
    icon: "FlowerTulip",
    title: t("weddings.step_3_title"),
    desc: t("weddings.step_3_desc"),
  },
]);
</script>
