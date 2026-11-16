<template>
  <!-- [COMP-EDITORIAL-SEASON] — Fleurs de saison (citation)
       Placée entre les prestations et les créations, loin des avis :
       deux grandes citations à la suite se confondaient. -->
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
</template>
