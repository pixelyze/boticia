<template>
  <!-- [COMP-EDITORIAL-HERO] — Grand bandeau
       « design floral » de part et d'autre du rosier de Provins
       (Redouté), teinté dans son cercle. Sur téléphone, l'accroche
       passe sous le bandeau pour ne pas couvrir la fleur. -->
  <section>
    <div class="relative h-[600px] md:h-[760px]">
      <EditorialEngraving
        src="/images/redoute/rosier-de-provins.webp"
        :alt="$t('editorial.hero.image_alt')"
        eager
        class="!absolute left-1/2 top-16 h-[480px] w-[min(380px,80vw)] -translate-x-1/2 md:top-2.5 md:h-[700px] md:w-[min(460px,64vw)] md:-translate-x-[55%]"
        circle-class="left-[26%] top-[40px] aspect-square w-[96%] md:top-[50px]"
      />

      <h1 class="font-normal">
        <span
          class="absolute left-[6%] top-4 text-[clamp(76px,15vw,220px)] leading-none tracking-[-0.01em] md:top-7"
        >{{ $t("editorial.hero.title_1") }}</span>
        <span
          class="absolute left-[6.5%] top-[100px] text-[15px] italic tracking-[0.08em] md:top-[clamp(120px,16vw,270px)] md:text-[17px]"
        > {{ $t("editorial.hero.subtitle") }}</span>
        <span
          class="absolute bottom-6 right-[5%] text-[clamp(76px,15vw,220px)] leading-none tracking-[-0.01em] md:bottom-10"
        > {{ $t("editorial.hero.title_2") }}</span>
      </h1>

      <p
        class="absolute right-[5%] top-[150px] hidden w-[290px] text-right text-[19px] italic leading-relaxed tracking-[0.05em] text-ed-accent md:block"
      >
        {{ $t("editorial.hero.tagline") }}
      </p>

      <div
        aria-hidden="true"
        class="absolute left-[7%] top-[430px] hidden items-start gap-6 md:flex"
      >
        <span class="block h-[130px] w-[1.5px] bg-ed-ink" />
        <span class="mt-[30px] block h-[130px] w-[1.5px] bg-ed-ink" />
        <span class="block h-[130px] w-[1.5px] bg-ed-ink" />
        <span class="mt-[30px] block h-[130px] w-[1.5px] bg-ed-ink" />
      </div>

      <a
        href="#studio"
        :aria-label="$t('editorial.hero.scroll')"
        class="absolute bottom-10 left-[7%] hidden h-16 w-11 items-end justify-center md:flex"
      >
        <svg aria-hidden="true" width="14" height="60" viewBox="0 0 14 60" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 0v58M1 52l6 7 6-7" /></svg>
      </a>
    </div>

    <p
      class="px-[8%] pb-12 text-center text-[17px] italic leading-relaxed tracking-[0.05em] text-ed-accent md:hidden"
    >
      {{ $t("editorial.hero.tagline") }}
    </p>
  </section>
</template>
