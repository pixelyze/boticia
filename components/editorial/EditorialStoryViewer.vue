<template>
  <!-- [COMP-EDITORIAL-STORY] — Visionneuse plein écran façon story
       Barres de progression (une par photo), toucher à droite = suivante,
       à gauche = précédente ; en fin de galerie on passe à la suivante.
       Aucun défilement automatique. Fermeture : croix, Échap, glisser
       vers le bas (téléphone). Flèches du clavier pour naviguer.
       Visionneuse plein écran (comme GalleryLightbox), pas une modale
       à contenu : elle n'utilise donc pas useModalTransitions. -->
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[60] flex flex-col bg-black text-white"
      role="dialog"
      aria-modal="true"
      :aria-label="$t(gallery.label)"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- Barres de progression + en-tête -->
      <div class="relative z-10 flex flex-col gap-3 px-3 pt-3 md:px-6 md:pt-5">
        <div class="flex gap-1" aria-hidden="true">
          <span
            v-for="(photo, i) in gallery.photos"
            :key="photo.id"
            class="h-[2px] flex-1 rounded-full"
            :class="i <= photoIndex ? 'bg-white' : 'bg-white/30'"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              :src="gallery.photos[0].public_url"
              alt=""
              class="h-9 w-9 rounded-full object-cover"
            />
            <p class="font-editorial text-lg italic">
              {{ $t(gallery.label) }}
            </p>
            <p class="font-editorial text-sm tabular-nums text-white/70">
              {{ photoIndex + 1 }} / {{ gallery.photos.length }}
            </p>
          </div>
          <Button
            variant="ghost"
            icon-only
            icon="X"
            class="!text-white hover:!bg-white/10"
            :aria-label="$t('editorial.highlights.close')"
            @click="emit('close')"
          />
        </div>
      </div>

      <!-- Photo -->
      <div class="relative flex-1">
        <img
          :key="photo.id"
          :src="photo.public_url"
          :alt="photo.caption || $t(gallery.label)"
          class="absolute inset-0 h-full w-full object-contain"
        />
        <!-- Zones de toucher : gauche = précédente, droite = suivante -->
        <Button
          variant="ghost"
          class="!absolute !inset-y-0 !left-0 !w-1/3 !rounded-none !border-0 !p-0 hover:!bg-transparent"
          :aria-label="$t('editorial.highlights.prev')"
          @click="prev"
        />
        <Button
          variant="ghost"
          class="!absolute !inset-y-0 !right-0 !w-2/3 !rounded-none !border-0 !p-0 hover:!bg-transparent"
          :aria-label="$t('editorial.highlights.next')"
          @click="next"
        />
      </div>

      <p
        v-if="photo.caption"
        class="px-6 py-4 text-center font-editorial text-base italic text-white/80"
      >
        {{ photo.caption }}
      </p>
    </div>
  </Teleport>
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

const props = defineProps<{
  galleries: StoryGallery[];
  startGallery: number;
}>();
const emit = defineEmits<{ close: [] }>();

const galleryIndex = ref(props.startGallery);
const photoIndex = ref(0);

const gallery = computed(() => props.galleries[galleryIndex.value]);
const photo = computed(() => gallery.value.photos[photoIndex.value]);

const next = () => {
  if (photoIndex.value < gallery.value.photos.length - 1) {
    photoIndex.value++;
  } else if (galleryIndex.value < props.galleries.length - 1) {
    galleryIndex.value++;
    photoIndex.value = 0;
  } else {
    emit("close");
  }
};

const prev = () => {
  if (photoIndex.value > 0) {
    photoIndex.value--;
  } else if (galleryIndex.value > 0) {
    galleryIndex.value--;
    photoIndex.value = gallery.value.photos.length - 1;
  }
};

// Précharge la photo suivante pour un passage instantané
watch(
  [galleryIndex, photoIndex],
  () => {
    const upcoming = gallery.value.photos[photoIndex.value + 1];
    if (upcoming && import.meta.client) new Image().src = upcoming.public_url;
  },
  { immediate: true }
);

// Glisser vers le bas pour fermer (téléphone)
let touchStartY = 0;
const onTouchStart = (event: TouchEvent) => {
  touchStartY = event.touches[0].clientY;
};
const onTouchEnd = (event: TouchEvent) => {
  if (event.changedTouches[0].clientY - touchStartY > 90) emit("close");
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") emit("close");
  else if (event.key === "ArrowRight") next();
  else if (event.key === "ArrowLeft") prev();
};

onMounted(() => {
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});
</script>
