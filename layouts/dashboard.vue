<template>
  <div
    class="min-h-screen flex flex-col bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900"
  >
    <!-- Top bar pill -->
    <header class="bg-transparent pt-4 pb-4">
      <div class="px-4 md:px-10">
        <div
          class="rounded-full bg-cream-light px-4 md:px-8 py-3 md:py-4 flex items-center justify-between"
        >
          <button v-if="pageTitle" @click="router.back()" class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-dark/60 hover:text-dark/80 transition-all">
            <IconLucid name="ArrowLeft" size="sm" />
          </button>
          <NuxtLink v-else :to="localePath('/')" class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-dark/60 hover:text-dark/80 transition-all">
            <IconLucid name="Home" size="sm" />
          </NuxtLink>
          <div class="text-center">
            <span class="font-heading font-medium text-base md:text-xl tracking-tight text-dark block">
              {{ pageTitle || $t('common.my_space') }}
            </span>
            <span v-if="user?.email" class="text-xs md:text-sm text-orange-500 truncate max-w-[140px] md:max-w-none block">
              {{ pageTitle ? $t('common.my_space') : user.email }}
            </span>
          </div>
          <!-- Settings button -->
          <button
            @click="menuOpen = true"
            class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-dark/60 hover:text-dark/80 transition-all"
          >
            <IconLucid name="Settings" size="sm" />
          </button>
        </div>
      </div>
    </header>

    <main id="main-content" class="flex-1 flex flex-col">
      <slot />
    </main>
    <Footer v-if="!route.params.id" />

    <!-- Chat bubble -->
    <ChatBubble />

    <!-- Settings modal -->
    <BaseModal
      :isOpen="menuOpen"
      :title="$t('dashboard.settings_title')"
      :showCloseButton="true"
      :closeButtonText="$t('common.close')"
      @close="menuOpen = false"
    >
      <!-- Logo selector -->
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

      <!-- Photo hero -->
      <div>
        <h2 class="font-heading text-lg text-dark mb-4">{{ $t('dashboard.hero_photo_title') }}</h2>
        <div class="flex items-center gap-4">
          <div class="w-28 h-28 rounded-[1.5rem] border-2 border-dark/15 bg-cream overflow-hidden shrink-0">
            <img
              :src="heroImage"
              alt="Photo hero"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <p class="text-dark/40 text-sm mb-3">{{ $t('dashboard.hero_photo_desc') }}</p>
            <label
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all"
            >
              <IconLucid
                v-if="uploadingHero"
                name="Loader2"
                size="xs"
                class="animate-spin"
              />
              <IconLucid v-else name="Upload" size="xs" />
              {{ $t('dashboard.hero_photo_upload') }}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                class="hidden"
                :disabled="uploadingHero"
                @change="handleHeroUpload"
              />
            </label>
            <p v-if="heroSuccess" class="text-green-600 text-sm mt-2">{{ $t('dashboard.hero_photo_success') }}</p>
          </div>
        </div>
      </div>

      <!-- Photos Notre approche (page Événements) -->
      <div>
        <h2 class="font-heading text-lg text-dark mb-4">{{ $t('dashboard.philosophy_photos_title') }}</h2>
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center gap-4">
            <div class="w-28 h-28 rounded-[1.5rem] border-2 border-dark/15 bg-cream overflow-hidden shrink-0">
              <img
                :src="philosophyImage1"
                alt="Photo approche 1"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <p class="text-dark/40 text-sm mb-3">{{ $t('dashboard.philosophy_photo_1_desc') }}</p>
              <label
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all"
              >
                <IconLucid
                  v-if="uploadingPhilosophy1"
                  name="Loader2"
                  size="xs"
                  class="animate-spin"
                />
                <IconLucid v-else name="Upload" size="xs" />
                {{ $t('dashboard.philosophy_photo_upload') }}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  class="hidden"
                  :disabled="uploadingPhilosophy1"
                  @change="handlePhilosophyUpload($event, 'events_philosophy_image_1', philosophyImage1Ref, uploadingPhilosophy1, philosophySuccess1)"
                />
              </label>
              <p v-if="philosophySuccess1" class="text-green-600 text-sm mt-2">{{ $t('dashboard.philosophy_photo_success') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-28 h-28 rounded-[1.5rem] border-2 border-dark/15 bg-cream overflow-hidden shrink-0">
              <img
                :src="philosophyImage2"
                alt="Photo approche 2"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <p class="text-dark/40 text-sm mb-3">{{ $t('dashboard.philosophy_photo_2_desc') }}</p>
              <label
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold cursor-pointer hover:bg-dark/80 transition-all"
              >
                <IconLucid
                  v-if="uploadingPhilosophy2"
                  name="Loader2"
                  size="xs"
                  class="animate-spin"
                />
                <IconLucid v-else name="Upload" size="xs" />
                {{ $t('dashboard.philosophy_photo_upload') }}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  class="hidden"
                  :disabled="uploadingPhilosophy2"
                  @change="handlePhilosophyUpload($event, 'events_philosophy_image_2', philosophyImage2Ref, uploadingPhilosophy2, philosophySuccess2)"
                />
              </label>
              <p v-if="philosophySuccess2" class="text-green-600 text-sm mt-2">{{ $t('dashboard.philosophy_photo_success') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Availability -->
      <AvailabilityManager />

      <!-- Guide -->
      <NuxtLink
        :to="localePath('/dashboard/guide')"
        @click="menuOpen = false"
        class="w-full flex items-center gap-3 px-5 py-3 text-sm text-dark/60 hover:text-dark hover:bg-cream/50 transition-colors rounded-xl border-2 border-dark/10"
      >
        <IconLucid name="HelpCircle" size="sm" :strokeWidth="2" />
        {{ $t('dashboard.guide') }}
      </NuxtLink>

      <!-- Changelog -->
      <NuxtLink
        :to="localePath('/dashboard/changelog')"
        @click="menuOpen = false"
        class="w-full flex items-center gap-3 px-5 py-3 text-sm text-dark/60 hover:text-dark hover:bg-cream/50 transition-colors rounded-xl border-2 border-dark/10"
      >
        <IconLucid name="Sparkles" size="sm" :strokeWidth="2" />
        Mises à jour
      </NuxtLink>

      <!-- Sign out -->
      <button
        @click="handleSignOut"
        class="w-full flex items-center gap-3 px-5 py-3 text-sm text-dark/60 hover:text-dark hover:bg-cream/50 transition-colors rounded-xl border-2 border-dark/10"
      >
        <IconLucid name="LogOut" size="sm" :strokeWidth="2" />
        {{ $t('dashboard.sign_out') }}
      </button>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { ThemeColor } from "~/composables/useSiteTheme";

const user = useSupabaseUser();
const { getClient: getSupabase } = useSupabase();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const { compress } = useImageCompression();

const isDetailPage = computed(() => !!route.params.id);

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
const menuOpen = ref(false);

const handleSignOut = async () => {
  menuOpen.value = false;
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  router.push(localePath('/'));
};

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


// Hero photo management
const heroImage = ref("/bouquet_mariee_boticia._1.webp");
const uploadingHero = ref(false);
const heroSuccess = ref(false);

async function fetchHeroImage() {
  try {
    const { data } = await $fetch<{ data: { value: any } }>("/api/cms/config", {
      params: { key: "hero_image" },
    });
    if (data?.value?.url) {
      heroImage.value = data.value.url;
    }
  } catch {
    // Keep default
  }
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
        body: {
          key: "hero_image",
          category: "homepage",
          value: { url: uploadRes.data.url },
        },
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


// Philosophy photos management (page Événements)
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
      $fetch<{ data: { value: any } }>("/api/cms/config", {
        params: { key: "events_philosophy_image_1" },
      }),
      $fetch<{ data: { value: any } }>("/api/cms/config", {
        params: { key: "events_philosophy_image_2" },
      }),
    ]);
    if (res1?.data?.value?.url) philosophyImage1Ref.value = res1.data.value.url;
    if (res2?.data?.value?.url) philosophyImage2Ref.value = res2.data.value.url;
  } catch {
    // Keep defaults
  }
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
        body: {
          key: configKey,
          category: "events",
          value: { url: uploadRes.data.url },
        },
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

// Logo management
const { logo: siteLogoRef, setLogo: setSiteLogoGlobal } = useSiteLogo();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref("");
const uploadSuccess = ref("");
const selectedLogo = ref(siteLogoRef.value);
const uploadedLogos = ref<{ path: string; url: string }[]>([]);

onMounted(async () => {
  await fetchLogos();
  await fetchSelectedLogo();
  await fetchHeroImage();
  await fetchPhilosophyImages();
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

    if (logo && selectedLogo.value === logo.url) {
      await selectLogo("/logo-boticia.png");
    }
  } catch (err) {
    console.error("Error deleting logo:", err);
  }
}
</script>
