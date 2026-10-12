<template>
  <div>
    <div v-if="loading" class="py-6">
      <IconLucid name="Loader2" size="md" class="animate-spin text-gray-400" />
    </div>

    <template v-else>
      <!-- Mention discrète dès qu'il y a eu plusieurs envois -->
      <p v-if="version > 1" class="text-xs text-gray-600 mb-3">
        {{ t("client.document_version", { version }) }}
      </p>

      <!-- Florist note -->
      <div
        v-if="moodboardNote"
        class="rounded-[1.5rem] border-2 border-dark/10 p-6 mb-6"
      >
        <p class="text-xs text-gray-600 uppercase tracking-wider mb-2">
          {{ t("client.moodboard_florist_note") }}
        </p>
        <p class="text-dark whitespace-pre-line">{{ moodboardNote }}</p>
      </div>

      <MoodboardGallery
        v-if="items.length > 0"
        :items="items"
        @preview="openPreview"
      />
    </template>

    <!-- Preview modal -->
    <BaseModal
      :isOpen="!!previewItem"
      :title="previewItem?.title || ''"
      :showCloseButton="true"
      :closeButtonText="t('common.close')"
      @close="previewItem = null"
    >
      <div v-if="previewItem" class="text-center">
        <img
          :src="previewItem.public_url"
          :alt="previewItem.title || ''"
          class="max-w-full max-h-[60vh] mx-auto rounded-xl object-contain"
        />
        <p v-if="previewItem.description" class="text-gray-600 mt-4">
          {{ previewItem.description }}
        </p>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

// Repris de l'ancien onglet Moodboard : mêmes composants, même API.
const { t } = useI18n();
const { clientFetch } = useClientFetch();

const loading = ref(true);
const items = ref<MoodboardItem[]>([]);
const moodboardNote = ref("");
const previewItem = ref<MoodboardItem | null>(null);
// L'API ne renvoie que la dernière version envoyée.
const version = computed(() => items.value[0]?.version || 1);

const openPreview = (item: MoodboardItem) => {
  if (item.item_type === "image") {
    previewItem.value = item;
  }
};

onMounted(async () => {
  try {
    const res = await clientFetch<{
      success: boolean;
      data: MoodboardItem[];
      moodboardNote: string | null;
    }>("/api/client/moodboard");
    items.value = res.data;
    moodboardNote.value = res.moodboardNote || "";
  } catch (err) {
    console.error("Error loading moodboard:", err);
  } finally {
    loading.value = false;
  }
});
</script>
