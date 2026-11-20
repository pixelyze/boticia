<template>
  <!-- [COMP-FAQ-V2] — FAQ de l'accueil, version 2
       Même contenu que FAQSection (v1, gardée de côté). Mise en page des
       autres blocs v2 : titre et lien « Voir toutes les questions » à
       gauche, questions à droite. Sur téléphone : titre, lien, questions.
       Padding : py-20 md:py-28 | Background : bg-cream-light -->
  <section class="py-20 md:py-28 bg-cream-light">
    <div class="container mx-auto px-6">
      <div
        class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
               md:grid-cols-[2fr_3fr] md:gap-20"
      >
        <!-- [EL-FAQ-HEADER] -->
        <div>
          <span class="section-tagline">{{ $t("faq.tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("faq.title") }}</h2>
          <Button
            variant="link"
            :to="localePath('/faq')"
            class="mt-8"
          >
            {{ $t("faq.cta_button_all") }}
          </Button>
        </div>

        <!-- [EL-FAQ-LIST] -->
        <FAQ :items="faqItems" />
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const faqItems = computed(() => [
  { question: t("faq.q1"), answer: t("faq.a1") },
  { question: t("faq.q2"), answer: t("faq.a2") },
  { question: t("faq.q3"), answer: t("faq.a3") },
  { question: t("faq.q4"), answer: t("faq.a4") },
]);
</script>
