<template>
  <!-- [COMP-EDITORIAL-CREATIONS] — Trois réalisations de Laëtitia
       (les gravures signent, les photos prouvent) -->
  <section
    aria-labelledby="editorial-creations"
    class="flex flex-col gap-10 border-t-[1.5px] border-ed-ink px-[5%] pb-24 pt-[72px]"
  >
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <h2
        id="editorial-creations"
        class="text-[clamp(60px,9vw,140px)] font-normal leading-[0.95]"
      >
        {{ $t("editorial.creations.title_1") }}
        <em>{{ $t("editorial.creations.title_2") }}</em>
      </h2>
      <Button
        variant="link"
        right-icon="MoveRight"
        :to="localePath('/creations')"
        class="text-[19px]"
      >
        {{ $t("editorial.creations.see_all") }}
      </Button>
    </div>
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-end gap-7"
    >
      <figure
        v-for="item in creations"
        :key="item.key"
        class="flex flex-col gap-3"
      >
        <img
          :src="item.src"
          :alt="$t(`editorial.creations.${item.key}_alt`)"
          loading="lazy"
          decoding="async"
          class="w-full object-cover"
          :class="item.class"
        />
        <figcaption class="text-base italic">
          {{ $t(`editorial.creations.${item.key}`) }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

const creations = [
  {
    key: "c1",
    src: "/bouquet_mariee_boticia._1.webp",
    class: "h-[460px] rounded-t-full object-[50%_60%]",
  },
  {
    key: "c2",
    src: "/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg",
    class: "h-[560px] rounded-t-full",
  },
  {
    key: "c3",
    src: "/images/events/scenographie-florale-boticia.jpg",
    class: "h-[460px] rounded-t-full",
  },
];
</script>
