<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900">
    <!-- Top bar pill -->
    <header class="bg-transparent pt-4 pb-4">
      <div class="px-10">
        <div class="rounded-full border-2 border-dark/10 bg-cream px-8 py-4 flex items-center justify-between">
          <NuxtLink to="/" class="w-10 h-10 rounded-full border-2 border-dark/10 flex items-center justify-center text-dark/30 hover:text-dark/60 hover:border-dark/30 transition-all">
            <IconLucid name="ArrowLeft" size="sm" />
          </NuxtLink>
          <div class="text-center">
            <span class="font-heading font-medium text-xl tracking-tight text-dark block">
              {{ $t('common.my_space') }}
            </span>
            <span v-if="user?.email" class="text-sm text-dark/40">
              {{ user.email }}
            </span>
          </div>
          <!-- Settings button -->
          <div class="relative">
            <button
              @click="menuOpen = !menuOpen"
              class="w-10 h-10 rounded-full border-2 border-dark/10 flex items-center justify-center text-dark/30 hover:text-dark/60 hover:border-dark/30 transition-all"
            >
              <IconLucid name="Settings" size="sm" />
            </button>

            <!-- Dropdown menu -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="menuOpen"
                class="absolute right-0 mt-3 w-56 rounded-2xl border-2 border-dark/10 bg-white py-2 z-50"
              >
                <button
                  @click="handleSignOut"
                  class="w-full flex items-center gap-3 px-5 py-3 text-sm text-dark/60 hover:text-dark hover:bg-cream/50 transition-colors"
                >
                  <IconLucid name="LogOut" size="sm" :strokeWidth="2" />
                  {{ $t('dashboard.sign_out') }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Click outside to close menu -->
    <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false" />

    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const { getClient: getSupabase } = useSupabase();
const localePath = useLocalePath();
const router = useRouter();

const menuOpen = ref(false);

const handleSignOut = async () => {
  menuOpen.value = false;
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  router.push(localePath('/'));
};
</script>
