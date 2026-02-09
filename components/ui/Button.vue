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
  "px-4 py-2 border-2 transition-all inline-flex items-center",
  layoutClasses.value,
  isFullWidth.value && props.rightIcon && !props.iconOnly && !props.loading ? "" : "gap-2",
  props.variant === "primary"
    ? props.disabled || props.loading
      ? "bg-cream text-dark/30 border-cream cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(43,43,43,0.1)] translate-x-[2px] translate-y-[2px]"
      : "bg-dark text-white hover:bg-dark/80 border-dark shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(43,43,43,0.5)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
    : props.variant === "ghost"
      ? props.disabled || props.loading
        ? "text-dark/30 cursor-not-allowed border-transparent bg-transparent"
        : "text-dark bg-dark/10 border-transparent hover:bg-dark/20 shadow-none"
      : props.disabled || props.loading
        ? "bg-white text-dark/30 border-dark/10 cursor-not-allowed"
        : "bg-white text-dark border-dark",
  !props.disabled && !props.loading && props.variant === "primary"
    ? ""
    : !props.disabled && !props.loading && props.variant === "ghost"
      ? ""
      : !props.disabled && !props.loading
        ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        : "",
  props.iconOnly ? "p-2" : "px-6 py-3 font-medium",
  attrs.class,
]);

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
