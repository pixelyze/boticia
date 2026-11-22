<template>
  <!-- [SECTION-WEDDING-SERVICES-V2] — Prestations mariage, version 2
       Même contenu que WeddingServicesSection (v1, gardée de côté), sans
       cartes ni carrés d'icônes : quatre prestations sur deux colonnes,
       séparées par un filet fin, comme les autres blocs v2.
       Padding : py-16 md:py-24 | Background : bg-white -->
  <section class="py-16 md:py-24 bg-cream-light">
    <div class="container mx-auto px-6">
      <!-- [EL-WEDDING-SERVICES-HEADER] -->
      <div class="text-center mb-14">
        <span class="section-tagline">{{ $t("weddings.services_tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("weddings.services_title") }}</h2>
        <p class="para-lead mt-5 max-w-2xl mx-auto">
          {{ $t("weddings.services_intro") }}
        </p>
      </div>

      <!-- [EL-WEDDING-SERVICES-LIST] — Filet au-dessus de chaque prestation -->
      <div
        class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16"
      >
        <article
          v-for="svc in services"
          :key="svc.icon"
          class="flex items-start gap-5 py-8 border-t border-dark/20"
        >
          <IconPhosphor :name="svc.icon" size="md" class="text-dark mt-1" />
          <div>
            <h3 class="item-heading mb-2">{{ svc.title }}</h3>
            <p class="para">{{ svc.desc }}</p>
          </div>
        </article>
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
