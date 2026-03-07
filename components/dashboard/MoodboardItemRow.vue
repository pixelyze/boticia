<template>
  <div
    class="flex items-center gap-3 px-3 py-2.5 rounded-xl
      border-2 border-gray-200 bg-white"
  >
    <!-- Thumbnail / icon -->
    <div
      class="w-10 h-10 rounded-lg overflow-hidden
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
        class="text-dark/60"
      />
      <IconLucid
        v-else
        name="ImageIcon"
        size="sm"
        class="text-dark/60"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-dark truncate">
        {{
          item.title
            || item.original_filename
            || "Item"
        }}
      </p>
      <p class="text-xs text-dark/60">
        {{ item.item_type === "pdf" ? "PDF" : "Image" }}
        <span v-if="item.file_size" class="text-dark/40">
          · {{ formatSize(item.file_size) }}
        </span>
      </p>
    </div>

    <!-- Delete -->
    <button
      @click="$emit('delete', item.id)"
      class="w-8 h-8 rounded-full flex items-center
        justify-center shrink-0 text-dark/40
        hover:text-red-500 active:text-red-600
        transition-colors"
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

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};
</script>
