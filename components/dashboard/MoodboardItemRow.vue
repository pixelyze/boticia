<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-xl
      border-2 border-dark/10 group"
  >
    <IconLucid
      name="GripVertical"
      size="sm"
      class="text-dark/20 shrink-0 cursor-grab"
    />

    <!-- Thumbnail / icon -->
    <div
      class="w-12 h-12 rounded-lg overflow-hidden
        bg-cream shrink-0 flex items-center justify-center"
    >
      <img
        v-if="item.item_type === 'image' && item.public_url"
        :src="item.public_url"
        class="w-full h-full object-cover"
      />
      <IconLucid
        v-else-if="item.item_type === 'pdf'"
        name="FileText"
        size="sm"
        class="text-dark/40"
      />
      <IconLucid
        v-else
        name="ExternalLink"
        size="sm"
        class="text-dark/40"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-dark truncate">
        {{ item.title || item.original_filename || item.external_url || "Item" }}
      </p>
      <p class="text-xs text-dark/40">
        {{ item.item_type }}
      </p>
    </div>

    <!-- Delete -->
    <button
      @click="$emit('delete', item.id)"
      class="w-8 h-8 rounded-full flex items-center
        justify-center opacity-0 group-hover:opacity-100
        transition-opacity text-dark/30
        hover:text-red-500"
    >
      <IconLucid name="Trash2" size="xs" :strokeWidth="2" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

defineProps<{
  item: MoodboardItem;
}>();

defineEmits<{
  (e: "delete", id: string): void;
}>();
</script>
