<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

interface Props {
  variant?: "standard" | "warning" | "success" | "muted" | "featured";
  noShadow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "standard",
  noShadow: false,
});

const attrs = useAttrs();

const cardClasses = computed(() => {
  const base = "border-2 p-6 transition-all";

  const variants = {
    standard: "bg-white border-black",
    warning: "bg-yellow-50 border-yellow-400",
    success: "bg-green-50 border-green-500",
    muted: "bg-gray-50 border-gray-300",
    featured: "bg-white border-black border-4",
  };

  const shadow = props.noShadow ? "" : "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";

  // Custom classes from parent (to allow overriding padding, margins, etc.)
  const customClasses = attrs.class || "";

  return `${base} ${variants[props.variant]} ${shadow} ${customClasses}`;
});
</script>
