<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10 max-w-2xl">
        <h1 class="text-2xl font-bold mb-2">{{ t("dashboard.blockquote_title") }}</h1>
        <p class="text-dark/40 mb-8">{{ t("dashboard.blockquote_desc") }}</p>

        <!-- Current image -->
        <div class="mb-6">
          <div class="relative w-full h-64 rounded-2xl overflow-hidden bg-cream">
            <img
              v-if="currentImage"
              :src="currentImage"
              alt="Photo citation"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <IconLucid name="Image" size="lg" class="text-dark/20" />
            </div>
          </div>
        </div>

        <!-- Upload -->
        <label
          class="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all"
        >
          <IconLucid
            v-if="uploading"
            name="Loader2"
            size="xs"
            class="animate-spin"
          />
          <IconLucid v-else name="Upload" size="xs" />
          {{ uploading ? t("common.loading") : t("dashboard.blockquote_upload") }}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            :disabled="uploading"
            @change="handleUpload"
          />
        </label>

        <p v-if="success" class="text-green-600 text-sm mt-3">{{ t("dashboard.blockquote_success") }}</p>
        <p v-if="error" class="text-red-500 text-sm mt-3">{{ error }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
});

const { t } = useI18n();
const { adminFetch } = useAdminFetch();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = t("dashboard.blockquote_title");

useHead({
  title: t("dashboard.blockquote_title") + " - Boticia",
});

const currentImage = ref("");
const uploading = ref(false);
const success = ref(false);
const error = ref("");

// Fetch current image
onMounted(async () => {
  try {
    const res = await $fetch<{ data: { value: any } }>("/api/cms/config", {
      params: { key: "blockquote_image" },
    });
    if (res.data?.value?.url) {
      currentImage.value = res.data.value.url;
    }
  } catch {
    // Default image
  }
});

const handleUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploading.value = true;
  success.value = false;
  error.value = "";

  try {
    // Upload to storage via CMS logos endpoint (reuse existing upload)
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await adminFetch<{ success: boolean; data: { path: string; url: string } }>("/api/cms/logos/upload", {
      method: "POST",
      body: formData,
    });

    if (uploadRes?.data?.url) {
      // Save URL in config
      await adminFetch("/api/cms/config", {
        method: "POST",
        body: {
          key: "blockquote_image",
          category: "homepage",
          value: { url: uploadRes.data.url },
        },
      });
      currentImage.value = uploadRes.data.url;
      success.value = true;
    }
  } catch (err: any) {
    error.value = err?.message || "Erreur lors de l'upload";
  } finally {
    uploading.value = false;
    input.value = "";
  }
};
</script>
