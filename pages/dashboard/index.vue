<template>
  <div class="flex-1 flex flex-col bg-white">
    <!-- Loading -->
    <div v-if="!user" class="py-12 md:py-16">
      <div class="px-10">
        <div class="animate-pulse">
          <div class="h-7 bg-gray-200 rounded w-48 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-32 mb-8"></div>
          <div class="space-y-4">
            <div class="h-32 bg-gray-200 rounded-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Authenticated dashboard -->
    <template v-else>
      <section class="py-12 md:py-16">
        <div class="px-10">
          <!-- Welcome -->
          <div class="mb-10">
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ greeting }}, {{ userDisplayName }}
            </h1>
          </div>

          <!-- Logo selector -->
          <div class="mb-10">
            <h2 class="font-heading text-lg text-dark mb-4">{{ t('dashboard.logo_title') }}</h2>
            <div class="flex items-center gap-4 flex-wrap">
              <!-- Default logo -->
              <button
                @click="selectLogo('/logo-boticia.png')"
                class="w-28 h-28 rounded-[1.5rem] border-2 bg-cream flex items-center justify-center p-3 relative transition-all"
                :class="selectedLogo === '/logo-boticia.png' ? 'border-dark' : 'border-dark/15 hover:border-dark/30'"
              >
                <img src="/logo-boticia.png" alt="Logo Boticia" class="max-w-full max-h-full object-contain" />
                <span
                  v-if="selectedLogo === '/logo-boticia.png'"
                  class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-dark flex items-center justify-center"
                >
                  <IconLucid name="Check" size="xs" class="text-cream" />
                </span>
              </button>

              <!-- Uploaded logos -->
              <div
                v-for="logo in uploadedLogos"
                :key="logo.path"
                class="relative group"
              >
                <button
                  @click="selectLogo(logo.url)"
                  class="w-28 h-28 rounded-[1.5rem] border-2 bg-cream flex items-center justify-center p-3 transition-all"
                  :class="selectedLogo === logo.url ? 'border-dark' : 'border-dark/15 hover:border-dark/30'"
                >
                  <img :src="logo.url" :alt="logo.path" class="max-w-full max-h-full object-contain" />
                  <span
                    v-if="selectedLogo === logo.url"
                    class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-dark flex items-center justify-center"
                  >
                    <IconLucid name="Check" size="xs" class="text-cream" />
                  </span>
                </button>
                <!-- Delete button -->
                <button
                  @click="deleteLogo(logo.path)"
                  class="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IconLucid name="X" size="xs" class="text-white" />
                </button>
              </div>

              <!-- Upload slot -->
              <button
                v-if="uploadedLogos.length < 3"
                @click="triggerUpload"
                :disabled="uploading"
                class="w-28 h-28 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
                :class="uploading ? 'border-dark/30 bg-cream/50' : 'border-dark/15 text-dark/20 hover:border-dark/30 hover:text-dark/40'"
              >
                <template v-if="!uploading">
                  <IconLucid name="Plus" size="sm" />
                  <span class="text-xs">Upload</span>
                </template>
                <template v-else>
                  <div class="w-6 h-6 border-2 border-dark/20 border-t-dark/60 rounded-full animate-spin"></div>
                  <span class="text-xs text-dark/40">Envoi...</span>
                </template>
              </button>

              <!-- Hidden file input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                class="hidden"
                @change="handleUpload"
              />
            </div>

            <!-- Status message -->
            <p v-if="uploadError" class="text-red-500 text-sm mt-3">{{ uploadError }}</p>
            <p v-if="uploadSuccess" class="text-green-600 text-sm mt-3">{{ uploadSuccess }}</p>
          </div>

          <!-- Theme color selector -->
          <div class="mb-10">
            <h2 class="font-heading text-lg text-dark mb-4">{{ t('dashboard.theme_title') }}</h2>
            <div class="flex items-center gap-3 flex-wrap">
              <button
                v-for="color in themeColors"
                :key="color.key"
                @click="selectThemeColor(color)"
                class="group flex flex-col items-center gap-2"
              >
                <div
                  class="w-14 h-14 rounded-full border-2 transition-all relative"
                  :style="{ backgroundColor: color.hex }"
                  :class="selectedTheme?.key === color.key ? 'border-dark' : 'border-dark/15 hover:border-dark/30'"
                >
                  <span
                    v-if="selectedTheme?.key === color.key"
                    class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-dark flex items-center justify-center"
                  >
                    <IconLucid name="Check" size="xs" class="text-cream" />
                  </span>
                </div>
                <span
                  class="text-xs transition-colors"
                  :class="selectedTheme?.key === color.key ? 'text-dark font-semibold' : 'text-dark/40 group-hover:text-dark/60'"
                >
                  {{ color.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Content management -->
          <div class="rounded-[2rem] border-2 border-dark/10 overflow-hidden">
            <NuxtLink
              v-for="(page, i) in contentPages"
              :key="page.key"
              :to="localePath(page.to)"
              class="flex items-center justify-between px-8 py-6 transition-colors hover:bg-cream/50 group"
              :class="i < contentPages.length - 1 ? 'border-b-2 border-dark/10' : ''"
            >
              <div>
                <span class="font-heading text-lg text-dark block">
                  {{ t(page.key) }}
                </span>
                <span class="text-sm text-dark/40">
                  {{ t(page.descKey) }}
                </span>
              </div>
              <IconLucid
                name="ChevronRight"
                size="sm"
                class="text-dark/20 group-hover:text-dark/50 transition-colors"
              />
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { ThemeColor } from "~/composables/useSiteTheme";

definePageMeta({
  ssr: false,
  layout: 'dashboard'
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();

const contentPages = [
  { key: "dashboard.page_home", descKey: "dashboard.page_home_desc", to: "/dashboard" },
  { key: "dashboard.page_weddings", descKey: "dashboard.page_weddings_desc", to: "/dashboard" },
  { key: "dashboard.page_events", descKey: "dashboard.page_events_desc", to: "/dashboard" },
  { key: "dashboard.page_workshops", descKey: "dashboard.page_workshops_desc", to: "/dashboard" },
];

// Redirect to login if not authenticated
watch(user, (val) => {
  if (val === null) {
    router.push(localePath('/login'));
  }
}, { immediate: true });

// Greeting
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return t("dashboard.greeting_morning");
  if (hour >= 12 && hour < 18) return t("dashboard.greeting_afternoon");
  return t("dashboard.greeting_evening");
});

const userDisplayName = computed(() => {
  if (!user.value?.email) return "";
  const emailPart = user.value.email.split("@")[0];
  return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
});

// Theme management
const { theme: siteTheme, colors: themeColors, setTheme: setSiteTheme } = useSiteTheme();
const selectedTheme = computed(() => siteTheme.value);

async function selectThemeColor(color: ThemeColor) {
  setSiteTheme(color);
  try {
    await $fetch("/api/cms/config", {
      method: "POST",
      body: {
        key: "site_theme",
        category: "branding",
        value: { key: color.key },
      },
    });
  } catch (err) {
    console.error("Error saving theme:", err);
  }
}

// Logo management
const { setLogo: setSiteLogoGlobal } = useSiteLogo();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref("");
const uploadSuccess = ref("");
const selectedLogo = ref("/logo-boticia.png");
const uploadedLogos = ref<{ path: string; url: string }[]>([]);

// Load logos and selected config on mount
onMounted(async () => {
  await fetchLogos();
  await fetchSelectedLogo();
});

async function fetchLogos() {
  try {
    const { data } = await $fetch<{ data: { path: string; url: string }[] }>("/api/cms/logos");
    uploadedLogos.value = data || [];
  } catch {
    // No logos yet
  }
}

async function fetchSelectedLogo() {
  try {
    const { data } = await $fetch<{ data: { value: any } }>("/api/cms/config", {
      params: { key: "site_logo" },
    });
    if (data?.value?.url) {
      selectedLogo.value = data.value.url;
    }
  } catch {
    // Default logo
  }
}

async function selectLogo(url: string) {
  selectedLogo.value = url;
  setSiteLogoGlobal(url);
  try {
    await $fetch("/api/cms/config", {
      method: "POST",
      body: {
        key: "site_logo",
        category: "branding",
        value: { url },
      },
    });
  } catch (err) {
    console.error("Error saving logo selection:", err);
  }
}

function triggerUpload() {
  fileInput.value?.click();
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploading.value = true;
  uploadError.value = "";
  uploadSuccess.value = "";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const result = await $fetch<{ success: boolean; data: { path: string; url: string } }>("/api/cms/logos/upload", {
      method: "POST",
      body: formData,
    });

    if (result?.data) {
      uploadedLogos.value.push(result.data);
      await selectLogo(result.data.url);
      uploadSuccess.value = "Logo uploadé avec succès";
      setTimeout(() => { uploadSuccess.value = ""; }, 3000);
    }
  } catch (err: any) {
    console.error("Error uploading logo:", err);
    uploadError.value = err?.data?.message || err?.message || "Erreur lors de l'upload";
    setTimeout(() => { uploadError.value = ""; }, 5000);
  } finally {
    uploading.value = false;
    input.value = "";
  }
}

async function deleteLogo(path: string) {
  const logo = uploadedLogos.value.find((l) => l.path === path);

  try {
    await $fetch(`/api/cms/logos/${encodeURIComponent(path)}`, {
      method: "DELETE",
    });

    uploadedLogos.value = uploadedLogos.value.filter((l) => l.path !== path);

    // If deleted logo was selected, revert to default
    if (logo && selectedLogo.value === logo.url) {
      await selectLogo("/logo-boticia.png");
    }
  } catch (err) {
    console.error("Error deleting logo:", err);
  }
}

useHead({
  title: t("dashboard.page_title"),
});
</script>
