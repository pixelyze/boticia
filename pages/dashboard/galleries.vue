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
                <p class="text-xs text-dark/30 mt-0.5 font-mono">
                  {{ galleryUrl(gallery.slug) }}
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
                <div v-if="galleryImages[gallery.id]?.length" class="flex gap-4 items-start">

                  <!-- Bento layout reference -->
                  <div class="shrink-0 p-3 rounded-xl bg-cream/50 border border-dark/10">
                    <p class="text-xs text-dark/40 mb-2 font-semibold uppercase tracking-wide">
                      {{ t("dashboard.bento_layout") }}
                    </p>
                    <div class="flex gap-1 w-[180px]">
                      <div class="flex-[3] flex flex-col gap-1">
                        <div class="flex gap-1 h-14">
                          <div class="flex-[2] bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img v-if="slotImage(gallery.id, 1)" :src="slotImage(gallery.id, 1).public_url" class="absolute inset-0 w-full h-full object-cover" />
                            <span v-else class="text-xs text-dark/50 font-semibold">①</span>
                          </div>
                          <div class="flex-[1] bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img v-if="slotImage(gallery.id, 2)" :src="slotImage(gallery.id, 2).public_url" class="absolute inset-0 w-full h-full object-cover" />
                            <span v-else class="text-xs text-dark/50 font-semibold">②</span>
                          </div>
                        </div>
                        <div class="flex gap-1 h-14">
                          <div class="flex-[1] bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img v-if="slotImage(gallery.id, 3)" :src="slotImage(gallery.id, 3).public_url" class="absolute inset-0 w-full h-full object-cover" />
                            <span v-else class="text-xs text-dark/50 font-semibold">③</span>
                          </div>
                          <div class="flex-[2] bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img v-if="slotImage(gallery.id, 4)" :src="slotImage(gallery.id, 4).public_url" class="absolute inset-0 w-full h-full object-cover" />
                            <span v-else class="text-xs text-dark/50 font-semibold">④</span>
                          </div>
                        </div>
                        <div class="flex gap-1 h-14">
                          <div class="flex-[2] bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img v-if="slotImage(gallery.id, 5)" :src="slotImage(gallery.id, 5).public_url" class="absolute inset-0 w-full h-full object-cover" />
                            <span v-else class="text-xs text-dark/50 font-semibold">⑤</span>
                          </div>
                          <div class="flex-[1] bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img v-if="slotImage(gallery.id, 6)" :src="slotImage(gallery.id, 6).public_url" class="absolute inset-0 w-full h-full object-cover" />
                            <span v-else class="text-xs text-dark/50 font-semibold">⑥</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex-[1] flex flex-col gap-1">
                        <div class="flex-1 bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                          <img v-if="slotImage(gallery.id, 7)" :src="slotImage(gallery.id, 7).public_url" class="absolute inset-0 w-full h-full object-cover" />
                          <span v-else class="text-xs text-dark/50 font-semibold">⑦</span>
                        </div>
                        <div class="flex-1 bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                          <img v-if="slotImage(gallery.id, 8)" :src="slotImage(gallery.id, 8).public_url" class="absolute inset-0 w-full h-full object-cover" />
                          <span v-else class="text-xs text-dark/50 font-semibold">⑧</span>
                        </div>
                        <div class="flex-1 bg-dark/10 rounded-md overflow-hidden relative flex items-center justify-center">
                          <img v-if="slotImage(gallery.id, 9)" :src="slotImage(gallery.id, 9).public_url" class="absolute inset-0 w-full h-full object-cover" />
                          <span v-else class="text-xs text-dark/50 font-semibold">⑨</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Photo grid -->
                  <div class="flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    <div
                      v-for="img in galleryImages[gallery.id]"
                      :key="img.id"
                      class="relative group rounded-xl overflow-hidden bg-dark/5 h-24 flex items-center justify-center"
                    >
                      <img
                        :src="img.public_url"
                        :alt="img.original_filename"
                        class="w-full h-full object-contain"
                      />
                      <!-- Bento slot selector -->
                      <select
                        :value="img.bento_slot || ''"
                        @change="setBentoSlot(gallery.id, img.id, $event)"
                        class="absolute bottom-1 left-1 w-8 h-8
                               rounded-full bg-dark/70 text-cream
                               text-center text-sm font-bold
                               appearance-none cursor-pointer
                               border-2"
                        :class="img.bento_slot
                          ? 'border-cream'
                          : 'border-transparent opacity-0 group-hover:opacity-70'"
                      >
                        <option value="">–</option>
                        <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
                      </select>
                      <!-- Delete button -->
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
                    <!-- Bouton ajout inline -->
                    <label
                      :for="'gallery-upload-' + gallery.id"
                      class="h-24 rounded-xl border-2 border-dashed border-dark/15
                             flex flex-col items-center justify-center gap-1
                             text-dark/30 cursor-pointer
                             hover:border-dark/30 hover:text-dark/50
                             transition-all"
                    >
                      <IconLucid
                        v-if="uploading === gallery.id"
                        name="Loader2"
                        size="sm"
                        class="animate-spin"
                      />
                      <IconLucid v-else name="Plus" size="sm" />
                      <span class="text-xs text-center leading-tight px-1">{{ t("dashboard.galleries_add_image") }}</span>
                    </label>
                  </div>

                </div>

                <!-- État vide : bouton centré -->
                <label
                  v-else
                  :for="'gallery-upload-' + gallery.id"
                  class="flex flex-col items-center justify-center gap-2 py-8
                         rounded-xl border-2 border-dashed border-dark/15
                         text-dark/40 cursor-pointer
                         hover:border-dark/30 hover:text-dark/60 transition-all"
                >
                  <IconLucid
                    v-if="uploading === gallery.id"
                    name="Loader2"
                    size="sm"
                    class="animate-spin"
                  />
                  <IconLucid v-else name="Plus" size="sm" />
                  <span class="text-sm">{{ t("dashboard.galleries_add_image") }}</span>
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
const { compress } = useImageCompression();

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

