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
    <div
      ref="containerRef"
      class="absolute overflow-hidden"
      :class="
        compact
          ? 'inset-x-0 bottom-0'
          : 'inset-x-0 top-[32px] bottom-0'
      "
    >
      <Transition
        v-bind="contentTransition"
        @after-enter="resetContainerScroll"
        @after-leave="onTransitionComplete"
      >
        <div
          v-if="showModal"
          ref="modalRef"
          class="bg-white w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black transform rounded-t-3xl flex flex-col"
          :class="modalClasses"
          role="dialog"
          aria-modal="true"
        >
          <!-- Swipeable area (drag bar + header) -->
          <div
            ref="dragHandleRef"
            class="flex-shrink-0 relative"
            @touchstart="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
          >
            <!-- Drag bar -->
            <div class="h-12 flex items-center justify-center touch-none">
              <div class="w-12 h-1.5 rounded-full bg-dark/10" />
            </div>

            <!-- Croix de fermeture (optionnelle) : loin du bouton d'action
                 en bas, pour ne pas le confondre avec « Enregistrer ». -->
            <Button
              v-if="showCloseIcon"
              type="button"
              icon="X"
              iconOnly
              class="!absolute top-3 right-3 md:top-4 md:right-4"
              :aria-label="$t('common.close')"
              @touchstart.stop
              @click="onCancel"
            />

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
            <div class="w-full h-[1px] bg-dark/5"></div>
          </div>

          <!-- Scrollable content -->
          <div class="flex-grow overflow-y-auto scroll-area">
            <div
              class="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 text-gray-800"
              :class="compact ? 'md:max-w-md pb-8' : 'pb-24'"
            >
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
    showCloseIcon?: boolean;
    compact?: boolean;
  }>(),
  {
    compact: false,
    uppercase: false,
    showCloseButton: true,
    showCloseIcon: false,
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
const containerRef = ref<HTMLElement | null>(null);

// Un champ qui prend le focus pendant la glissade d'ouverture fait défiler
// ce conteneur (overflow-hidden) : la fenêtre restait décalée vers le haut.
// Une fois ouverte, on la remet à sa place.
// Le champ marqué data-autofocus reçoit le curseur à ce moment-là, sans
// défilement (à utiliser à la place de l'attribut autofocus).
const resetContainerScroll = () => {
  if (containerRef.value) containerRef.value.scrollTop = 0;
  modalRef.value
    ?.querySelector<HTMLElement>("[data-autofocus]")
    ?.focus({ preventScroll: true });
};
const dragHandleRef = ref<HTMLElement | null>(null);

// compact : la fenêtre s'ouvre par le bas mais ne prend que la hauteur de
// son contenu (petite confirmation).
const modalClasses = computed(() =>
  props.compact ? "max-h-[85dvh]" : "h-full"
);

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

<style>
.modal-slide-enter {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.modal-slide-leave {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
</style>

<style scoped>
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
