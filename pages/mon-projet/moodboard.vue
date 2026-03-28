<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="pt-4 pb-12 md:pt-6 md:pb-16">
      <div class="px-4 md:px-10">
        <div
          class="rounded-[2rem] border-2 border-dark/10
            p-8 md:p-10"
        >
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ t("client.moodboard_title") }}
            </h1>
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
            <!-- Florist note -->
            <div
              v-if="moodboardNote"
              class="rounded-[1.5rem] border-2 border-dark/10
                p-6 mb-8"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-cream
                    flex items-center justify-center
                    shrink-0 mt-0.5"
                >
                  <IconLucid
                    name="MessageCircle"
                    size="sm"
                    class="text-gray-400"
                  />
                </div>
                <div>
                  <p
                    class="text-xs text-dark/40
                      uppercase tracking-wider mb-2"
                  >
                    {{ t("client.moodboard_florist_note") }}
                  </p>
                  <p class="text-dark whitespace-pre-line">
                    {{ moodboardNote }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Gallery -->
            <MoodboardGallery
              v-if="items.length > 0"
              :items="items"
              @preview="openPreview"
            />

            <!-- Empty state -->
            <div
              v-else
              class="py-16 text-center"
            >
              <IconLucid
                name="Palette"
                size="lg"
                class="mx-auto text-gray-300 mb-4"
              />
              <p class="text-dark/40 max-w-sm mx-auto">
                {{ t("client.moodboard_empty") }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </section>

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
          class="max-w-full max-h-[60vh] mx-auto
            rounded-xl object-contain"
        />
        <p
          v-if="previewItem.description"
          class="text-dark/60 mt-4"
        >
          {{ previewItem.description }}
        </p>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { MoodboardItem } from "~/server/utils/client-portal-types";

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

useHead({
  title: t("client.moodboard_title") + " - Boticia",
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
const items = ref<MoodboardItem[]>([]);
const moodboardNote = ref("");
const previewItem = ref<MoodboardItem | null>(null);

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
