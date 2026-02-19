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
              {{ $t("stories." + categorySlug) }}
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
  categorySlug: string;
  categoryId: string;
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

const fetchImages = async () => {
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

  // Auto-close if empty
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
      currentIndex.value = 0;
      images.value = [];
      open();
      await nextTick();
      await fetchImages();
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
