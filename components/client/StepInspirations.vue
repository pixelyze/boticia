<template>
  <div>
    <div v-if="loading" class="py-6">
      <IconLucid name="Loader2" size="md" class="animate-spin text-gray-400" />
    </div>

    <template v-else>
      <p v-if="inspirations.length > 0" class="text-gray-600 text-sm mb-4">
        {{ inspirations.length }} / {{ MAX_PHOTOS }}
        {{ t("client.inspirations_count") }}
      </p>

      <InspirationUploadZone
        v-if="inspirations.length < MAX_PHOTOS"
        :uploading="uploading"
        class="mb-6"
        @upload="handleUpload"
      />

      <p v-if="uploadError" class="text-red-500 text-sm mb-4">
        {{ uploadError }}
      </p>

      <InspirationGrid
        v-if="inspirations.length > 0"
        :inspirations="inspirations"
        @delete="handleDelete"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ClientInspiration } from "~/server/utils/client-portal-types";

// Repris de l'ancien onglet Inspirations : mêmes composants, mêmes API.
const emit = defineEmits<{ (e: "count", value: number): void }>();

const { t } = useI18n();
const { clientFetch } = useClientFetch();
const { compress } = useImageCompression();

const MAX_PHOTOS = 20;

const loading = ref(true);
const uploading = ref(false);
const uploadError = ref("");
const inspirations = ref<ClientInspiration[]>([]);

watch(
  () => inspirations.value.length,
  (n) => emit("count", n)
);

const handleUpload = async (files: File[]) => {
  uploading.value = true;
  uploadError.value = "";

  for (const rawFile of files) {
    if (inspirations.value.length >= MAX_PHOTOS) break;

    try {
      const file = await compress(rawFile);
      const formData = new FormData();
      formData.append("file", file);

      const res = await clientFetch<{
        success: boolean;
        data: ClientInspiration;
      }>("/api/client/inspirations", {
        method: "POST",
        body: formData,
      });

      if (res.data) {
        inspirations.value.unshift(res.data);
      }
    } catch (err: any) {
      uploadError.value =
        err?.data?.message || t("client.inspirations_upload_error");
      setTimeout(() => {
        uploadError.value = "";
      }, 5000);
    }
  }

  uploading.value = false;
};

const handleDelete = async (id: string) => {
  try {
    await clientFetch(`/api/client/inspirations/${id}`, {
      method: "DELETE",
    });
    inspirations.value = inspirations.value.filter((i) => i.id !== id);
  } catch (err) {
    console.error("Error deleting:", err);
  }
};

onMounted(async () => {
  try {
    const res = await clientFetch<{
      success: boolean;
      data: ClientInspiration[];
    }>("/api/client/inspirations");
    inspirations.value = res.data;
  } catch (err) {
    console.error("Error loading inspirations:", err);
  } finally {
    loading.value = false;
  }
});
</script>
