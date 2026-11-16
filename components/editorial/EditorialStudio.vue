<template>
  <!-- [COMP-EDITORIAL-STUDIO] — Le studio : une grande phrase signée -->
  <section
    id="studio"
    class="flex flex-col items-center gap-9 border-t-[1.5px] border-ed-ink px-[8%] py-20 text-center md:py-[120px]"
  >
    <p class="text-[13px] font-bold uppercase tracking-[0.32em]">
      {{ $t("editorial.studio.label") }}
    </p>
    <i18n-t
      keypath="editorial.studio.text"
      tag="p"
      class="max-w-[1060px] text-[clamp(26px,3.3vw,46px)] leading-[1.3]"
    >
      <template #em>
        <em>{{ $t("editorial.studio.em") }}</em>
      </template>
    </i18n-t>
    <p class="text-[19px] italic text-ed-accent">
      {{ $t("editorial.studio.signature") }}
    </p>
  </section>
</template>
