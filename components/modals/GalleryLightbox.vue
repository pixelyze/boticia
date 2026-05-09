<template>
  <Teleport to="body">
    <div v-if="modalIsOpen" class="fixed top-0 left-0 right-0 h-[100dvh] z-[100]" @touchmove.prevent>
      <!-- Overlay with ambient background -->
      <Transition v-bind="overlayTransition">
        <div v-if="showModal" class="fixed top-0 left-0 right-0 h-[100dvh] overflow-hidden">
          <img
            v-if="images[currentIndex]"
            :key="currentIndex"
            :src="images[currentIndex].public_url"
            class="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl brightness-[0.25]"
            aria-hidden="true"
          />
          <div class="absolute inset-0 bg-black/50" />
        </div>
      </Transition>

      <!-- Photo mobile : suit le doigt, animation manuelle -->
      <img
        v-if="showModal && images[currentIndex]"
        :src="images[currentIndex].public_url"
        :alt="images[currentIndex].caption || ''"
        class="sm:hidden fixed inset-0 w-full h-full object-cover z-[101]"
        :style="mobileImgStyle"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      />

      <!-- Photo desktop : Transition Vue -->
      <Transition :name="transitionName" mode="out-in" @after-leave="onTransitionComplete">
        <img
          v-if="showModal && images[currentIndex]"
          :key="currentIndex"
          :src="images[currentIndex].public_url"
          :alt="images[currentIndex].caption || ''"
          class="hidden sm:block fixed inset-0 w-full h-full object-contain z-[101]"
        />
      </Transition>

      <!-- States (loading / empty) -->
      <div v-if="showModal && loading" class="fixed top-0 left-0 right-0 h-[100dvh] z-[102] flex items-center justify-center">
        <IconLucid name="Loader2" size="lg" color="white" class="animate-spin" />
      </div>
      <div v-else-if="showModal && images.length === 0 && !loading" class="fixed top-0 left-0 right-0 h-[100dvh] z-[102] flex items-center justify-center px-6">
        <p class="text-white/60 text-center text-lg">{{ $t("stories.gallery_empty") }}</p>
      </div>

      <!-- Header : overlay fixed en haut -->
      <Transition v-bind="contentTransition">
        <div v-if="showModal" class="fixed top-0 inset-x-0 h-14 z-[103] flex items-center justify-between px-4">
          <button
            class="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors"
            @click="handleClose"
          >
            <IconLucid name="X" size="md" color="currentColor" />
          </button>
          <span class="text-white font-semibold text-base truncate mx-4">{{ props.title }}</span>
          <span class="text-white/60 text-sm tabular-nums min-w-[3rem] text-right">
            <template v-if="images.length > 0">{{ currentIndex + 1 }}/{{ images.length }}</template>
          </span>
        </div>
      </Transition>

      <!-- Caption -->
      <p
        v-if="showModal && images[currentIndex]?.caption"
        class="fixed bottom-24 sm:bottom-4 inset-x-0 text-white/60 text-sm text-center px-4 z-[103] pointer-events-none"
      >
        {{ images[currentIndex].caption }}
      </p>

      <!-- Chevrons (desktop uniquement) -->
      <button
        v-if="showModal && images.length > 1"
        class="fixed left-2 top-1/2 -translate-y-1/2 w-10 h-10
               hidden sm:flex items-center justify-center rounded-full
               bg-white/10 hover:bg-white/20 text-white transition-all z-[103]"
        @click="go(-1)"
      >
        <IconLucid name="ChevronLeft" size="sm" color="currentColor" />
      </button>
      <button
        v-if="showModal && images.length > 1"
        class="fixed right-2 top-1/2 -translate-y-1/2 w-10 h-10
               hidden sm:flex items-center justify-center rounded-full
               bg-white/10 hover:bg-white/20 text-white transition-all z-[103]"
        @click="go(1)"
      >
        <IconLucid name="ChevronRight" size="sm" color="currentColor" />
      </button>

      <!-- Thumbnail strip (desktop uniquement) -->
      <div
        v-if="showModal && images.length > 1"
        ref="thumbStripRef"
        class="fixed bottom-0 inset-x-0 hidden sm:flex gap-2 overflow-x-auto px-4 py-3 z-[103]"
        style="scrollbar-width: none;"
      >
        <button
          v-for="(img, i) in images"
          :key="img.id"
          :ref="(el) => setThumbRef(el, i)"
          class="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all"
          :class="i === currentIndex ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'"
          @click="goTo(i)"
        >
          <img :src="img.public_url" :alt="img.caption || ''" class="w-full h-full object-cover" />
        </button>
      </div>
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