const slugToPage: Record<string, string> = {
  portfolio: "/",
  creations: "/creations",
  wedding: "/mariages",
  workshops: "/ateliers",
  events: "/evenements",
};

const galleryUrl = (slug: string) => slugToPage[slug] || `/${slug}`;

const fetchGalleries = async () => {
  loading.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: Gallery[];
    }>("/api/admin/galleries");
    // Tri : portfolio (homepage) en premier
    const order = ["portfolio", "creations", "wedding", "workshops"];
    galleries.value = res.data.sort((a, b) => {
      const ia = order.indexOf(a.slug);
      const ib = order.indexOf(b.slug);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    for (const gallery of galleries.value) {
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

  for (const rawFile of Array.from(files)) {
    try {
      const file = await compress(rawFile);
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

const slotImage = (galleryId: string, slot: number) =>
  galleryImages[galleryId]?.find((img) => img.bento_slot === slot) ?? null;

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

const setBentoSlot = async (
  galleryId: string,
  imageId: string,
  event: Event
) => {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  const slot = value ? parseInt(value) : null;

  // If assigning a slot that's already taken, clear the other image
  if (slot !== null && galleryImages[galleryId]) {
    const existing = galleryImages[galleryId].find(
      (img) => img.bento_slot === slot && img.id !== imageId
    );
    if (existing) {
      try {
        await adminFetch(
          `/api/admin/galleries/${galleryId}/images/${existing.id}`,
          { method: "PATCH", body: { bento_slot: null } }
        );
        existing.bento_slot = null;
      } catch (err) {
        console.error("Error clearing slot:", err);
      }
    }
  }

  try {
    const res = await adminFetch<{
      success: boolean;
      data: GalleryImage;
    }>(
      `/api/admin/galleries/${galleryId}/images/${imageId}`,
      { method: "PATCH", body: { bento_slot: slot } }
    );
    const idx = galleryImages[galleryId].findIndex(
      (img) => img.id === imageId
    );
    if (idx !== -1) {
      galleryImages[galleryId][idx] = res.data;
    }
  } catch (err) {
    console.error("Error setting bento slot:", err);
  }
};

onMounted(() => {
  fetchGalleries();
});
</script>
