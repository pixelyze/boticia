<template>
  <!-- NuxtLink for internal navigation -->
  <NuxtLink
    v-if="to"
    :to="to"
    :class="buttonClasses"
    @click="handleClick"
  >
    <IconLucid
      v-if="loading"
      name="Loader2"
      :size="iconOnly ? 'sm' : 'md'"
      class="animate-spin"
    />
    <IconLucid
      v-else-if="icon"
      :name="icon"
      :size="iconOnly ? 'sm' : 'md'"
      :strokeWidth="2"
    />
    <span v-if="!iconOnly"><slot /></span>
    <IconLucid
      v-if="rightIcon && !iconOnly && !loading"
      :name="rightIcon"
      size="md"
      :strokeWidth="2"
    />
  </NuxtLink>

  <!-- External link -->
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :class="buttonClasses"
    @click="handleClick"
  >
    <IconLucid
      v-if="loading"
      name="Loader2"
      :size="iconOnly ? 'sm' : 'md'"
      class="animate-spin"
    />
    <IconLucid
      v-else-if="icon"
      :name="icon"
      :size="iconOnly ? 'sm' : 'md'"
      :strokeWidth="2"
    />
    <span v-if="!iconOnly"><slot /></span>
    <IconLucid
      v-if="rightIcon && !iconOnly && !loading"
      :name="rightIcon"
      size="md"
      :strokeWidth="2"
    />
  </a>

  <!-- Standard button -->
  <button
    v-else
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <IconLucid
      v-if="loading"
      name="Loader2"
      :size="iconOnly ? 'sm' : 'md'"
      class="animate-spin"
    />
    <IconLucid
      v-else-if="icon"
      :name="icon"
      :size="iconOnly ? 'sm' : 'md'"
      :strokeWidth="2"
    />
    <span v-if="!iconOnly"><slot /></span>
    <IconLucid
      v-if="rightIcon && !iconOnly && !loading"
      :name="rightIcon"
      size="md"
      :strokeWidth="2"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

interface Props {
  icon?: string;
  rightIcon?: string;
  disabled?: boolean;
  iconOnly?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: "default" | "primary" | "ghost";
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  iconOnly: false,
  loading: false,
  variant: "default",
});

const emit = defineEmits(["click"]);

const attrs = useAttrs();

const isFullWidth = computed(() => {
  const classes = attrs.class as string | string[] | undefined;
  if (!classes) return false;
  const classString = Array.isArray(classes) ? classes.join(" ") : classes;
  return classString.includes("w-full");
});

const layoutClasses = computed(() => {
  if (isFullWidth.value && props.rightIcon && !props.iconOnly && !props.loading) {
    return "justify-between";
  }
  return "";
});

const buttonClasses = computed(() => [
  "rounded-full border-2 transition-all duration-300 inline-flex items-center",
  layoutClasses.value,
  isFullWidth.value && props.rightIcon && !props.iconOnly && !props.loading ? "" : "gap-2",
  props.variant === "primary"
    ? props.disabled || props.loading
      ? "bg-dark/30 text-cream border-transparent cursor-not-allowed"
      : "bg-dark text-cream border-dark hover:bg-dark/80"
    : props.variant === "ghost"
      ? props.disabled || props.loading
        ? "text-dark/30 cursor-not-allowed border-transparent bg-transparent"
        : "text-dark border-transparent hover:bg-dark/5"
      : props.disabled || props.loading
        ? "bg-cream text-dark/30 border-transparent cursor-not-allowed"
        : "bg-cream text-dark/70 border-transparent hover:border-dark/15 hover:text-dark",
  props.iconOnly ? "p-2 rounded-full" : "px-8 py-3 font-medium",
  attrs.class,
]);

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
