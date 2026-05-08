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
      <!-- Availability -->
      <AvailabilityManager />

      <!-- Personnalisation + Guide + Changelog -->
      <div class="grid grid-cols-3 gap-3">
        <NuxtLink
          :to="localePath('/dashboard/personalisation')"
          @click="menuOpen = false"
          class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-dark text-cream px-4 py-8 text-center hover:bg-dark/80 transition-colors"
        >
          <IconLucid name="Palette" size="md" :strokeWidth="1.5" />
          <span class="text-sm font-semibold">Personnalisation</span>
        </NuxtLink>

        <NuxtLink
          :to="localePath('/dashboard/guide')"
          @click="menuOpen = false"
          class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-dark text-cream px-4 py-8 text-center hover:bg-dark/80 transition-colors"
        >
          <IconLucid name="HelpCircle" size="md" :strokeWidth="1.5" />
          <span class="text-sm font-semibold">{{ $t('dashboard.guide') }}</span>
        </NuxtLink>

        <NuxtLink
          :to="localePath('/dashboard/changelog')"
          @click="menuOpen = false"
          class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-dark text-cream px-4 py-8 text-center hover:bg-dark/80 transition-colors"
        >
          <IconLucid name="Sparkles" size="md" :strokeWidth="1.5" />
          <span class="text-sm font-semibold">Mises à jour</span>
        </NuxtLink>
      </div>

      <!-- Sign out -->
      <button
        @click="handleSignOut"
        class="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-cream text-dark/60 text-sm font-semibold hover:bg-cream-dark hover:text-dark transition-colors"
      >
        <IconLucid name="LogOut" size="sm" :strokeWidth="2" />
        {{ $t('dashboard.sign_out') }}
      </button>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const { getClient: getSupabase } = useSupabase();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();

const isDetailPage = computed(() => !!route.params.id);
const pageTitle = useState<string | null>("dashboard-page-title", () => null);
const menuOpen = ref(false);

// Keep useSiteTheme initialized in layout so theme applies on all dashboard pages
useSiteTheme();

const handleSignOut = async () => {
  menuOpen.value = false;
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  router.push(localePath('/'));
};
</script>
