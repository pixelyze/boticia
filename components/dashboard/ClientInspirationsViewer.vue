<template>
  <div class="rounded-xl bg-white p-4">
    <div class="flex items-center justify-between mb-4">
      <h2
        class="font-heading text-sm text-dark/60
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
        class="animate-spin mx-auto text-dark/50"
      />
    </div>

    <!-- Thumbnails grid -->
    <div
      v-else-if="inspirations.length > 0"
      class="grid grid-cols-3 gap-1.5 cursor-pointer"
      @click="galleryOpen = true"
    >
      <div
        v-for="(item, idx) in visibleItems"
        :key="item.id"
        class="relative rounded-xl overflow-hidden aspect-square
          ring-1 ring-dark/5 hover:ring-fuchsia-300
          transition-all"
      >
        <img
          :src="item.public_url"
          :alt="item.caption || item.original_filename"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          v-if="idx === MAX_VISIBLE - 1 && remainingCount > 0"
          class="absolute inset-0 bg-dark/50 flex items-center
            justify-center"
        >
          <span class="text-white font-bold text-lg">
            +{{ remainingCount }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty placeholders -->
    <div v-else class="grid grid-cols-3 gap-1.5">
      <div
        v-for="n in 3"
        :key="n"
        class="rounded-xl aspect-square bg-cream/60 border-2
          border-dashed border-dark/10 flex items-center
          justify-center"
      >
        <IconLucid name="Image" size="sm" class="text-dark/20" />
      </div>
    </div>

    <!-- Gallery modal with masonry -->
    <BaseModal
      :isOpen="galleryOpen"
      :title="$t('dashboard.client_inspirations_title')"
      :showCloseButton="true"
      :closeButtonText="$t('common.close')"
      @close="galleryOpen = false"
    >
      <div class="columns-2 sm:columns-3 gap-3 space-y-3">
        <div
          v-for="item in inspirations"
          :key="item.id"
          class="rounded-xl overflow-hidden ring-1 ring-dark/5
            break-inside-avoid"
        >
          <img
            :src="item.public_url"
            :alt="item.caption || item.original_filename"
            class="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { ClientInspiration } from "~/server/utils/client-portal-types";

const props = defineProps<{
  inspirations: ClientInspiration[];
  loading: boolean;
}>();

const MAX_VISIBLE = 3;
const galleryOpen = ref(false);

const visibleItems = computed(() =>
  props.inspirations.slice(0, MAX_VISIBLE)
);

const remainingCount = computed(
  () => props.inspirations.length - MAX_VISIBLE
);
</script>
