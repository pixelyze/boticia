<template>
  <Teleport to="body">
    <div v-if="modalIsOpen" class="fixed inset-0 z-[100]">
      <!-- Overlay with ambient background -->
      <Transition v-bind="overlayTransition">
        <div v-if="showModal" class="fixed inset-0 overflow-hidden">
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

      <!-- Content -->
      <Transition v-bind="contentTransition" @after-leave="onTransitionComplete">
        <div v-if="showModal" class="fixed inset-0 flex flex-col">

          <!-- Header -->
          <div class="flex-shrink-0 flex items-center justify-between px-4 h-14 z-10">
            <button
              class="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors"
              @click="handleClose"
            >
              <IconLucid name="X" size="md" color="currentColor" />
            </button>
            <span class="text-white font-semibold text-base truncate mx-4">
              {{ props.title }}
            </span>
            <span class="text-white/60 text-sm tabular-nums min-w-[3rem] text-right">
              <template v-if="images.length > 0">
                {{ currentIndex + 1 }}/{{ images.length }}
              </template>
            </span>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex-1 flex items-center justify-center">
            <IconLucid name="Loader2" size="lg" color="white" class="animate-spin" />
          </div>

          <!-- Empty -->
          <div v-else-if="images.length === 0" class="flex-1 flex items-center justify-center px-6">
            <p class="text-white/60 text-center text-lg">{{ $t("stories.gallery_empty") }}</p>
          </div>

          <!-- Main photo + nav -->
          <div
            v-else
            class="flex-1 relative flex items-center justify-center overflow-hidden min-h-0"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
          >
            <!-- Peek: photo précédente (mobile) -->
            <div
              v-if="currentIndex > 0"
              class="sm:hidden absolute top-0 inset-x-0 h-20 overflow-hidden pointer-events-none z-10"
            >
              <img
                :src="images[currentIndex - 1].public_url"
                class="w-full h-full object-cover brightness-[0.4]"
                aria-hidden="true"
              />
              <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
            </div>

            <!-- Peek: photo suivante (mobile) -->
            <div
              v-if="currentIndex < images.length - 1"
              class="sm:hidden absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none z-10"
            >
              <img
                :src="images[currentIndex + 1].public_url"
                class="w-full h-full object-cover brightness-[0.4]"
                aria-hidden="true"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <!-- Photo -->
            <Transition :name="transitionName" mode="out-in">
              <div :key="currentIndex" class="w-full h-full flex flex-col items-center justify-center px-16 py-20 sm:py-4">
                <img
                  :src="images[currentIndex].public_url"
                  :alt="images[currentIndex].caption || ''"
                  class="max-w-full max-h-full object-contain"
                />
                <p
                  v-if="images[currentIndex].caption"
                  class="text-white/60 text-sm text-center mt-3"
                >
                  {{ images[currentIndex].caption }}
                </p>
              </div>
            </Transition>

            <!-- Prev -->
            <button
              v-if="currentIndex > 0"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10
                     hidden sm:flex items-center justify-center rounded-full
                     bg-white/10 hover:bg-white/20 text-white transition-all"
              @click="go(-1)"
            >
              <IconLucid name="ChevronLeft" size="sm" color="currentColor" />
            </button>

            <!-- Next -->
            <button
              v-if="currentIndex < images.length - 1"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10
                     hidden sm:flex items-center justify-center rounded-full
                     bg-white/10 hover:bg-white/20 text-white transition-all"
              @click="go(1)"
            >
              <IconLucid name="ChevronRight" size="sm" color="currentColor" />
            </button>
          </div>

          <!-- Thumbnail strip (desktop only) -->
          <div
            v-if="images.length > 1"
            ref="thumbStripRef"
            class="flex-shrink-0 hidden sm:flex gap-2 overflow-x-auto px-4 py-3"
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

const { showModal, isOpen: modalIsOpen, open, close, onTransitionComplete } = useModal();

const loading = ref(false);
const images = ref<HomepageInspirationImage[]>([]);
const currentIndex = ref(0);
const transitionName = ref("slide-left");
const thumbStripRef = ref<HTMLElement | null>(null);
const touchStartX = ref(0);
const thumbRefs = ref<(HTMLElement | null)[]>([]);

const setThumbRef = (el: any, i: number) => {
  thumbRefs.value[i] = el as HTMLElement | null;
};

const scrollThumbIntoView = (index: number) => {
  const el = thumbRefs.value[index];
  if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
};

const go = (dir: 1 | -1) => {
  const next = currentIndex.value + dir;
  if (next < 0 || next >= images.value.length) return;
  transitionName.value = dir === 1 ? "slide-left" : "slide-right";
  currentIndex.value = next;
  nextTick(() => scrollThumbIntoView(next));
};

const goTo = (index: number) => {
  transitionName.value = index > currentIndex.value ? "slide-left" : "slide-right";
  currentIndex.value = index;
  nextTick(() => scrollThumbIntoView(index));
};

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientY;
};

const onTouchEnd = (e: TouchEvent) => {
  const delta = touchStartX.value - e.changedTouches[0].clientY;
  if (Math.abs(delta) < 50) return;
  transitionName.value = delta > 0 ? "slide-up" : "slide-down";
  const dir = delta > 0 ? 1 : -1;
  const next = currentIndex.value + dir;
  if (next < 0 || next >= images.value.length) return;
  currentIndex.value = next;
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

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      currentIndex.value = props.startIndex || 0;
      images.value = [];
      open();
      await nextTick();
      await loadImages();
      await nextTick();
      scrollThumbIntoView(currentIndex.value);
    } else {
      close();
    }
  },
  { immediate: true }
);

onUnmounted(() => { images.value = []; });
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
