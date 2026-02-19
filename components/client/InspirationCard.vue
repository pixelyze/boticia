<template>
  <div class="group relative rounded-2xl overflow-hidden border-2 border-dark/10">
    <img
      :src="inspiration.public_url"
      :alt="inspiration.caption || inspiration.original_filename"
      class="w-full aspect-square object-cover"
      loading="lazy"
    />
    <!-- Overlay on hover -->
    <div
      class="absolute inset-0 bg-black/0 group-hover:bg-black/40
        transition-colors flex items-end justify-between
        p-3 opacity-0 group-hover:opacity-100"
    >
      <span
        v-if="inspiration.caption"
        class="text-white text-sm truncate mr-2"
      >
        {{ inspiration.caption }}
      </span>
      <button
        @click.stop="$emit('delete', inspiration.id)"
        class="w-8 h-8 rounded-full bg-white/90 flex items-center
          justify-center shrink-0 hover:bg-red-500
          hover:text-white transition-colors"
      >
        <IconLucid name="Trash2" size="xs" :strokeWidth="2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientInspiration } from "~/server/utils/client-portal-types";

defineProps<{
  inspiration: ClientInspiration;
}>();

defineEmits<{
  (e: "delete", id: string): void;
}>();
</script>
