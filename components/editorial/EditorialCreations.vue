<template>
  <!-- [COMP-EDITORIAL-CREATIONS] — Galerie « nos créations »
       Données : la galerie portfolio gérée depuis /dashboard/galleries
       (API /api/galleries/portfolio, ordre selon bento_slot).
       Sept photos en mosaïque (une en arche), clic = visionneuse.
       Sans photo en base : trois réalisations de secours. -->
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

    <div class="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-6">
      <Button
        v-for="(photo, index) in tiles"
        :key="photo.id"
        variant="ghost"
        :aria-label="photo.caption || $t('portfolio.photo_alt')"
        class="group !block !rounded-none !border-0 !p-0 overflow-hidden [&>span]:block [&>span]:h-full"
        :class="TILE_CLASSES[index]"
        @click="openLightbox(index)"
      >
        <img
          :src="photo.public_url"
          :alt="photo.caption || $t('portfolio.photo_alt')"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          :class="index === 1 ? 'rounded-t-full' : ''"
        />
      </Button>
    </div>

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="tiles"
      :title="$t('portfolio.title')"
      :start-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </section>
</template>

<script setup lang="ts">
interface GalleryPhoto {
  id: string;
  public_url: string;
  caption?: string | null;
  bento_slot?: number | null;
}

const localePath = useLocalePath();

// Mosaïque : 7 emplacements (téléphone : 2 colonnes ; ordinateur : 12).
// Rang 1 : grande + arche · rang 2 : trois égales · rang 3 : moyenne + grande
const TILE_CLASSES = [
  "col-span-2 h-[300px] md:col-span-7 md:h-[520px]",
  "col-span-1 h-[260px] md:col-span-5 md:h-[520px]",
  "col-span-1 h-[260px] md:col-span-4 md:h-[420px]",
  "col-span-2 h-[260px] md:col-span-4 md:h-[420px]",
  "col-span-1 h-[260px] md:col-span-4 md:h-[420px]",
  "col-span-1 h-[260px] md:col-span-5 md:h-[480px]",
  "col-span-2 h-[300px] md:col-span-7 md:h-[480px]",
];

const FALLBACK: GalleryPhoto[] = [
  { id: "fallback-1", public_url: "/bouquet_mariee_boticia._1.webp" },
  { id: "fallback-2", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg" },
  { id: "fallback-3", public_url: "/images/events/scenographie-florale-boticia.jpg" },
];

const { data } = await useFetch<{ data?: GalleryPhoto[] }>(
  "/api/galleries/portfolio",
  { key: "editorial-portfolio" }
);

// Photos placées sur un emplacement (bento_slot) d'abord, dans l'ordre
// des emplacements, puis les autres
const tiles = computed<GalleryPhoto[]>(() => {
  const photos = data.value?.data ?? [];
  if (!photos.length) return FALLBACK;
  const slotted = photos
    .filter((p) => p.bento_slot != null)
    .sort((a, b) => (a.bento_slot ?? 0) - (b.bento_slot ?? 0));
  const rest = photos.filter((p) => p.bento_slot == null);
  return [...slotted, ...rest].slice(0, TILE_CLASSES.length);
});

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};
</script>
