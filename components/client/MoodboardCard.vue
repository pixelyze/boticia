<template>
  <div
    class="rounded-2xl border-2 border-dark/10 overflow-hidden
      transition-all hover:border-dark/20"
  >
    <!-- Image -->
    <template v-if="item.item_type === 'image'">
      <img
        :src="item.public_url"
        :alt="item.title || item.original_filename"
        class="w-full aspect-square object-cover cursor-pointer"
        loading="lazy"
        @click="$emit('preview', item)"
      />
      <div v-if="item.title" class="px-4 py-3">
        <p class="text-sm font-medium text-dark truncate">
          {{ item.title }}
        </p>
      </div>
    </template>

    <!-- PDF -->
    <template v-else-if="item.item_type === 'pdf'">
      <div class="p-6 flex flex-col items-center gap-3">
        <div
          class="w-14 h-14 rounded-full bg-cream flex items-center
            justify-center"
        >
          <IconLucid
            name="FileText"
            size="md"
            class="text-dark/40"
          />
        </div>
        <p class="text-sm font-medium text-dark text-center">
          {{ item.title || item.original_filename }}
        </p>
        <a
          :href="item.public_url"
          target="_blank"
          rel="noopener"
          class="text-sm text-dark/60 underline
            hover:text-dark transition-colors"
        >
          {{ $t("client.moodboard_download") }}
        </a>
      </div>
    </template>

    <!-- Link -->
    <template v-else-if="item.item_type === 'link'">
      <div class="p-6 flex flex-col items-center gap-3">
        <div
          class="w-14 h-14 rounded-full bg-cream flex items-center
            justify-center"
        >
          <IconLucid
            name="ExternalLink"
            size="md"
            class="text-dark/40"
          />
        </div>
        <p class="text-sm font-medium text-dark text-center">
          {{ item.title || $t("client.moodboard_link") }}
        </p>
        <a
          :href="item.external_url"
          target="_blank"
          rel="noopener"
          class="text-sm text-dark/60 underline
            hover:text-dark transition-colors"
        >
          {{ $t("client.moodboard_open_link") }}
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

defineProps<{
  item: MoodboardItem;
}>();

defineEmits<{
  (e: "preview", item: MoodboardItem): void;
}>();
</script>
