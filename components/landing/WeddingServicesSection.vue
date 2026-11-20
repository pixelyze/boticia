<template>
  <!-- [SECTION-WEDDING-SERVICES] — Prestations mariage, version 1
       (cartes beiges, gardée de côté ; la page utilise la v2) -->
  <section class="py-16 md:py-24 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-14">
        <span class="section-tagline">{{ $t("weddings.services_tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("weddings.services_title") }}</h2>
        <p class="para-lead mt-5 max-w-2xl mx-auto">
          {{ $t("weddings.services_intro") }}
        </p>
      </div>
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="svc in services"
          :key="svc.icon"
          class="flex items-start gap-4 bg-cream-light rounded-2xl px-6 py-6"
        >
          <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
            <IconPhosphor :name="svc.icon" size="md" class="text-dark" />
          </div>
          <div>
            <h3 class="item-heading mb-2">{{ svc.title }}</h3>
            <p class="para">{{ svc.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();

const services = computed(() => [
  { icon: "FlowerTulip", title: t("weddings.service_bouquet_title"), desc: t("weddings.service_bouquet_desc") },
  { icon: "Church", title: t("weddings.service_ceremony_title"), desc: t("weddings.service_ceremony_desc") },
  { icon: "ForkKnife", title: t("weddings.service_reception_title"), desc: t("weddings.service_reception_desc") },
  { icon: "Crown", title: t("weddings.service_accessories_title"), desc: t("weddings.service_accessories_desc") },
]);
</script>
