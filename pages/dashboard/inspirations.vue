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

        <!-- Categories grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="rounded-[1.5rem] border-2 border-dark/10 overflow-hidden"
          >
            <!-- Cover preview -->
            <div class="relative h-48 bg-cream">
              <img
                v-if="cat.cover_public_url"
                :src="cat.cover_public_url"
                :alt="t('stories.' + cat.slug)"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-cream to-dark/15 flex items-center justify-center"
              >
                <IconLucid
                  name="Image"
                  size="lg"
                  class="text-dark/20"
                />
              </div>

              <!-- Publish badge -->
              <button
                @click="togglePublish(cat)"
                class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold transition-all"
                :class="
                  cat.is_published
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                "
              >
                {{
                  cat.is_published
                    ? t('dashboard.inspirations_published')
                    : t('dashboard.inspirations_draft')
                }}
              </button>
            </div>

            <!-- Card content -->
            <div class="p-5">
              <!-- Editable title -->
              <div class="mb-3 group">
                <input
                  :value="cat.title || t('stories.' + cat.slug)"
                  @blur="updateTitle(cat, ($event.target as HTMLInputElement).value)"
                  @keydown.enter="($event.target as HTMLInputElement).blur()"
                  class="font-heading text-base text-dark w-full bg-transparent border-b border-transparent group-hover:border-dark/15 focus:border-dark/30 focus:outline-none py-1 transition-colors"
                  :placeholder="t('stories.' + cat.slug)"
                />
              </div>

              <!-- Cover actions -->
              <div class="flex items-center gap-2 mb-3">
                <label
                  :for="'cover-' + cat.id"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer transition-all hover:bg-dark/80"
                >
                  <IconLucid
                    v-if="uploadingCover === cat.id"
                    name="Loader2"
                    size="xs"
                    class="animate-spin"
                  />
                  <IconLucid
                    v-else
                    :name="cat.cover_public_url ? 'Upload' : 'ImagePlus'"
                    size="xs"
                  />
                  {{
                    cat.cover_public_url
                      ? t('dashboard.inspirations_cover')
                      : t('dashboard.inspirations_upload_cover')
                  }}
                </label>
                <input
                  :id="'cover-' + cat.id"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  class="hidden"
                  @change="uploadCover(cat, $event)"
                />
                <button
                  v-if="cat.cover_public_url"
                  @click="deleteCover(cat)"
                  class="w-10 h-10 rounded-full hover:bg-cream flex items-center justify-center transition-all shrink-0"
                >
                  <IconLucid
                    name="Trash2"
                    size="xs"
                    class="text-dark/30 hover:text-red-500"
                  />
                </button>
              </div>

              <!-- Gallery toggle -->
              <button
                @click="toggleGallery(cat.id)"
                class="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-cream text-sm font-semibold text-dark transition-all hover:bg-cream-dark"
              >
                <span class="flex items-center gap-2">
                  <IconLucid name="Images" size="xs" />
                  {{ t('dashboard.inspirations_gallery') }}
                  <span
                    v-if="galleryCounts[cat.id]"
                    class="text-dark/40"
                  >
                    ({{ galleryCounts[cat.id] }})
                  </span>
                </span>
                <IconLucid
                  :name="openGallery === cat.id ? 'ChevronUp' : 'ChevronDown'"
                  size="xs"
                  class="text-dark/40"
                />
              </button>

              <!-- Gallery panel -->
              <div
                v-if="openGallery === cat.id"
                class="mt-3 pt-3 border-t border-dark/10"
              >
                <!-- Loading gallery -->
                <div
                  v-if="loadingGallery === cat.id"
                  class="py-4 text-center"
                >
                  <IconLucid
                    name="Loader2"
                    size="sm"
                    class="animate-spin mx-auto text-dark/30"
                  />
                </div>

                <template v-else>
                  <!-- Gallery grid -->
                  <div
                    v-if="galleryImages[cat.id]?.length"
                    class="grid grid-cols-3 gap-2 mb-3"
                  >
                    <div
                      v-for="img in galleryImages[cat.id]"
                      :key="img.id"
                      class="relative group rounded-xl overflow-hidden aspect-square"
                    >
                      <img
                        :src="img.public_url"
                        :alt="img.original_filename"
                        class="w-full h-full object-cover"
                      />
                      <button
                        @click="deleteGalleryImage(cat.id, img.id)"
                        class="absolute top-1 right-1 w-6 h-6 rounded-full bg-dark/60 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IconLucid name="Trash2" size="xs" />
                      </button>
                    </div>
                  </div>

                  <!-- Empty -->
                  <p
                    v-else
                    class="text-sm text-dark/40 text-center py-3"
                  >
                    {{ t('dashboard.inspirations_no_images') }}
                  </p>

                  <!-- Upload gallery image -->
                  <label
                    :for="'gallery-' + cat.id"
                    class="flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-dashed border-dark/15 text-sm text-dark/40 cursor-pointer transition-all hover:border-dark/30 hover:text-dark/60"
                  >
                    <IconLucid
                      v-if="uploadingGallery === cat.id"
                      name="Loader2"
                      size="xs"
                      class="animate-spin"
                    />
                    <IconLucid v-else name="Plus" size="xs" />
                    {{ t('dashboard.inspirations_add_image') }}
                  </label>
                  <input
                    :id="'gallery-' + cat.id"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="uploadGalleryImage(cat.id, $event)"
                  />
                </template>
              </div>
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
  HomepageInspirationCategory,
  HomepageInspirationImage,
} from "~/server/utils/homepage-inspirations-types";

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
pageTitle.value = t("dashboard.inspirations_title");

