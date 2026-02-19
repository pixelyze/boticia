<template>
  <span :class="tagClasses">
    <IconLucid
      v-if="icon"
      :name="icon"
      size="xs"
      :strokeWidth="2"
    />
    <span><slot /></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'violet' | 'selection' | 'completed';

interface Props {
  variant?: TagVariant;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const tagClasses = computed(() => {
  const base = 'inline-flex items-center gap-1.5 font-medium px-3 py-1 text-sm rounded-full';

  const variantClasses: Record<TagVariant, string> = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-black text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-purple-100 text-purple-800',
    violet: 'bg-purple-100 text-purple-800',
    selection: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-800',
  };

  return `${base} ${variantClasses[props.variant]}`;
});
</script>
