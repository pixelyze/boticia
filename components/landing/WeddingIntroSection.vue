<template>
  <!-- ==========================================
       [SECTION-WEDDING-INTRO] — Bloc d'intro mariage
       Utilisé sur la homepage (remplace la BlockQuote)
       et en hero de la page Mariage.
       Padding : py-20 md:py-28 | Background : bg-cream-light
       ========================================== -->
  <section class="py-20 md:py-28 bg-cream-light">
    <div class="container mx-auto px-6">
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2
               gap-16 items-center"
      >
        <!-- Text -->
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
            class="mt-6 text-dark/70 text-lg leading-relaxed"
          >
            {{ $t("weddings.intro") }}
          </p>
          <Button
            variant="primary"
            icon="MoveRight"
            :to="localePath('/devis')"
            class="mt-8"
          >
            {{ $t("weddings.cta") }}
          </Button>
        </div>

        <!-- Visual: steps -->
        <div class="space-y-5">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="flex items-start gap-4 bg-white
                   rounded-2xl px-6 py-5"
          >
            <div
              class="w-12 h-12 rounded-xl bg-cream-light
                     flex items-center justify-center shrink-0"
            >
              <IconLucid
                :name="step.icon"
                size="md"
                :stroke-width="2"
                class="text-dark"
              />
            </div>
            <div>
              <h3 class="font-heading text-lg text-dark mb-1">
                {{ step.title }}
              </h3>
              <p
                class="text-dark/70 leading-relaxed text-base"
              >
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
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
    icon: "MessageCircle",
    title: t("weddings.step_1_title"),
    desc: t("weddings.step_1_desc"),
  },
  {
    icon: "Palette",
    title: t("weddings.step_2_title"),
    desc: t("weddings.step_2_desc"),
  },
  {
    icon: "Flower2",
    title: t("weddings.step_3_title"),
    desc: t("weddings.step_3_desc"),
  },
]);
</script>
