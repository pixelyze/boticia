<template>
  <!-- [COMP-EDITORIAL-HIGHLIGHTS] — Galeries « à la une », façon Instagram
       Une rangée de cercles (première photo de chaque galerie, anneau
       épais à l'encre de la palette, sans effet au survol). Un clic ouvre la visionneuse plein
       écran (EditorialStoryViewer). Galeries gérées depuis
       /dashboard/galleries ; une galerie vide n'a pas de cercle. -->
  <section
    v-if="galleries.length"
    :aria-label="$t('editorial.highlights.label')"
    class="border-t-[1.5px] border-ed-ink py-10 md:py-14"
  >
    <ul
      class="flex justify-between gap-4 overflow-x-auto px-[5%] md:justify-center md:gap-14"
    >
      <li v-for="(gallery, index) in galleries" :key="gallery.slug" class="shrink-0">
        <Button
          variant="ghost"
          :aria-label="`${$t('editorial.highlights.open')} ${$t(gallery.label)}`"
          class="!flex-col !gap-3 !rounded-none !border-0 !p-0 hover:!bg-transparent [&>span]:flex [&>span]:flex-col [&>span]:items-center [&>span]:gap-3"
          @click="open(index)"
        >
          <span
            class="block rounded-full border-[3px] border-ed-ink p-1"
          >
            <img
              :src="gallery.photos[0].public_url"
              alt=""
              loading="lazy"
              decoding="async"
              class="block h-16 w-16 rounded-full object-cover md:h-28 md:w-28"
            />
          </span>
          <span class="font-editorial text-[15px] italic text-ed-ink md:text-[17px]">
            {{ $t(gallery.label) }}
          </span>
        </Button>
      </li>
    </ul>

    <EditorialStoryViewer
      v-if="viewerOpen"
      :galleries="galleries"
      :start-gallery="startGallery"
      @close="viewerOpen = false"
    />
  </section>
</template>

<script setup lang="ts">
interface StoryPhoto {
  id: string;
  public_url: string;
  caption?: string | null;
}
interface StoryGallery {
  slug: string;
  label: string;
  photos: StoryPhoto[];
}

// Ordre des cercles : le mariage d'abord (cœur de métier)
const SOURCES = [
  { slug: "wedding", label: "editorial.highlights.weddings" },
  { slug: "events", label: "editorial.highlights.events" },
  { slug: "creations", label: "editorial.highlights.creations" },
  { slug: "workshops", label: "editorial.highlights.workshops" },
];

const { data } = await useAsyncData("editorial-highlights", () =>
  Promise.all(
    SOURCES.map((source) =>
      $fetch<{ data?: StoryPhoto[] }>(`/api/galleries/${source.slug}`)
        .then((res) => ({ ...source, photos: res?.data ?? [] }))
        .catch(() => ({ ...source, photos: [] as StoryPhoto[] }))
    )
  )
);

const galleries = computed<StoryGallery[]>(
  () => (data.value ?? []).filter((g) => g.photos.length > 0)
);

const viewerOpen = ref(false);
const startGallery = ref(0);
const open = (index: number) => {
  startGallery.value = index;
  viewerOpen.value = true;
};
</script>
