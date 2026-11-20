<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="section-tagline">
          {{ $t("alacarte.tagline") }}
        </span>
        <h2 class="section-title-lg">
          {{ $t("alacarte.title") }}
        </h2>
        <p class="mt-4 text-dark/60 max-w-2xl mx-auto text-lg">
          {{ $t("alacarte.subtitle") }}
        </p>
      </div>

      <!-- Categories -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6
               max-w-5xl mx-auto"
      >
        <div
          v-for="(group, index) in groups"
          :key="index"
          class="px-8 py-10 rounded-[2rem] bg-cream-light
                 text-center flex flex-col"
        >
          <IconLucid
            :name="group.icon"
            size="lg"
            :stroke-width="2"
            class="mx-auto text-dark mb-4"
          />
          <h3 class="plan-name mb-6">
            {{ group.name }}
          </h3>
          <ul class="space-y-3 text-left flex-1">
            <li
              v-for="(item, i) in group.items"
              :key="i"
              class="flex items-start gap-3 text-dark/70"
            >
              <!-- Petit trait fin à la place de la puce ronde -->
              <span class="mt-3 w-3 h-px bg-dark/40 shrink-0" />
              <span class="text-base">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Bloc « Décoration florale » : textes de Laëtitia (MODIF SITE, nov. 2026),
// sans appel à l'action en bas du bloc, à sa demande.
const groups = computed(() => [
  {
    icon: "Heart",
    name: t("alacarte.wedding_title"),
    items: [1, 2, 3, 4].map((n) => t(`alacarte.wedding_${n}`)),
  },
  {
    icon: "Flower2",
    name: t("alacarte.business_title"),
    items: [1, 2, 3].map((n) => t(`alacarte.business_${n}`)),
  },
  {
    icon: "Sparkles",
    name: t("alacarte.workshop_title"),
    items: [1, 2, 3].map((n) => t(`alacarte.workshop_${n}`)),
  },
]);
</script>
