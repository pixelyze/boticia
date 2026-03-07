<template>
  <Teleport to="body">
    <div
      v-if="modalIsOpen"
      class="fixed inset-0 z-[100]"
    >
      <!-- Fullscreen black overlay with transition -->
      <Transition v-bind="overlayTransition">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black"
        />
      </Transition>

      <!-- Content -->
      <Transition
        v-bind="contentTransition"
        @after-leave="onTransitionComplete"
      >
        <div
          v-if="showModal"
          class="fixed inset-0 flex flex-col"
        >
          <!-- Header -->
          <div
            class="flex-shrink-0 flex items-center justify-between px-4 h-14 z-10"
          >
            <!-- Close button -->
            <button
              class="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors"
              @click="handleClose"
            >
              <IconLucid name="X" size="md" color="currentColor" />
            </button>

            <!-- Category label -->
            <span class="text-white font-semibold text-base truncate mx-4">
              {{ props.title || (props.categorySlug ? $t("stories." + categorySlug) : '') }}
            </span>

            <!-- Counter -->
            <span class="text-white/60 text-sm tabular-nums min-w-[3rem] text-right">
              <template v-if="images.length > 0">
                {{ currentIndex + 1 }}/{{ images.length }}
              </template>
            </span>
          </div>

          <!-- Loading state -->
          <div
            v-if="loading"
            class="flex-1 flex items-center justify-center"
          >
            <IconLucid
              name="Loader2"
              size="lg"
              color="white"
              class="animate-spin"
            />
          </div>

          <!-- Empty state -->
          <div
            v-else-if="images.length === 0"
            class="flex-1 flex items-center justify-center px-6"
          >
            <p class="text-white/60 text-center text-lg">
              {{ $t("stories.gallery_empty") }}
            </p>
          </div>

          <!-- Gallery scroll area -->
          <div
            v-else
            ref="scrollContainerRef"
            class="flex-1 overflow-y-auto snap-y snap-mandatory gallery-scroll"
            @scroll="onScroll"
          >
            <div
              v-for="(img, i) in images"
              :key="img.id"
              :ref="(el) => setImageRef(el, i)"
              class="snap-start w-full flex flex-col items-center justify-center"
              :style="{ height: scrollHeight + 'px' }"
            >
              <img
                :src="img.public_url"
                :alt="img.caption || ''"
                class="max-w-full max-h-full object-contain"
                loading="lazy"
              />
              <p
                v-if="img.caption"
                class="text-white/60 text-sm text-center mt-3 px-6"
              >
                {{ img.caption }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import { useModal } from "~/composables/useModal";
import { useModalTransitions } from "~/composables/useModalTransitions";
import type { HomepageInspirationImage } from "~/server/utils/homepage-inspirations-types";

const { overlayTransition } = useModalTransitions();

const contentTransition = {
  appear: true,
  enterActiveClass: "transition-opacity duration-200 ease-out",
  enterFromClass: "opacity-0",
  enterToClass: "opacity-100",
  leaveActiveClass: "transition-opacity duration-150 ease-in",
  leaveFromClass: "opacity-100",
  leaveToClass: "opacity-0",
};

const props = defineProps<{
  isOpen: boolean;
  categorySlug?: string;
  categoryId?: string;
  items?: { public_url: string; caption?: string; id?: string }[];
  title?: string;
  startIndex?: number;
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const {
  showModal,
  isOpen: modalIsOpen,
  open,
  close,
  onTransitionComplete,
} = useModal();

const loading = ref(false);
const images = ref<HomepageInspirationImage[]>([]);
const currentIndex = ref(0);
const scrollContainerRef = ref<HTMLElement | null>(null);
const imageRefs = ref<(HTMLElement | null)[]>([]);
const scrollHeight = ref(0);

const setImageRef = (el: any, i: number) => {
  imageRefs.value[i] = el as HTMLElement | null;
};

const computeScrollHeight = () => {
  scrollHeight.value =
    typeof window !== "undefined" ? window.innerHeight - 56 : 600;
};

const FALLBACK_GALLERY: Record<string, { url: string; caption: string }[]> = {
  story_1: [
    { url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1200&fit=crop', caption: 'Bouquet champêtre' },
    { url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1200&fit=crop', caption: 'Roses pastel' },
    { url: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=1200&fit=crop', caption: 'Bouquet romantique' },
    { url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&fit=crop', caption: 'Pivoines et renoncules' },
  ],
  story_2: [
    { url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&fit=crop', caption: 'Centre de table fleuri' },
    { url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200&fit=crop', caption: 'Arrangement élégant' },
    { url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1200&fit=crop', caption: 'Table de réception' },
    { url: 'https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=1200&fit=crop', caption: 'Composition florale' },
  ],
  story_3: [
    { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&fit=crop', caption: 'Arche de cérémonie' },
    { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&fit=crop', caption: 'Décoration de cérémonie' },
    { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&fit=crop', caption: 'Arche en plein air' },
    { url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200&fit=crop', caption: 'Cérémonie champêtre' },
  ],
  story_4: [
    { url: 'https://images.unsplash.com/photo-1464699908537-0954e50791ee?w=1200&fit=crop', caption: 'Atelier floral' },
    { url: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&fit=crop', caption: 'Création en cours' },
    { url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1200&fit=crop', caption: 'Sélection de fleurs' },
    { url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&fit=crop', caption: 'Composition artisanale' },
  ],
  story_5: [
    { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&fit=crop', caption: 'Décor événementiel' },
    { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&fit=crop', caption: 'Réception privée' },
    { url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200&fit=crop', caption: 'Ambiance florale' },
    { url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1200&fit=crop', caption: 'Mise en scène' },
  ],
  story_6: [
    { url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1200&fit=crop', caption: 'Scénographie florale' },
    { url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200&fit=crop', caption: 'Installation artistique' },
    { url: 'https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=1200&fit=crop', caption: 'Décor immersif' },
    { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&fit=crop', caption: 'Mise en espace' },
  ],
};

const buildFallbackImages = (slug: string): HomepageInspirationImage[] => {
  const items = FALLBACK_GALLERY[slug] || [];
  return items.map((item, i) => ({
    id: `fallback-${slug}-${i}`,
    category_id: '',
    filename: '',
    original_filename: '',
    mime_type: 'image/jpeg',
    file_size: 0,
    storage_path: '',
    public_url: item.url,
    caption: item.caption,
    sort_order: i,
    created_at: '',
    updated_at: '',
  }));
};

const loadImages = async () => {
  // Mode 1: items passed directly via props
  if (props.items && props.items.length > 0) {
    images.value = props.items.map((item, i) => ({
      id: item.id || `item-${i}`,
      category_id: '',
      filename: '',
      original_filename: '',
      mime_type: 'image/jpeg',
      file_size: 0,
      storage_path: '',
      public_url: item.public_url,
      caption: item.caption,
      sort_order: i,
      created_at: '',
      updated_at: '',
    }));
    return;
  }

  // Mode 2: fetch from API by categoryId
  if (!props.categoryId) return;
  loading.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      data: HomepageInspirationImage[];
    }>(`/api/inspirations/${props.categoryId}`);
    images.value = res.data || [];
  } catch {
    images.value = [];
  } finally {
    loading.value = false;
  }

  // Use fallback Unsplash images if gallery is empty
  if (images.value.length === 0 && props.categorySlug) {
    images.value = buildFallbackImages(props.categorySlug);
  }

  // Auto-close if still empty after fallback
  if (images.value.length === 0) {
    setTimeout(() => {
      handleClose();
    }, 1500);
  }
};

const handleClose = () => {
  close();
  emit("close");
};

const onScroll = () => {
  const container = scrollContainerRef.value;
  if (!container || scrollHeight.value === 0) return;
  const index = Math.round(container.scrollTop / scrollHeight.value);
  currentIndex.value = Math.min(
    Math.max(0, index),
    images.value.length - 1
  );
};

const scrollToIndex = (index: number) => {
  const target = imageRefs.value[index];
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

// Keyboard navigation
useEventListener("keydown", (e: KeyboardEvent) => {
  if (!showModal.value) return;

  if (e.key === "Escape") {
    handleClose();
    return;
  }

  if (
    e.key === "ArrowDown" ||
    e.key === "ArrowRight"
  ) {
    e.preventDefault();
    if (currentIndex.value < images.value.length - 1) {
      scrollToIndex(currentIndex.value + 1);
    }
  }

  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    if (currentIndex.value > 0) {
      scrollToIndex(currentIndex.value - 1);
    }
  }
});

// Watch open/close
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      computeScrollHeight();
      currentIndex.value = props.startIndex || 0;
      images.value = [];
      open();
      await nextTick();
      await loadImages();
      // Scroll to startIndex after images are loaded
      if (props.startIndex && props.startIndex > 0) {
        await nextTick();
        scrollToIndex(props.startIndex);
      }
    } else {
      close();
    }
  },
  { immediate: true }
);

// Handle window resize
useEventListener("resize", computeScrollHeight);

onUnmounted(() => {
  images.value = [];
});
</script>

<style scoped>
.gallery-scroll {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

.gallery-scroll::-webkit-scrollbar {
  display: none;
}
</style>