const { showModal, isOpen: modalIsOpen, open, close, onTransitionComplete } = useModal();

const loading = ref(false);
const images = ref<HomepageInspirationImage[]>([]);
const currentIndex = ref(0);
const transitionName = ref("slide-left");
const thumbStripRef = ref<HTMLElement | null>(null);
const touchStartY = ref(0);
const dragY = ref(0);
const isDragging = ref(false);
const noTransition = ref(false);
const thumbRefs = ref<(HTMLElement | null)[]>([]);

const mobileImgStyle = computed(() => ({
  transform: `translateY(${dragY.value}px)`,
  transition: (isDragging.value || noTransition.value) ? "none" : "transform 0.25s ease",
}));

const setThumbRef = (el: any, i: number) => {
  thumbRefs.value[i] = el as HTMLElement | null;
};

const scrollThumbIntoView = (index: number) => {
  const el = thumbRefs.value[index];
  if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
};

const go = (dir: 1 | -1, transition?: string) => {
  if (images.value.length <= 1) return;
  transitionName.value = transition ?? (dir === 1 ? "slide-left" : "slide-right");
  const next = (currentIndex.value + dir + images.value.length) % images.value.length;
  currentIndex.value = next;
  nextTick(() => scrollThumbIntoView(next));
};

const goTo = (index: number) => {
  transitionName.value = index > currentIndex.value ? "slide-left" : "slide-right";
  currentIndex.value = index;
  nextTick(() => scrollThumbIntoView(index));
};

const onTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY;
  isDragging.value = true;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  dragY.value = e.touches[0].clientY - touchStartY.value;
};

const onTouchEnd = async (e: TouchEvent) => {
  isDragging.value = false;
  const delta = touchStartY.value - e.changedTouches[0].clientY;

  if (Math.abs(delta) > 80 && images.value.length > 1) {
    const dir = delta > 0 ? 1 : -1;
    const next = (currentIndex.value + dir + images.value.length) % images.value.length;

    // 1. Partir hors écran dans le sens du geste
    dragY.value = dir > 0 ? -window.innerHeight : window.innerHeight;

    await new Promise(r => setTimeout(r, 220));

    // 2. Téléporter la nouvelle photo du côté opposé (sans transition)
    noTransition.value = true;
    currentIndex.value = next;
    dragY.value = dir > 0 ? window.innerHeight : -window.innerHeight;
    nextTick(() => scrollThumbIntoView(next));

    await nextTick();

    // 3. Glisser vers le centre
    noTransition.value = false;
    requestAnimationFrame(() => { dragY.value = 0; });
  } else {
    // Revenir au centre
    dragY.value = 0;
  }
};

const handleClose = () => {
  close();
  emit("close");
};

// Keyboard navigation
useEventListener("keydown", (e: KeyboardEvent) => {
  if (!showModal.value) return;
  if (e.key === "Escape") { handleClose(); return; }
  if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(1); }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(-1); }
});

const loadImages = async () => {
  if (props.items && props.items.length > 0) {
    images.value = props.items.map((item, i) => ({
      id: item.id || `item-${i}`,
      category_id: "",
      filename: "",
      original_filename: "",
      mime_type: "image/jpeg",
      file_size: 0,
      storage_path: "",
      public_url: item.public_url,
      caption: item.caption,
      sort_order: i,
      created_at: "",
      updated_at: "",
    }));
    return;
  }
  if (!props.categoryId) return;
  loading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data: HomepageInspirationImage[] }>(
      `/api/inspirations/${props.categoryId}`
    );
    images.value = res.data || [];
  } catch {
    images.value = [];
  } finally {
    loading.value = false;
  }
};

let savedScrollY = 0;

const lockScroll = () => {
  if (!import.meta.client) return;
  savedScrollY = window.scrollY;
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = "100%";
};

const unlockScroll = () => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, savedScrollY);
};

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      currentIndex.value = props.startIndex || 0;
      images.value = [];
      open();
      lockScroll();
      await nextTick();
      await loadImages();
      await nextTick();
      scrollThumbIntoView(currentIndex.value);
    } else {
      close();
      unlockScroll();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  images.value = [];
  unlockScroll();
});
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to  { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to  { opacity: 0; transform: translateX(40px); }

.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from { opacity: 0; transform: translateY(40px); }
.slide-up-leave-to  { opacity: 0; transform: translateY(-40px); }
.slide-down-enter-from { opacity: 0; transform: translateY(-40px); }
.slide-down-leave-to  { opacity: 0; transform: translateY(40px); }

div::-webkit-scrollbar { display: none; }
</style>
