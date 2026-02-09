<template>
  <div class="w-full bg-gray-200 h-3 shadow-[4px_4px_0px_0px_rgba(156,163,175,1)]">
    <div
      class="h-full bg-black transition-all duration-300"
      :style="{ width: `${clampedPercent}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
});

const clampedPercent = computed(() => {
  if (props.max === 0) return 0;
  const percent = (props.value / props.max) * 100;
  return Math.min(Math.max(percent, 0), 100);
});
</script>
