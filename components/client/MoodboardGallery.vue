<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      gap-4"
  >
    <MoodboardCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @preview="$emit('preview', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

defineProps<{
  items: MoodboardItem[];
}>();

defineEmits<{
  (e: "preview", item: MoodboardItem): void;
}>();
</script>
