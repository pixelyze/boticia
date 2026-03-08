<template>
  <div>
    <!-- Hero + Workshop types -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("workshops.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("workshops.title") }}
            </h1>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("workshops.intro") }}
            </p>
            <Button
              variant="primary"
              icon="MoveRight"
              :to="localePath('/devis')"
              class="mt-8"
            >
              {{ $t("workshops.cta") }}
            </Button>
          </div>
          <!-- Visual: workshop types -->
          <div class="space-y-5">
            <div
              v-for="(workshop, i) in workshopTypes"
              :key="i"
              class="flex items-start gap-4 bg-white rounded-2xl px-6 py-5"
            >
              <div
                class="w-12 h-12 rounded-xl bg-cream-light flex items-center
                       justify-center shrink-0"
              >
                <IconLucid :name="workshop.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <div>
                <h3 class="font-heading text-lg text-dark mb-1">
                  {{ workshop.title }}
                </h3>
                <p class="text-dark/70 leading-relaxed text-base">
                  {{ workshop.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- For whom -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("workshops.audience_tagline") }}
            </span>
            <h2 class="section-title-lg">
              {{ $t("workshops.audience_title") }}
            </h2>
            <p class="mt-4 text-dark/70 text-lg leading-relaxed">
              {{ $t("workshops.audience_desc") }}
            </p>
          </div>
          <!-- Audience cards -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(audience, i) in audiences"
              :key="i"
              class="px-5 py-6 rounded-2xl bg-cream-light text-center"
            >
              <div
                class="w-12 h-12 rounded-xl bg-white flex items-center
                       justify-center mx-auto mb-3"
              >
                <IconLucid :name="audience.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <h3 class="text-base font-semibold text-dark">
                {{ audience.label }}
              </h3>
              <p class="text-dark/70 text-base leading-relaxed mt-2">
                {{ audience.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("workshops.cta_title") }}
        </h2>
        <p class="text-dark/60 mb-8 text-lg max-w-xl mx-auto">
          {{ $t("workshops.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
          {{ $t("workshops.cta") }}
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

definePageMeta({
  layout: "homepage",
  pageTransition: false,
});

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
  title: t("workshops.title") + " - Boticia",
  meta: [{ name: "description", content: t("workshops.intro") }],
});

const workshopTypes = computed(() => [
  {
    icon: "Flower2",

    title: t("workshops.type_1_title"),
    desc: t("workshops.type_1_desc"),
  },
  {
    icon: "Leaf",

    title: t("workshops.type_2_title"),
    desc: t("workshops.type_2_desc"),
  },
  {
    icon: "Palette",

    title: t("workshops.type_3_title"),
    desc: t("workshops.type_3_desc"),
  },
]);

const audiences = computed(() => [
  { icon: "Handshake", label: t("workshops.audience_teambuilding"), desc: t("workshops.audience_teambuilding_desc") },
  { icon: "Heart", label: t("workshops.audience_evjf"), desc: t("workshops.audience_evjf_desc") },
  { icon: "PartyPopper", label: t("workshops.audience_birthday"), desc: t("workshops.audience_birthday_desc") },
  { icon: "Gift", label: t("workshops.audience_private"), desc: t("workshops.audience_private_desc") },
]);
</script>
