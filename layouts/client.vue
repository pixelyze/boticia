<template>
  <div
    class="min-h-screen flex flex-col bg-white
      selection:bg-fuchsia-300 selection:text-fuchsia-900"
  >
    <!-- Top bar pill -->
    <header class="bg-transparent pt-4 pb-4">
      <div class="px-4 md:px-10">
        <div
          class="rounded-full border-2 border-dark/10 bg-cream
            px-4 md:px-8 py-3 md:py-4
            flex items-center justify-between"
        >
          <NuxtLink
            to="/"
            class="w-10 h-10 rounded-full bg-cream-dark
              flex items-center justify-center text-dark/60
              hover:text-dark/80 transition-all"
          >
            <IconLucid name="ArrowLeft" size="sm" />
          </NuxtLink>
          <div class="text-center">
            <span
              class="font-heading font-medium text-base
                md:text-xl tracking-tight text-dark block"
            >
              {{ coupleNames }}
            </span>
            <span
              class="text-xs md:text-sm text-orange-500 block"
            >
              {{ $t("client.space_subtitle") }}
            </span>
          </div>
          <!-- Sign out button -->
          <button
            @click="handleSignOut"
            class="w-10 h-10 rounded-full bg-cream-dark
              flex items-center justify-center text-dark/60
              hover:text-dark/80 transition-all"
          >
            <IconLucid name="Settings" size="sm" />
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation tabs -->
    <nav class="px-4 md:px-10 pb-2">
      <div class="flex gap-2 overflow-x-auto no-scrollbar">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="localePath(tab.path)"
          class="px-4 py-2 rounded-full border-2 text-sm
            font-medium whitespace-nowrap transition-all"
          :class="
            isActiveTab(tab.path)
              ? 'bg-black text-white border-black'
              : 'bg-white text-dark/60 border-dark/10 hover:border-dark/30'
          "
        >
          {{ $t(tab.label) }}
        </NuxtLink>
      </div>
    </nav>

    <main id="main-content" class="flex-1 flex flex-col">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const { getClient: getSupabase } = useSupabase();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Inject dynamic theme CSS variables
useSiteTheme();

const coupleNames = ref("");

const tabs = [
  { path: "/mon-projet", label: "client.nav_project" },
  {
    path: "/mon-projet/inspirations",
    label: "client.nav_inspirations",
  },
  {
    path: "/mon-projet/moodboard",
    label: "client.nav_moodboard",
  },
  {
    path: "/mon-projet/proposition",
    label: "client.nav_proposal",
  },
];

const isActiveTab = (path: string) => {
  const currentPath = route.path;
  const resolvedPath = localePath(path);
  if (path === "/mon-projet") {
    return currentPath === resolvedPath;
  }
  return currentPath.startsWith(resolvedPath);
};

const handleSignOut = async () => {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  router.push(localePath("/"));
};

// Fetch couple names
const { clientFetch } = useClientFetch();

onMounted(async () => {
  try {
    const res = await clientFetch<{
      success: boolean;
      data: {
        quote: {
          partner1_name: string;
          partner2_name: string;
        };
      };
    }>("/api/client/project");
    if (res.data?.quote) {
      coupleNames.value =
        `${res.data.quote.partner1_name}` +
        ` & ${res.data.quote.partner2_name}`;
    }
  } catch {
    coupleNames.value = t("client.nav_project");
  }
});
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
