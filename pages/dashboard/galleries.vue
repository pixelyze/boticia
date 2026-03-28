<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10">
        <!-- Loading -->
        <div v-if="loading" class="py-12 text-center">
          <IconLucid
            name="Loader2"
            size="lg"
            class="animate-spin mx-auto text-dark/30"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="galleries.length === 0"
          class="py-12 text-center text-dark/40"
        >
          {{ t("dashboard.galleries_empty") }}
        </div>

        <!-- Galleries list -->
        <div v-else class="space-y-6">
          <div
            v-for="gallery in galleries"
            :key="gallery.id"
            class="rounded-[1.5rem] border-2 border-dark/10
                   overflow-hidden"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-5
                     py-4 bg-cream/50"
            >
              <div>
                <h3 class="font-heading text-base text-dark">
                  {{ gallery.title }}
                </h3>
                <p
                  v-if="gallery.description"
                  class="text-sm text-dark/50 mt-0.5"
                >
                  {{ gallery.description }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span
                  v-if="imageCounts[gallery.id]"
                  class="text-sm text-dark/40"
                >
                  {{ imageCounts[gallery.id] }}
                  {{ t("dashboard.galleries_images") }}
                </span>
                <button
                  @click="togglePublish(gallery)"
                  class="px-3 py-1 rounded-full text-xs
                         font-semibold transition-all"
                  :class="
                    gallery.is_published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                  "
                >
                  {{
                    gallery.is_published
                      ? t("dashboard.galleries_published")
                      : t("dashboard.galleries_draft")
                  }}
                </button>
              </div>
            </div>

            <!-- Images grid -->
            <div class="p-5">
              <!-- Loading images -->
              <div
                v-if="loadingImages === gallery.id"
                class="py-4 text-center"
              >
                <IconLucid
                  name="Loader2"
                  size="sm"
                  class="animate-spin mx-auto text-dark/30"
                />
              </div>

              <template v-else>
                <div
                  v-if="galleryImages[gallery.id]?.length"
                  class="grid grid-cols-3 sm:grid-cols-4
                         md:grid-cols-6 gap-2 mb-4"
                >
                  <div
                    v-for="img in galleryImages[gallery.id]"
                    :key="img.id"
                    class="relative group rounded-xl
                           overflow-hidden aspect-square"
                  >
                    <img
                      :src="img.public_url"
                      :alt="img.original_filename"
                      class="w-full h-full object-cover"
                    />
                    <button
                      @click="deleteImage(gallery.id, img.id)"
                      class="absolute top-1 right-1 w-6 h-6
                             rounded-full bg-dark/60 text-cream
                             flex items-center justify-center
                             opacity-0 group-hover:opacity-100
                             transition-opacity"
                    >
                      <IconLucid name="Trash2" size="xs" />
                    </button>
                  </div>
                </div>

                <p
                  v-else
                  class="text-sm text-dark/40 text-center py-3"
                >
                  {{ t("dashboard.galleries_no_images") }}
                </p>

                <!-- Upload button -->
                <label
                  :for="'gallery-upload-' + gallery.id"
                  class="flex items-center justify-center gap-2
                         px-4 py-2 rounded-full border-2
                         border-dashed border-dark/15 text-sm
                         text-dark/40 cursor-pointer
                         transition-all hover:border-dark/30
                         hover:text-dark/60"
                >
                  <IconLucid
                    v-if="uploading === gallery.id"
                    name="Loader2"
                    size="xs"
                    class="animate-spin"
                  />
                  <IconLucid v-else name="Plus" size="xs" />
                  {{ t("dashboard.galleries_add_image") }}
                </label>
                <input
                  :id="'gallery-upload-' + gallery.id"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  class="hidden"
                  @change="uploadImages(gallery.id, $event)"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type {
  Gallery,
  GalleryImage,
} from "~/server/utils/galleries-types";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
  pageTransition: false,
  layoutTransition: false,
});

const { t } = useI18n();
const { adminFetch } = useAdminFetch();

const pageTitle = useState<string | null>(
  "dashboard-page-title",
  () => null
);
pageTitle.value = t("dashboard.galleries_title");

useHead({
  title: t("dashboard.galleries_title") + " - Boticia",
});

const galleries = ref<Gallery[]>([]);
const loading = ref(true);
const uploading = ref<string | null>(null);
const loadingImages = ref<string | null>(null);
const galleryImages = reactive<
  Record<string, GalleryImage[]>
>({});
const imageCounts = reactive<Record<string, number>>({});

const fetchGalleries = async () => {
  loading.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: Gallery[];
    }>("/api/admin/galleries");
    galleries.value = res.data;

    for (const gallery of res.data) {
      await fetchImages(gallery.id);
    }
  } catch (err) {
    console.error("Error fetching galleries:", err);
  } finally {
    loading.value = false;
  }
};

const fetchImages = async (galleryId: string) => {
  loadingImages.value = galleryId;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: GalleryImage[];
    }>(`/api/admin/galleries/${galleryId}/images`);
    galleryImages[galleryId] = res.data;
    imageCounts[galleryId] = res.data.length;
  } catch (err) {
    console.error("Error fetching images:", err);
    galleryImages[galleryId] = [];
  } finally {
    loadingImages.value = null;
  }
};

const togglePublish = async (gallery: Gallery) => {
  try {
    const res = await adminFetch<{
      success: boolean;
      data: Gallery;
    }>(`/api/admin/galleries/${gallery.id}`, {
      method: "PATCH",
      body: { is_published: !gallery.is_published },
    });
    const idx = galleries.value.findIndex(
      (g) => g.id === gallery.id
    );
    if (idx !== -1) galleries.value[idx] = res.data;
  } catch (err) {
    console.error("Error toggling publish:", err);
  }
};

const uploadImages = async (
  galleryId: string,
  event: Event
) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  uploading.value = galleryId;
  if (!galleryImages[galleryId]) {
    galleryImages[galleryId] = [];
  }

  for (const file of Array.from(files)) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch<{
        success: boolean;
        data: GalleryImage;
      }>(`/api/admin/galleries/${galleryId}/images`, {
        method: "POST",
        body: formData,
      });

      galleryImages[galleryId].push(res.data);
      imageCounts[galleryId] =
        galleryImages[galleryId].length;
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  }

  uploading.value = null;
  input.value = "";
};

const deleteImage = async (
  galleryId: string,
  imageId: string
) => {
  try {
    await adminFetch(
      `/api/admin/galleries/${galleryId}/images/${imageId}`,
      { method: "DELETE" }
    );
    galleryImages[galleryId] = galleryImages[
      galleryId
    ].filter((img) => img.id !== imageId);
    imageCounts[galleryId] =
      galleryImages[galleryId].length;
  } catch (err) {
    console.error("Error deleting image:", err);
  }
};

onMounted(() => {
  fetchGalleries();
});
</script>
