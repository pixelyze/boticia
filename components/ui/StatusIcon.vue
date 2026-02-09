<template>
  <div class="inline-block">
    <div class="relative" :class="containerClasses">
      <!-- Ombre décalée -->
      <div
        :class="[
          'absolute bg-gray-400',
          sizeClasses,
          shadowOffset
        ]"
      />
      <!-- Carré principal -->
      <div
        :class="[
          'relative bg-black flex items-center justify-center',
          sizeClasses
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :width="iconPixelSize"
          :height="iconPixelSize"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path v-if="type === 'success'" d="M20 6 9 17l-5-5" />
          <template v-else-if="type === 'error'">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </template>
          <template v-else-if="type === 'warning'">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </template>
          <template v-else>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </template>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type: "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "lg",
});

// Taille du conteneur parent (pour l'espace de l'ombre)
const containerClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-14 h-14"; // 56px
    case "md":
      return "w-20 h-20"; // 80px
    case "lg":
    default:
      return "w-26 h-26"; // 104px
  }
});

// Taille du carré
const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-12 h-12"; // 48px
    case "md":
      return "w-16 h-16"; // 64px
    case "lg":
    default:
      return "w-24 h-24"; // 96px
  }
});

// Offset de l'ombre
const shadowOffset = computed(() => {
  switch (props.size) {
    case "sm":
      return "top-1.5 left-1.5";
    case "md":
      return "top-2 left-2";
    case "lg":
    default:
      return "top-2 left-2";
  }
});

// Taille de l'icône en pixels
const iconPixelSize = computed(() => {
  switch (props.size) {
    case "sm":
      return 24;
    case "md":
      return 32;
    case "lg":
    default:
      return 40;
  }
});
</script>
