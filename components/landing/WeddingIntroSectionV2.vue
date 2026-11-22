<template>
  <!-- ==========================================
       [SECTION-WEDDING-INTRO-V2] — Bloc d'intro mariage, en étapier
       Se distingue des autres blocs de l'accueil (2 colonnes à filets) :
       en-tête centré, puis les 3 étapes reliées par un fil, chacune
       marquée d'un cercle avec son icône. Sur téléphone, le fil devient
       vertical, à gauche.
       Utilisé sur la homepage et en haut de la page Mariages.
       Textes : weddings.* (textes de Laëtitia, ne pas réécrire)
       Padding : py-20 md:py-28 | Background : bgClass (crème clair par
       défaut, blanc sur l'accueil pour alterner avec ses voisins)
       ========================================== -->
  <section class="py-20 md:py-28" :class="bgClass">
    <div class="container mx-auto px-6">
      <!-- [EL-WEDDING-INTRO-HEADER] — En-tête centré -->
      <div class="max-w-3xl mx-auto text-center">
        <span class="section-tagline">
          {{ $t("weddings.tagline") }}
        </span>
        <component :is="titleTag" class="section-title-lg">
          {{ $t("weddings.title") }}
        </component>
        <p class="para-lead mt-6">
          {{ $t("weddings.intro") }}
        </p>
      </div>

      <!-- [EL-WEDDING-INTRO-STEPPER] — Étapes reliées par un fil -->
      <ol class="relative max-w-6xl mx-auto mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
        <!-- Fil : horizontal sur ordinateur (d'un cercle à l'autre),
             vertical sur téléphone -->
        <span
          aria-hidden="true"
          class="hidden md:block absolute border-t border-dark/25"
          style="top: 28px; left: 16.666%; right: 16.666%"
        />
        <span
          aria-hidden="true"
          class="md:hidden absolute border-l border-dark/25"
          style="left: 28px; top: 28px; bottom: 28px"
        />

        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative flex items-start gap-5 md:block md:text-center"
        >
          <span
            class="relative z-10 shrink-0 w-14 h-14 rounded-full
                   border border-dark/30 flex items-center justify-center
                   md:mx-auto"
            :class="bgClass"
          >
            <IconPhosphor :name="step.icon" size="md" class="text-dark" />
          </span>
          <div class="md:mt-6 md:px-4">
            <p class="text-[13px] font-semibold uppercase tracking-[0.3em] text-orange-500 mt-4 md:mt-0">
              {{ $t("weddings.step_label", { n: i + 1 }) }}
            </p>
            <h3 class="item-heading mt-2 mb-3">
              {{ step.title }}
            </h3>
            <p class="para">
              {{ step.desc }}
            </p>
          </div>
        </li>
      </ol>

      <!-- [EL-WEDDING-INTRO-CTA] -->
      <div class="text-center mt-14 md:mt-16">
        <Button variant="cta" :to="localePath('devis')">
          {{ $t("weddings.cta") }}
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  titleTag?: "h1" | "h2";
  // Fond de la section (et des cercles posés sur le fil)
  bgClass?: string;
}

withDefaults(defineProps<Props>(), {
  titleTag: "h2",
  bgClass: "bg-cream-light",
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
