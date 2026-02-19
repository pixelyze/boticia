<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      gap-4"
  >
    <InspirationCard
      v-for="item in inspirations"
      :key="item.id"
      :inspiration="item"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ClientInspiration } from "~/server/utils/client-portal-types";

defineProps<{
  inspirations: ClientInspiration[];
}>();

defineEmits<{
  (e: "delete", id: string): void;
}>();
</script>
