<template>
  <div class="sticky top-0 z-50">
    <!-- Utility bar -->
    <div class="hidden md:block bg-dark">
      <div class="container mx-auto px-4 py-1.5 flex items-center justify-between">
        <!-- Language selector -->
        <div class="flex items-center gap-3 text-xs text-cream/50">
          <button
            v-for="loc in availableLocales"
            :key="loc.code"
            @click="switchLocale(loc.code)"
            class="uppercase tracking-wider transition-colors duration-300"
            :class="locale === loc.code ? 'text-cream font-semibold' : 'hover:text-cream'"
          >
            {{ loc.code }}
          </button>
        </div>

        <!-- Mon Espace -->
        <NuxtLink
          :to="localePath(user ? '/dashboard' : '/login')"
          class="text-xs font-semibold uppercase tracking-[0.15em] text-cream hover:text-cream/70 transition-colors"
        >
          {{ t("nav.login") }}
        </NuxtLink>
      </div>
    </div>

    <!-- Main header -->
    <header
      class="bg-cream transition-all duration-500"
      :class="scrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm' : ''"
    >
      <div class="container mx-auto px-4 transition-all duration-500" :class="scrolled ? 'py-3' : 'py-6'">
        <nav class="flex items-center justify-between md:grid md:grid-cols-3">
          <!-- Left nav -->
          <div class="hidden md:flex items-center gap-8">
            <NuxtLink
              :to="localePath('/pricing')"
              class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors"
            >
              {{ t("nav.weddings") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/events')"
              class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors"
            >
              {{ t("nav.events") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/workshops')"
              class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors"
            >
              {{ t("nav.workshops") }}
            </NuxtLink>
          </div>

          <!-- Center logo -->
          <div class="flex flex-col items-center">
            <NuxtLink :to="localePath('/')" class="text-center">
              <span
                class="font-heading font-medium tracking-tight text-dark transition-all duration-500 block"
                :class="scrolled ? 'text-2xl md:text-2xl' : 'text-3xl md:text-4xl'"
              >
                Boticia
              </span>
              <p
                class="text-dark/70 transition-all duration-500"
                :class="scrolled ? 'text-xs mt-0.5' : 'text-sm mt-1'"
              >
                {{ t("app.tagline") }}
              </p>
            </NuxtLink>
          </div>

          <!-- Right nav -->
          <div class="hidden md:flex items-center justify-end gap-8">
            <NuxtLink
              :to="localePath('/contact')"
              class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors"
            >
              {{ t("nav.quote") }}
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2"
            @click="openMobileMenu"
            :aria-label="t('common.menu')"
          >
            <IconLucid name="Menu" size="sm" />
          </button>
        </nav>
      </div>
    </header>

    <!-- Mobile modal navigation -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-[100] bg-cream md:hidden"
        >
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-5">
            <NuxtLink
              :to="localePath('/')"
              class="font-heading font-medium text-2xl tracking-tight text-dark"
              @click="closeMobileMenu"
            >
              Boticia
            </NuxtLink>
            <button
              @click="closeMobileMenu"
              class="p-2 -mr-2"
              :aria-label="t('common.close')"
            >
              <IconLucid name="X" size="sm" />
            </button>
          </div>

          <!-- Navigation links -->
          <div class="flex flex-col px-6 mt-4 gap-3">
            <NuxtLink
              v-for="(link, i) in navLinks"
              :key="link.key"
              :to="localePath(link.to)"
              class="block w-full border-2 border-dark bg-white px-6 py-5 text-base font-semibold uppercase tracking-[0.2em] text-dark transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
              :style="{ transitionDelay: `${i * 50}ms` }"
              :class="mobileMenuVisible ? 'opacity-100 translate-y-0 shadow-[4px_4px_0px_0px_rgba(43,43,43,1)]' : 'opacity-0 translate-y-4'"
              @click="closeMobileMenu"
            >
              {{ t(link.key) }}
            </NuxtLink>

            <!-- CTA : Demander un devis -->
            <NuxtLink
              :to="localePath('/contact')"
              class="block w-full border-2 border-dark bg-dark px-6 py-5 text-base font-semibold uppercase tracking-[0.2em] text-cream text-center transition-all active:translate-x-1 active:translate-y-1 active:shadow-none mt-2"
              :class="mobileMenuVisible ? 'opacity-100 translate-y-0 shadow-[4px_4px_0px_0px_rgba(43,43,43,0.5)]' : 'opacity-0 translate-y-4'"
              :style="{ transitionDelay: `${navLinks.length * 50}ms` }"
              @click="closeMobileMenu"
            >
              {{ t("nav.quote") }}
            </NuxtLink>
          </div>

          <!-- Bottom section -->
          <div class="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <!-- Mon Espace -->
            <NuxtLink
              :to="localePath(user ? '/dashboard' : '/login')"
              class="block w-full border-2 border-dark/20 bg-cream px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-dark text-center transition-all"
              @click="closeMobileMenu"
            >
              {{ t("nav.login") }}
            </NuxtLink>

            <!-- Language selector -->
            <div class="flex items-center justify-center gap-6 mt-6">
              <button
                v-for="loc in availableLocales"
                :key="loc.code"
                @click="switchLocale(loc.code); closeMobileMenu()"
                class="text-sm uppercase tracking-[0.15em] transition-colors duration-300"
                :class="locale === loc.code ? 'text-dark font-semibold' : 'text-dark/40'"
              >
                {{ loc.code }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
const user = useSupabaseUser();
const mobileMenuOpen = ref(false);
const mobileMenuVisible = ref(false);
const scrolled = ref(false);

const navLinks = [
  { key: "nav.weddings", to: "/pricing" },
  { key: "nav.events", to: "/events" },
  { key: "nav.workshops", to: "/workshops" },
];

const openMobileMenu = () => {
  mobileMenuOpen.value = true;
  document.body.style.overflow = "hidden";
  nextTick(() => {
    requestAnimationFrame(() => {
      mobileMenuVisible.value = true;
    });
  });
};

const closeMobileMenu = () => {
  mobileMenuVisible.value = false;
  document.body.style.overflow = "";
  setTimeout(() => {
    mobileMenuOpen.value = false;
  }, 200);
};

const onEscape = (e) => {
  if (e.key === "Escape" && mobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 50;
  });
  window.addEventListener("keydown", onEscape);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onEscape);
  document.body.style.overflow = "";
});

const availableLocales = [
  { code: "fr" },
  { code: "en" },
  { code: "ja" },
];

const switchLocale = (code) => {
  router.push(switchLocalePath(code));
};
</script>
