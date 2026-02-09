<template>
  <div>
    <!-- Prix avec détail (total) -->
    <div
      v-if="showBreakdown"
      class="mt-6 pt-6"
      :class="showBorder ? 'border-t-2 border-black' : ''"
    >
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">{{ label }}</span>
        <span class="text-2xl font-bold">{{ price }} €</span>
      </div>
      <p v-if="breakdown" class="text-sm text-gray-600 mt-2">
        {{ breakdown }}
      </p>
    </div>

    <!-- Prix simple -->
    <div v-else class="mt-4">
      <p class="text-3xl font-bold text-black">{{ price }} €</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  price: number | string;
  label?: string;
  breakdown?: string;
  showBreakdown?: boolean;
  showBorder?: boolean;
}>(), {
  showBorder: false
});
</script>
