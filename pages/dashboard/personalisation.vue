<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10 max-w-2xl">

        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-2xl md:text-3xl font-bold">Personnalisation</h1>
          <p class="text-dark/40 mt-1">Logo, couleur du thème et photos du site.</p>
        </div>

        <div class="space-y-10">

          <!-- Logo -->
          <div>
            <h2 class="font-heading text-lg text-dark mb-4">{{ $t('dashboard.logo_title') }}</h2>
            <div class="flex items-center gap-4 flex-wrap">
              <!-- Default logo -->
              <button
                @click="selectLogo('/logo-boticia.png')"
                class="w-28 h-28 rounded-[1.5rem] border-2 bg-cream flex items-center justify-center p-3 relative transition-all"
                :class="selectedLogo === '/logo-boticia.png' ? 'border-dark' : 'border-dark/15 hover:border-dark/30'"
              >
                <img src="/logo-boticia.png" alt="Logo Boticia" class="max-w-full max-h-full object-contain" />
                <span v-if="selectedLogo === '/logo-boticia.png'" class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-dark flex items-center justify-center">
                  <IconLucid name="Check" size="xs" class="text-cream" />
                </span>
              </button>

              <!-- Uploaded logos -->
              <div v-for="logo in uploadedLogos" :key="logo.path" class="relative group">
                <button
                  @click="selectLogo(logo.url)"
                  class="w-28 h-28 rounded-[1.5rem] border-2 bg-cream flex items-center justify-center p-3 transition-all"
                  :class="selectedLogo === logo.url ? 'border-dark' : 'border-dark/15 hover:border-dark/30'"
                >
                  <img :src="logo.url" :alt="logo.path" class="max-w-full max-h-full object-contain" />
                  <span v-if="selectedLogo === logo.url" class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-dark flex items-center justify-center">
                    <IconLucid name="Check" size="xs" class="text-cream" />
                  </span>
                </button>
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
                @click="fileInput?.click()"
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

              <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" class="hidden" @change="handleUpload" />
            </div>
            <p v-if="uploadError" class="text-red-500 text-sm mt-3">{{ uploadError }}</p>
            <p v-if="uploadSuccess" class="text-green-600 text-sm mt-3">{{ uploadSuccess }}</p>
          </div>

          <!-- Thème -->
          <div>
            <h2 class="font-heading text-lg text-dark mb-4">{{ $t('dashboard.theme_title') }}</h2>
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
                  <span v-if="selectedTheme?.key === color.key" class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-dark flex items-center justify-center">
                    <IconLucid name="Check" size="xs" class="text-cream" />
                  </span>
                </div>
                <span class="text-xs transition-colors" :class="selectedTheme?.key === color.key ? 'text-dark font-semibold' : 'text-dark/40 group-hover:text-dark/60'">
                  {{ color.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Photo hero -->
          <div>
            <h2 class="font-heading text-lg text-dark mb-4">{{ $t('dashboard.hero_photo_title') }}</h2>
            <div class="flex items-center gap-4">
              <div class="w-28 h-28 rounded-[1.5rem] border-2 border-dark/15 bg-cream overflow-hidden shrink-0">
                <img :src="heroImage" alt="Photo hero" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-dark/40 text-sm mb-3">{{ $t('dashboard.hero_photo_desc') }}</p>
                <label class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all">
                  <IconLucid v-if="uploadingHero" name="Loader2" size="xs" class="animate-spin" />
                  <IconLucid v-else name="Upload" size="xs" />
                  {{ $t('dashboard.hero_photo_upload') }}
                  <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" :disabled="uploadingHero" @change="handleHeroUpload" />
                </label>
                <p v-if="heroSuccess" class="text-green-600 text-sm mt-2">{{ $t('dashboard.hero_photo_success') }}</p>
              </div>
            </div>
          </div>

          <!-- Photos Notre approche (Événements) -->
          <div>
            <h2 class="font-heading text-lg text-dark mb-4">{{ $t('dashboard.philosophy_photos_title') }}</h2>
            <div class="flex flex-wrap gap-6">
              <div class="flex items-center gap-4">
                <div class="w-28 h-28 rounded-[1.5rem] border-2 border-dark/15 bg-cream overflow-hidden shrink-0">
                  <img :src="philosophyImage1" alt="Photo approche 1" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="text-dark/40 text-sm mb-3">{{ $t('dashboard.philosophy_photo_1_desc') }}</p>
                  <label class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all">
                    <IconLucid v-if="uploadingPhilosophy1" name="Loader2" size="xs" class="animate-spin" />
                    <IconLucid v-else name="Upload" size="xs" />
                    {{ $t('dashboard.philosophy_photo_upload') }}
                    <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" :disabled="uploadingPhilosophy1" @change="handlePhilosophyUpload($event, 'events_philosophy_image_1', philosophyImage1Ref, uploadingPhilosophy1, philosophySuccess1)" />
                  </label>
                  <p v-if="philosophySuccess1" class="text-green-600 text-sm mt-2">{{ $t('dashboard.philosophy_photo_success') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-28 h-28 rounded-[1.5rem] border-2 border-dark/15 bg-cream overflow-hidden shrink-0">
                  <img :src="philosophyImage2" alt="Photo approche 2" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="text-dark/40 text-sm mb-3">{{ $t('dashboard.philosophy_photo_2_desc') }}</p>
                  <label class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all">
                    <IconLucid v-if="uploadingPhilosophy2" name="Loader2" size="xs" class="animate-spin" />
                    <IconLucid v-else name="Upload" size="xs" />
                    {{ $t('dashboard.philosophy_photo_upload') }}
                    <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" :disabled="uploadingPhilosophy2" @change="handlePhilosophyUpload($event, 'events_philosophy_image_2', philosophyImage2Ref, uploadingPhilosophy2, philosophySuccess2)" />
                  </label>
                  <p v-if="philosophySuccess2" class="text-green-600 text-sm mt-2">{{ $t('dashboard.philosophy_photo_success') }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { ThemeColor } from "~/composables/useSiteTheme";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
  pageTransition: false,
  layoutTransition: false,
});

const { compress } = useImageCompression();

// Theme
const { theme: siteTheme, colors: themeColors, setTheme: setSiteTheme } = useSiteTheme();
const selectedTheme = computed(() => siteTheme.value);

async function selectThemeColor(color: ThemeColor) {
  setSiteTheme(color);
  try {
    await $fetch("/api/cms/config", {
      method: "POST",
      body: { key: "site_theme", category: "branding", value: { key: color.key } },
    });
  } catch (err) {
    console.error("Error saving theme:", err);
  }
}

// Logo
const { logo: siteLogoRef, setLogo: setSiteLogoGlobal } = useSiteLogo();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref("");
const uploadSuccess = ref("");
const selectedLogo = ref(siteLogoRef.value);
const uploadedLogos = ref<{ path: string; url: string }[]>([]);

async function fetchLogos() {
  try {
    const { data } = await $fetch<{ data: { path: string; url: string }[] }>("/api/cms/logos");
    uploadedLogos.value = data || [];
  } catch {}
}

async function fetchSelectedLogo() {
  try {
    const { data } = await $fetch<{ data: { value: any } }>("/api/cms/config", {
      params: { key: "site_logo" },
    });
    if (data?.value?.url) selectedLogo.value = data.value.url;
  } catch {}
}

async function selectLogo(url: string) {
  selectedLogo.value = url;
  setSiteLogoGlobal(url);
  try {
    await $fetch("/api/cms/config", {
      method: "POST",
      body: { key: "site_logo", category: "branding", value: { url } },
    });
  } catch (err) {
    console.error("Error saving logo:", err);
  }
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const rawFile = input.files?.[0];
  if (!rawFile) return;

  uploading.value = true;
  uploadError.value = "";
  uploadSuccess.value = "";

  try {
    const file = await compress(rawFile);
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
    await $fetch(`/api/cms/logos/${encodeURIComponent(path)}`, { method: "DELETE" });
    uploadedLogos.value = uploadedLogos.value.filter((l) => l.path !== path);
    if (logo && selectedLogo.value === logo.url) await selectLogo("/logo-boticia.png");
  } catch (err) {
    console.error("Error deleting logo:", err);
  }
}

// Hero photo
const heroImage = ref("/bouquet_mariee_boticia._1.webp");
const uploadingHero = ref(false);
const heroSuccess = ref(false);

async function fetchHeroImage() {
  try {
    const { data } = await $fetch<{ data: { value: any } }>("/api/cms/config", {
      params: { key: "hero_image" },
    });
    if (data?.value?.url) heroImage.value = data.value.url;
  } catch {}
}

async function handleHeroUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const rawFile = input.files?.[0];
  if (!rawFile) return;

  uploadingHero.value = true;
  heroSuccess.value = false;
  try {
    const token = useSupabaseSession().value?.access_token;
    if (!token) return;
    const file = await compress(rawFile);
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await $fetch<{ success: boolean; data: { path: string; url: string } }>("/api/cms/logos/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (uploadRes?.data?.url) {
      await $fetch("/api/cms/config", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { key: "hero_image", category: "homepage", value: { url: uploadRes.data.url } },
      });
      heroImage.value = uploadRes.data.url;
      heroSuccess.value = true;
      setTimeout(() => { heroSuccess.value = false; }, 3000);
    }
  } catch (err) {
    console.error("Error uploading hero photo:", err);
  } finally {
    uploadingHero.value = false;
    input.value = "";
  }
}

// Philosophy photos
const philosophyImage1Ref = ref("/images/events/scenographie-florale-boticia.jpg");
const philosophyImage2Ref = ref("/images/events/scenographie-florale-boticia.jpg");
const philosophyImage1 = computed(() => philosophyImage1Ref.value);
const philosophyImage2 = computed(() => philosophyImage2Ref.value);
const uploadingPhilosophy1 = ref(false);
const uploadingPhilosophy2 = ref(false);
const philosophySuccess1 = ref(false);
const philosophySuccess2 = ref(false);

async function fetchPhilosophyImages() {
  try {
    const [res1, res2] = await Promise.all([
      $fetch<{ data: { value: any } }>("/api/cms/config", { params: { key: "events_philosophy_image_1" } }),
      $fetch<{ data: { value: any } }>("/api/cms/config", { params: { key: "events_philosophy_image_2" } }),
    ]);
    if (res1?.data?.value?.url) philosophyImage1Ref.value = res1.data.value.url;
    if (res2?.data?.value?.url) philosophyImage2Ref.value = res2.data.value.url;
  } catch {}
}

async function handlePhilosophyUpload(
  event: Event,
  configKey: string,
  imageRef: Ref<string>,
  uploadingRef: Ref<boolean>,
  successRef: Ref<boolean>
) {
  const input = event.target as HTMLInputElement;
  const rawFile = input.files?.[0];
  if (!rawFile) return;

  uploadingRef.value = true;
  successRef.value = false;
  try {
    const token = useSupabaseSession().value?.access_token;
    if (!token) return;
    const file = await compress(rawFile);
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await $fetch<{ success: boolean; data: { path: string; url: string } }>("/api/cms/logos/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (uploadRes?.data?.url) {
      await $fetch("/api/cms/config", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { key: configKey, category: "events", value: { url: uploadRes.data.url } },
      });
      imageRef.value = uploadRes.data.url;
      successRef.value = true;
      setTimeout(() => { successRef.value = false; }, 3000);
    }
  } catch (err) {
    console.error(`Error uploading ${configKey}:`, err);
  } finally {
    uploadingRef.value = false;
    input.value = "";
  }
}

onMounted(async () => {
  await Promise.all([fetchLogos(), fetchSelectedLogo(), fetchHeroImage(), fetchPhilosophyImages()]);
});
</script>
