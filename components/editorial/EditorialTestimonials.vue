<template>
  <!-- [COMP-EDITORIAL-TESTIMONIALS] — Avis : une voix à la fois
       Données : avis publiés depuis le tableau de bord (/api/testimonials,
       dans la langue du visiteur). Un seul avis affiché, en grande
       citation ; flèches fines pour passer au suivant. Aucun défilement
       automatique. -->
  <section
    v-if="testimonials.length"
    aria-labelledby="editorial-testimonials"
    class="flex flex-col items-center gap-10 border-t-[1.5px] border-ed-ink px-[8%] py-20 text-center md:py-[104px]"
  >
    <h2
      id="editorial-testimonials"
      class="text-[13px] font-bold uppercase tracking-[0.32em]"
    >
      {{ $t("editorial.testimonials.label") }}
    </h2>

    <figure
      class="flex min-h-[340px] max-w-[980px] flex-col items-center justify-center gap-8 md:min-h-[260px]"
      aria-live="polite"
    >
      <blockquote
        class="text-[clamp(22px,2.5vw,36px)] italic leading-[1.4]"
      >
        <!-- Guillemets hors du texte : passé en paramètre de $t, l'avis
             serait échappé (escapeHtml) et ses apostrophes abîmées -->
        {{ $t("editorial.testimonials.quote_open") }}{{ current.text }}{{ $t("editorial.testimonials.quote_close") }}
      </blockquote>
      <figcaption class="text-[13px] font-bold uppercase tracking-[0.24em]">
        {{ current.name }}<template v-if="current.location"> · {{ current.location }}</template>
      </figcaption>
    </figure>

    <div v-if="testimonials.length > 1" class="flex items-center gap-6">
      <Button
        variant="ghost"
        icon-only
        icon="MoveLeft"
        class="!text-ed-ink hover:!bg-ed-ink/5"
        :aria-label="$t('testimonials.prev')"
        @click="go(-1)"
      />
      <p class="min-w-[4.5rem] text-[15px] italic tabular-nums text-ed-accent">
        {{ pad(index + 1) }} / {{ pad(testimonials.length) }}
      </p>
      <Button
        variant="ghost"
        icon-only
        icon="MoveRight"
        class="!text-ed-ink hover:!bg-ed-ink/5"
        :aria-label="$t('testimonials.next')"
        @click="go(1)"
      />
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

const { locale } = useI18n();
const { data } = await useFetch<{ data: Testimonial[] }>("/api/testimonials", {
  key: "editorial-testimonials",
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
