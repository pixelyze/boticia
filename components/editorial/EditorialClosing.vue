<template>
  <!-- [COMP-EDITORIAL-CLOSING] — Fleurs de saison (citation)
       puis appel final vers la demande de devis -->
  <section
    class="flex flex-col items-center gap-7 border-t-[1.5px] border-ed-ink px-[10%] py-20 text-center md:py-[104px]"
  >
    <p class="text-[13px] font-bold uppercase tracking-[0.32em]">
      {{ $t("editorial.season.label") }}
    </p>
    <blockquote
      class="max-w-[1000px] text-[clamp(26px,3.2vw,44px)] italic leading-[1.35]"
    >
      {{ $t("editorial.season.quote") }}
    </blockquote>
  </section>

  <section
    class="flex flex-col items-center gap-9 border-t-[1.5px] border-ed-ink px-[5%] pb-[120px] pt-24 text-center md:pt-[112px]"
  >
    <h2 class="text-[clamp(60px,11vw,168px)] font-normal leading-[0.95]">
      {{ $t("editorial.cta.title_1") }}<br />
      <em>{{ $t("editorial.cta.title_2") }}</em>
    </h2>
    <Button
      variant="link"
      right-icon="MoveRight"
      :to="localePath('/devis')"
      class="text-2xl text-ed-accent"
    >
      {{ $t("editorial.cta.button") }}
    </Button>
    <p class="text-[13px] font-bold uppercase tracking-[0.32em]">
      {{ $t("editorial.cta.places") }}
    </p>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
