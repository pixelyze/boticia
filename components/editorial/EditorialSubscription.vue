<template>
  <!-- [COMP-EDITORIAL-SUBSCRIPTION] — Abonnement floral
       Gravure à gauche, texte de Laëtitia à droite ; empilés sur téléphone -->
  <section
    aria-labelledby="editorial-subscription"
    class="flex flex-wrap border-t-[1.5px] border-ed-ink"
  >
    <EditorialEngraving
      src="/images/redoute/tulipe-odorante.webp"
      :alt="$t('editorial.subscription.image_alt')"
      class="min-h-[480px] flex-[1_1_420px] border-b-[1.5px] border-ed-ink md:min-h-[600px] md:border-b-0 md:border-r-[1.5px]"
      circle-class="left-1/2 top-[90px] -ml-[120px] h-[300px] w-[300px]"
      image-class="inset-10 h-[calc(100%-80px)] w-[calc(100%-80px)]"
    />
    <div
      class="flex flex-[1_1_480px] flex-col justify-center gap-6 px-[7%] py-16 md:py-[88px]"
    >
      <p class="text-[13px] font-bold uppercase tracking-[0.32em]">
        {{ $t("editorial.subscription.label") }}
      </p>
      <h2
        id="editorial-subscription"
        class="text-[clamp(56px,7vw,104px)] font-normal leading-[0.95]"
      >
        {{ $t("editorial.subscription.title_1") }}
        <em>{{ $t("editorial.subscription.title_2") }}</em>
      </h2>
      <p class="max-w-[560px] text-[19px] leading-relaxed">
        {{ $t("editorial.subscription.text") }}
      </p>
      <ul class="flex flex-wrap gap-x-7 gap-y-2.5 text-lg italic text-ed-accent">
        <li>{{ $t("editorial.subscription.f1") }}</li>
        <li>{{ $t("editorial.subscription.f2") }}</li>
        <li>{{ $t("editorial.subscription.f3") }}</li>
      </ul>
      <Button
        variant="link"
        right-icon="MoveRight"
        :to="localePath('/devis')"
        class="self-start text-xl"
      >
        {{ $t("editorial.subscription.cta") }}
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
