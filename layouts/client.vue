<template>
  <div
    class="min-h-screen flex flex-col bg-white
      selection:bg-fuchsia-300 selection:text-fuchsia-900"
  >
    <!-- Top bar pill -->
    <header class="bg-transparent pt-4 pb-4">
      <div class="px-4 md:px-10">
        <div
          class="rounded-full bg-cream
            px-4 md:px-8 py-3 md:py-4
            flex items-center justify-between"
        >
          <NuxtLink
            to="/"
            :aria-label="$t('client.back_to_site')"
            :title="$t('client.back_to_site')"
            class="w-10 h-10 rounded-full bg-cream-dark
              flex items-center justify-center text-gray-500
              hover:text-gray-600 transition-all"
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
          <!-- Spacer to keep center alignment -->
          <div class="w-10 h-10"></div>
        </div>
      </div>
    </header>

    <!-- Plus d'onglets : la frise de « Mon Projet » porte la navigation -->
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
const { t } = useI18n();

// Inject dynamic theme CSS variables
useSiteTheme();

const coupleNames = ref("");

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
          partner2_name?: string;
        };
      };
    }>("/api/client/project");
    if (res.data?.quote) {
      coupleNames.value = res.data.quote.partner2_name
        ? `${res.data.quote.partner1_name} & ${res.data.quote.partner2_name}`
        : res.data.quote.partner1_name;
    }
  } catch {
    coupleNames.value = t("client.nav_project");
  }
});
</script>
