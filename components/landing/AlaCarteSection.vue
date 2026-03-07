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
        <p class="mt-4 text-dark/60 max-w-xl mx-auto text-lg">
          {{ $t("alacarte.subtitle") }}
        </p>
      </div>

      <!-- Categories -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6
               max-w-5xl mx-auto mb-16"
      >
        <div
          v-for="(group, index) in groups"
          :key="index"
          class="px-8 py-10 rounded-[2rem] border-2 border-dark/10
                 text-center flex flex-col bg-white"
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
              <span
                class="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark/30
                       shrink-0"
              />
              <span class="text-base">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <p class="text-dark/60 mb-6 text-lg">
          {{ $t("alacarte.cta_hint") }}
        </p>
        <Button
          variant="primary"
          icon="MoveRight"
          :to="localePath('/devis')"
        >
          {{ $t("alacarte.cta") }}
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();

const groups = computed(() => [
  {
    icon: "Heart",
    name: t("alacarte.group_personal"),
    items: [
      t("alacarte.item_bridal_bouquet"),
      t("alacarte.item_bridesmaid_bouquet"),
      t("alacarte.item_boutonnieres"),
      t("alacarte.item_hair_flowers"),
    ],
  },
  {
    icon: "Flower2",
    name: t("alacarte.group_ceremony"),
    items: [
      t("alacarte.item_ceremony_arch"),
      t("alacarte.item_ceremony_aisle"),
      t("alacarte.item_venue_entrance"),
      t("alacarte.item_welcome_sign"),
    ],
  },
  {
    icon: "Sparkles",
    name: t("alacarte.group_reception"),
    items: [
      t("alacarte.item_table_centerpieces"),
      t("alacarte.item_table_runner"),
      t("alacarte.item_cocktail_decor"),
      t("alacarte.item_cake_flowers"),
    ],
  },
]);
</script>
