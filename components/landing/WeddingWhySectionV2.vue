<template>
  <!-- [SECTION-WEDDING-WHY-V2] — « Pourquoi nous choisir », version 2
       Même contenu que WeddingWhySection (v1, gardée de côté), sans cartes
       ni pastilles d'icônes : quatre raisons sur deux colonnes, séparées
       par un filet fin, comme les autres blocs v2.
       Padding : py-16 md:py-24 | Background : bg-cream-light -->
  <section class="py-16 md:py-24 bg-cream-light">
    <div class="container mx-auto px-6">
      <div class="text-center mb-14">
        <span class="section-tagline">{{ $t("weddings.why_tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("weddings.why_title") }}</h2>
      </div>

      <!-- [EL-WEDDING-WHY-LIST] — Filet au-dessus de chaque raison -->
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16">
        <article
          v-for="reason in reasons"
          :key="reason.icon"
          class="flex items-start gap-5 py-8 border-t border-dark/20"
        >
          <IconPhosphor :name="reason.icon" size="md" class="text-dark mt-1" />
          <div>
            <h3 class="item-heading mb-2">{{ reason.title }}</h3>
            <p class="para">{{ reason.desc }}</p>
          </div>
        </article>
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
