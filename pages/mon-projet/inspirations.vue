<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="pt-4 pb-12 md:pt-6 md:pb-16">
      <div class="px-4 md:px-10">
        <div
          class="rounded-[2rem] border-2 border-dark/10
            p-8 md:p-10"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between mb-8"
          >
            <div>
              <h1 class="text-2xl md:text-3xl font-bold">
                {{ t("client.inspirations_title") }}
              </h1>
              <p
                v-if="inspirations.length > 0"
                class="text-dark/40 text-sm mt-1"
              >
                {{ inspirations.length }} / {{ MAX_PHOTOS }}
                {{ t("client.inspirations_count") }}
              </p>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="py-16 text-center">
            <IconLucid
              name="Loader2"
              size="lg"
              class="animate-spin mx-auto text-gray-300"
            />
          </div>

          <template v-else>
            <!-- Upload zone -->
            <InspirationUploadZone
              v-if="inspirations.length < MAX_PHOTOS"
              :uploading="uploading"
              class="mb-8"
              @upload="handleUpload"
            />

            <!-- Error message -->
            <p
              v-if="uploadError"
              class="text-red-500 text-sm mb-4"
            >
              {{ uploadError }}
            </p>

            <!-- Grid -->
            <InspirationGrid
              v-if="inspirations.length > 0"
              :inspirations="inspirations"
              @delete="handleDelete"
            />

            <!-- Empty state -->
            <div
              v-else
              class="py-16 text-center"
            >
              <IconLucid
                name="ImagePlus"
                size="lg"
                class="mx-auto text-gray-300 mb-4"
              />
              <p class="text-dark/40 max-w-sm mx-auto">
                {{ t("client.inspirations_empty") }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ClientInspiration } from "~/server/utils/client-portal-types";

definePageMeta({
  ssr: false,
  layout: "client",
  middleware: ["auth-client"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();
const { clientFetch } = useClientFetch();
const { compress } = useImageCompression();

const MAX_PHOTOS = 20;

useHead({
  title: t("client.inspirations_title") + " - Boticia",
});

watch(
  user,
  (val) => {
    if (val === null) {
      router.push(localePath("/login"));
    }
  },
  { immediate: true }
);

const loading = ref(true);
const uploading = ref(false);
const uploadError = ref("");
const inspirations = ref<ClientInspiration[]>([]);

const fetchInspirations = async () => {
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
};

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
        err?.data?.message ||
        t("client.inspirations_upload_error");
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
    inspirations.value = inspirations.value.filter(
      (i) => i.id !== id
    );
  } catch (err) {
    console.error("Error deleting:", err);
  }
};

onMounted(fetchInspirations);
</script>
