<template>
  <!-- [SECTION-WEDDING-WHY] — « Pourquoi nous choisir », version 1
       (cartes blanches, gardée de côté ; la page utilise la v2) -->
  <section class="py-16 md:py-24 bg-cream-light">
    <div class="container mx-auto px-6">
      <div class="text-center mb-14">
        <span class="section-tagline">{{ $t("weddings.why_tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("weddings.why_title") }}</h2>
      </div>
      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="reason in reasons"
          :key="reason.icon"
          class="bg-white rounded-2xl px-6 py-6"
        >
          <div class="w-10 h-10 rounded-full bg-cream-light flex items-center justify-center mb-4">
            <IconPhosphor :name="reason.icon" size="sm" class="text-dark" />
          </div>
          <h3 class="item-heading mb-2">{{ reason.title }}</h3>
          <p class="para">{{ reason.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();

const reasons = computed(() => [
  { icon: "Leaf", title: t("weddings.why_1_title"), desc: t("weddings.why_1_desc") },
  { icon: "Heart", title: t("weddings.why_2_title"), desc: t("weddings.why_2_desc") },
  { icon: "Laptop", title: t("weddings.why_3_title"), desc: t("weddings.why_3_desc") },
  { icon: "MapPin", title: t("weddings.why_4_title"), desc: t("weddings.why_4_desc") },
]);
</script>
