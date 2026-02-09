<template>
  <Teleport to="body">
  <div v-if="modalIsOpen" class="fixed inset-0 z-[100]" @keydown.esc="onCancel">
    <!-- Overlay -->
    <Transition v-bind="overlayTransition">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        @click="onCancel"
      />
    </Transition>
    <div class="absolute inset-x-0 top-[64px] bottom-0 overflow-hidden">
      <Transition
        v-bind="contentTransition"
        @after-leave="onTransitionComplete"
      >
        <div
          v-if="showModal"
          ref="modalRef"
          class="bg-white w-full h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black transform rounded-t-3xl flex flex-col"
          :class="modalClasses"
          role="dialog"
          aria-modal="true"
        >
          <!-- Swipeable area (drag bar + header) -->
          <div
            ref="dragHandleRef"
            class="flex-shrink-0"
            @touchstart="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
          >
            <!-- Drag bar -->
            <div class="h-12 flex items-center justify-center touch-none">
              <div class="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>

            <!-- Title -->
            <h3
              class="text-xl md:text-2xl font-bold text-center leading-tight max-w-4xl mx-auto px-2 md:px-4"
              :class="[
                { 'uppercase': uppercase },
                subtitle ? 'mb-2' : 'mb-4 md:mb-6'
              ]"
              >
              {{ title }}
            </h3>

            <!-- Subtitle (optional) -->
            <p
              v-if="subtitle"
              class="mb-4 md:mb-6 text-gray-600 text-center text-lg md:text-xl max-w-4xl mx-auto px-2 md:px-4"
            >
              {{ subtitle }}
            </p>

            <!-- Separator -->
            <div class="w-full h-[2px] bg-gray-200"></div>
          </div>

          <!-- Scrollable content -->
          <div class="flex-grow overflow-y-auto scroll-area">
            <div class="max-w-4xl mx-auto px-2 md:px-4 py-6 pb-24 space-y-6 text-gray-800">
              <slot :close="onCancel" />

              <!-- Close button (optional) -->
              <div v-if="showCloseButton" class="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                <Button @click="onCancel" class="md:w-auto">
                  {{ closeButtonText || $t("common.cancel") }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { onClickOutside, useEventListener } from "@vueuse/core";
import { useModal } from "~/composables/useModal";
import { useTouchGestures } from "~/composables/useTouchGestures";
import { useModalTransitions } from "~/composables/useModalTransitions";

const { overlayTransition, contentTransition, initialAnimationClass } =
  useModalTransitions();

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    uppercase?: boolean;
    showCloseButton?: boolean;
    closeButtonText?: string;
  }>(),
  {
    uppercase: false,
    showCloseButton: true,
  }
);

const emit = defineEmits<{ (e: "close"): void }>();

const {
  showModal,
  isOpen: modalIsOpen,
  open,
  close,
  onTransitionComplete,
} = useModal();

const modalRef = ref<HTMLElement | null>(null);
const dragHandleRef = ref<HTMLElement | null>(null);
const initialAnimation = ref(false);

const modalClasses = computed(() => ({
  ...initialAnimationClass,
  "animate-slide-up": initialAnimation.value,
}));

const handleCloseModal = () => {
  close();
  emit("close");
};

const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures(
  modalRef,
  handleCloseModal
);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      open();
      nextTick(() => {
        if (modalRef.value) {
          initialAnimation.value = true;
          setTimeout(() => {
            initialAnimation.value = false;
          }, 300);
        }
      });
    } else {
      close();
    }
  },
  { immediate: true }
);

const onCancel = () => {
  close();
  emit("close");
};

useEventListener(window, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape" && showModal.value) {
    onCancel();
  }
});

onClickOutside(modalRef, onCancel, { ignore: [] });
</script>

<style scoped>
.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

@keyframes slide-up {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
}

.scroll-area::-webkit-scrollbar {
  width: 6px;
}

.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