useHead({
  title: t("dashboard.inspirations_title") + " - Boticia",
});

// State
const categories = ref<HomepageInspirationCategory[]>([]);
const loading = ref(true);
const uploadingCover = ref<string | null>(null);
const uploadingGallery = ref<string | null>(null);
const openGallery = ref<string | null>(null);
const loadingGallery = ref<string | null>(null);
const galleryImages = reactive<
  Record<string, HomepageInspirationImage[]>
>({});
const galleryCounts = reactive<Record<string, number>>({});

// Fetch categories
const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationCategory[];
    }>("/api/admin/homepage-inspirations");
    categories.value = res.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
  } finally {
    loading.value = false;
  }
};

// Toggle publish
const updateTitle = async (cat: HomepageInspirationCategory, newTitle: string) => {
  const trimmed = newTitle.trim();
  if (trimmed === cat.title || (!trimmed && !cat.title)) return;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationCategory;
    }>(`/api/admin/homepage-inspirations/${cat.id}`, {
      method: "PATCH",
      body: { title: trimmed || null },
    });
    const idx = categories.value.findIndex((c) => c.id === cat.id);
    if (idx !== -1) categories.value[idx] = res.data;
  } catch (err) {
    console.error("Error updating title:", err);
  }
};

const togglePublish = async (
  cat: HomepageInspirationCategory
) => {
  try {
    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationCategory;
    }>(`/api/admin/homepage-inspirations/${cat.id}`, {
      method: "PATCH",
      body: { is_published: !cat.is_published },
    });
    const idx = categories.value.findIndex(
      (c) => c.id === cat.id
    );
    if (idx !== -1) categories.value[idx] = res.data;
  } catch (err) {
    console.error("Error toggling publish:", err);
  }
};

// Upload cover
const uploadCover = async (
  cat: HomepageInspirationCategory,
  event: Event
) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploadingCover.value = cat.id;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationCategory;
    }>(`/api/admin/homepage-inspirations/${cat.id}/cover`, {
      method: "POST",
      body: formData,
    });
    const idx = categories.value.findIndex(
      (c) => c.id === cat.id
    );
    if (idx !== -1) categories.value[idx] = res.data;
  } catch (err) {
    console.error("Error uploading cover:", err);
  } finally {
    uploadingCover.value = null;
    input.value = "";
  }
};

// Delete cover
const deleteCover = async (
  cat: HomepageInspirationCategory
) => {
  try {
    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationCategory;
    }>(`/api/admin/homepage-inspirations/${cat.id}/cover`, {
      method: "DELETE",
    });
    const idx = categories.value.findIndex(
      (c) => c.id === cat.id
    );
    if (idx !== -1) categories.value[idx] = res.data;
  } catch (err) {
    console.error("Error deleting cover:", err);
  }
};

// Toggle gallery panel
const toggleGallery = async (categoryId: string) => {
  if (openGallery.value === categoryId) {
    openGallery.value = null;
    return;
  }

  openGallery.value = categoryId;

  if (!galleryImages[categoryId]) {
    await fetchGallery(categoryId);
  }
};

// Fetch gallery images
const fetchGallery = async (categoryId: string) => {
  loadingGallery.value = categoryId;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationImage[];
    }>(
      `/api/admin/homepage-inspirations/${categoryId}/gallery`
    );
    galleryImages[categoryId] = res.data;
    galleryCounts[categoryId] = res.data.length;
  } catch (err) {
    console.error("Error fetching gallery:", err);
    galleryImages[categoryId] = [];
  } finally {
    loadingGallery.value = null;
  }
};

// Upload gallery image
const uploadGalleryImage = async (
  categoryId: string,
  event: Event
) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploadingGallery.value = categoryId;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await adminFetch<{
      success: boolean;
      data: HomepageInspirationImage;
    }>(
      `/api/admin/homepage-inspirations/${categoryId}/gallery`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!galleryImages[categoryId]) {
      galleryImages[categoryId] = [];
    }
    galleryImages[categoryId].push(res.data);
    galleryCounts[categoryId] =
      galleryImages[categoryId].length;
  } catch (err) {
    console.error("Error uploading gallery image:", err);
  } finally {
    uploadingGallery.value = null;
    input.value = "";
  }
};

// Delete gallery image
const deleteGalleryImage = async (
  categoryId: string,
  imageId: string
) => {
  try {
    await adminFetch(
      `/api/admin/homepage-inspirations/${categoryId}/gallery/${imageId}`,
      { method: "DELETE" }
    );
    galleryImages[categoryId] = galleryImages[
      categoryId
    ].filter((img) => img.id !== imageId);
    galleryCounts[categoryId] =
      galleryImages[categoryId].length;
  } catch (err) {
    console.error("Error deleting gallery image:", err);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
