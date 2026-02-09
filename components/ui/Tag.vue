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
  const base = 'inline-flex items-center gap-1.5 font-medium px-2 py-0.5 text-xs';

  const variantClasses: Record<TagVariant, string> = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    primary: 'bg-black text-white border-black',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    violet: 'bg-purple-100 text-purple-800 border-purple-300',
    selection: 'bg-amber-100 text-amber-800 border-amber-300',
    completed: 'bg-green-200 text-green-900 border-green-400',
  };

  return `${base} ${variantClasses[props.variant]} border`;
});
</script>
