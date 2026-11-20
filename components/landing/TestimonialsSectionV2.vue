<template>
  <!-- [COMP-TESTIMONIALS-V2] — Avis : une voix à la fois
       Remplace TestimonialsMarquee (v1, gardée de côté : défilement
       automatique). Inspiré de la proposition « gravure et encre » : un
       seul avis à l'écran, en grande citation italique, signé ; flèches
       fines et compteur pour passer au suivant. Aucun défilement
       automatique. Avis gérés par Laëtitia (tableau de bord → Avis), dans
       la langue du visiteur ; section masquée s'il n'y en a aucun.
       Padding : py-20 md:py-28 | Background : bg-white -->
  <section
    v-if="testimonials.length"
    aria-labelledby="testimonials-title"
    class="py-20 md:py-28 bg-white"
  >
    <div class="container mx-auto px-6 flex flex-col items-center text-center">
      <span class="section-tagline">{{ $t("testimonials.tagline") }}</span>
      <h2 id="testimonials-title" class="section-title-lg">
        {{ $t("testimonials.title") }}
      </h2>

      <!-- [EL-TESTIMONIAL-QUOTE] — Hauteur minimale : la page ne saute
           pas d'un avis à l'autre -->
      <figure
        class="mt-12 flex min-h-[320px] max-w-4xl flex-col items-center
               justify-center gap-8 md:min-h-[260px]"
        aria-live="polite"
      >
        <blockquote
          class="font-body italic text-dark text-[22px] leading-[1.45]
                 md:text-[30px]"
        >
          <!-- Guillemets hors de $t : passé en paramètre, l'avis serait
               échappé (escapeHtml) et ses apostrophes abîmées -->
          {{ $t("testimonials.quote_open") }}{{ current.text }}{{ $t("testimonials.quote_close") }}
        </blockquote>
        <figcaption class="section-tagline !text-dark">
          {{ current.name }}<template v-if="current.location"> · {{ current.location }}</template>
        </figcaption>
      </figure>

      <!-- [EL-TESTIMONIAL-NAV] -->
      <div v-if="testimonials.length > 1" class="mt-10 flex items-center gap-6">
        <Button
          variant="ghost"
          icon="MoveLeft"
          class="!p-2"
          @click="go(-1)"
        >
          <span class="sr-only">{{ $t("testimonials.prev") }}</span>
        </Button>
        <p class="min-w-[4.5rem] font-body italic text-[15px] tabular-nums text-dark">
          {{ pad(index + 1) }} / {{ pad(testimonials.length) }}
        </p>
        <Button
          variant="ghost"
          icon="MoveRight"
          class="!p-2"
          @click="go(1)"
        >
          <span class="sr-only">{{ $t("testimonials.next") }}</span>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Testimonial {
  id: string;
  text: string;
  name: string;
  location: string | null;
}

// Avis publiés, dans la langue du visiteur (voir /api/testimonials)
const { locale } = useI18n();
const { data } = await useFetch<{ data: Testimonial[] }>("/api/testimonials", {
  key: "testimonials-v2",
  query: { locale },
});
const testimonials = computed(() => data.value?.data ?? []);

const index = ref(0);
const current = computed(
  () => testimonials.value[index.value] ?? testimonials.value[0]
);

const go = (step: number) => {
  const count = testimonials.value.length;
  index.value = (index.value + step + count) % count;
};

const pad = (n: number) => String(n).padStart(2, "0");
</script>
