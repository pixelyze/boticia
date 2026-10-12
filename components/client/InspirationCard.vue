<template>
  <div class="group relative rounded-2xl overflow-hidden border-2 border-dark/10">
    <img
      :src="inspiration.public_url"
      :alt="inspiration.caption || inspiration.original_filename"
      class="w-full aspect-square object-cover"
      loading="lazy"
    />
    <!-- Overlay au survol ; sur écran tactile (pas de survol), seul le
         bouton de suppression reste visible, sans assombrir la photo. -->
    <div
      class="absolute inset-0 transition-colors flex items-end
        justify-between p-3
        [@media(hover:hover)]:opacity-0
        [@media(hover:hover)]:group-hover:opacity-100
        [@media(hover:hover)]:group-hover:bg-black/40"
    >
      <span
        v-if="inspiration.caption"
        class="text-white text-sm truncate mr-2 hidden
          [@media(hover:hover)]:block"
      >
        {{ inspiration.caption }}
      </span>
      <ConfirmDeleteButton
        position-class="shrink-0 ml-auto"
        class="w-8 h-8 rounded-full bg-white/90 flex items-center
          justify-center hover:bg-red-500
          hover:text-white transition-colors"
        @confirm="$emit('delete', inspiration.id)"
      >
        <IconLucid name="Trash2" size="xs" :strokeWidth="2" />
      </ConfirmDeleteButton>
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
