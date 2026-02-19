<template>
  <div class="rounded-[1.5rem] bg-white p-5">
    <div class="flex items-center justify-between mb-4">
      <h2
        class="font-heading text-sm text-dark/50
          uppercase tracking-wider"
      >
        {{ $t("dashboard.client_inspirations_title") }}
      </h2>
      <Tag v-if="inspirations.length > 0" variant="info">
        {{ inspirations.length }}
      </Tag>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-8 text-center">
      <IconLucid
        name="Loader2"
        size="sm"
        class="animate-spin mx-auto text-dark/30"
      />
    </div>

    <!-- Grid -->
    <div
      v-else-if="inspirations.length > 0"
      class="grid grid-cols-3 gap-2"
    >
      <button
        v-for="item in inspirations"
        :key="item.id"
        @click="previewItem = item"
        class="rounded-lg overflow-hidden aspect-square"
      >
        <img
          :src="item.public_url"
          :alt="item.caption || item.original_filename"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </button>
    </div>

    <!-- Empty -->
    <p
      v-else
      class="text-dark/30 text-sm text-center py-4"
    >
      {{ $t("dashboard.client_inspirations_empty") }}
    </p>

    <!-- Preview modal -->
    <BaseModal
      :isOpen="!!previewItem"
      :title="previewItem?.caption || previewItem?.original_filename || ''"
      :showCloseButton="true"
      :closeButtonText="$t('common.close')"
      @close="previewItem = null"
    >
      <div v-if="previewItem" class="text-center">
        <img
          :src="previewItem.public_url"
          :alt="previewItem.caption || ''"
          class="max-w-full max-h-[60vh] mx-auto
            rounded-xl object-contain"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { ClientInspiration } from "~/server/utils/client-portal-types";

defineProps<{
  inspirations: ClientInspiration[];
  loading: boolean;
}>();

const previewItem = ref<ClientInspiration | null>(null);
</script>
