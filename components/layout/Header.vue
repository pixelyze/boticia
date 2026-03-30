<template>
  <div class="fixed top-0 left-0 right-0 z-50">
    <!-- Main header -->
    <header class="transition-all duration-500" :class="isTransparent ? 'bg-transparent' : 'bg-cream-light'">
      <div class="px-4 md:px-10 transition-all duration-500" :class="scrolled ? 'pt-2 pb-2' : 'pt-4 pb-4'">
        <div
          class="rounded-full transition-all duration-500"
          :class="isTransparent ? 'py-4 px-4 md:px-8 border-2 border-transparent' : 'py-2 px-5 md:px-12 bg-cream-light/90 backdrop-blur-md border-2 border-transparent'"
        >
        <!-- Main nav -->
        <nav class="flex items-center justify-between md:grid md:grid-cols-3">
          <!-- Left nav -->
          <div class="hidden md:flex items-center gap-8">
            <NuxtLink
              :to="localePath('/mariages')"
              class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              :class="isTransparent ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-dark/60'"
            >
              {{ t("nav.weddings") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/evenements')"
              class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              :class="isTransparent ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-dark/60'"
            >
              {{ t("nav.events") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/ateliers')"
              class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              :class="isTransparent ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-dark/60'"
            >
              {{ t("nav.workshops") }}
            </NuxtLink>
          </div>

          <!-- Center logo -->
          <div class="flex flex-col items-center">
            <NuxtLink :to="localePath('/')" class="text-center">
              <span
                class="font-heading font-medium tracking-tight transition-all duration-500 block"
                :class="isTransparent ? 'text-xl md:text-4xl text-cream' : 'text-xl md:text-2xl text-dark'"
              >
                Boticia
              </span>
              <p
                class="transition-all duration-500 hidden md:block"
                :class="isTransparent ? 'text-base mt-1 text-cream/50' : 'text-sm mt-0.5 text-dark/60'"
              >
                {{ t("app.tagline") }}
              </p>
            </NuxtLink>
          </div>

          <!-- Right nav -->
          <div class="hidden md:flex items-center justify-end gap-4">
            <NuxtLink
              :to="localePath('/devis')"
              class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              :class="isTransparent ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-dark/60'"
            >
              {{ t("nav.quote") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath(userSpaceRoute)"
              class="px-5 py-2 rounded-full border-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all"
              :class="isTransparent ? 'border-cream/20 bg-cream/10 text-cream hover:bg-cream/20' : 'border-transparent bg-dark/10 text-dark hover:bg-dark/15'"
            >
              {{ t("nav.login") }}
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            ref="hamburgerBtn"
            class="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            :class="isTransparent ? 'bg-cream/10 hover:bg-cream/20 text-cream' : 'bg-dark/5 hover:bg-dark/10 text-dark'"
            @click="openMobileMenu"
            :aria-label="t('common.menu')"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
          >
            <IconLucid name="Menu" size="sm" />
          </button>
        </nav>
        </div>

        <!-- Utility row under pill -->
        <div class="hidden md:flex items-center justify-between px-8 mt-2">
          <!-- Language toggle -->
          <div class="inline-flex items-center rounded-full p-0.5">
            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              @click="switchLocale(loc.code)"
              :lang="loc.code"
              :aria-label="loc.label"
              class="px-3 py-1.5 text-xs uppercase tracking-wider rounded-full transition-all duration-300"
              :class="isTransparent
                ? (locale === loc.code ? 'bg-cream/15 text-cream font-semibold' : 'text-cream/30 hover:text-cream/60')
                : (locale === loc.code ? 'bg-dark/10 text-dark font-semibold' : 'text-dark/30 hover:text-dark/60')"
            >
              {{ loc.code }}
            </button>
          </div>

        </div>
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
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          :aria-label="t('common.menu')"
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
              ref="closeBtn"
              @click="closeMobileMenu"
              class="p-2 -mr-2"
              :aria-label="t('common.close')"
            >
              <IconLucid name="X" size="sm" />
            </button>
          </div>

          <!-- Navigation links -->
          <nav class="flex flex-col px-6 mt-8">
            <NuxtLink
              v-for="(link, i) in mobileNavLinks"
              :key="link.key"
              :to="localePath(link.to)"
              class="flex items-center justify-between py-5 border-b border-dark/10 transition-all duration-300"
              :class="mobileMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
              :style="{ transitionDelay: `${i * 60}ms` }"
              @click="closeMobileMenu"
            >
              <span
                class="font-heading text-xl"
                :class="isActivePath(link.to) ? 'text-dark' : 'text-dark/70'"
              >
                {{ t(link.key) }}
              </span>
              <IconLucid
                name="ArrowRight"
                size="xs"
                class="text-dark/30"
                :strokeWidth="1.5"
              />
            </NuxtLink>
          </nav>

          <!-- CTA -->
          <div class="px-6 mt-10">
            <NuxtLink
              ref="firstMenuLink"
              :to="localePath('/devis')"
              class="block w-full rounded-full bg-dark px-6 py-4 text-base font-medium text-cream text-center transition-all duration-300"
              :class="mobileMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
              :style="{ transitionDelay: `${mobileNavLinks.length * 60}ms` }"
              @click="closeMobileMenu"
            >
              {{ t("nav.quote") }}
            </NuxtLink>
          </div>

          <!-- Bottom section -->
          <div class="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <!-- Mon Espace -->
            <NuxtLink
              :to="localePath(userSpaceRoute)"
              class="w-full rounded-full border border-dark/15 px-6 py-3.5 text-sm text-dark text-center transition-all flex items-center justify-center gap-2"
              @click="closeMobileMenu"
            >
              <IconLucid name="User" size="xs" class="text-dark/50" :strokeWidth="1.5" />
              {{ t("nav.login") }}
            </NuxtLink>

            <!-- Language selector -->
            <div class="flex items-center justify-center gap-6 mt-5">
              <button
                v-for="loc in availableLocales"
                :key="loc.code"
                @click="switchLocale(loc.code); closeMobileMenu()"
                :lang="loc.code"
                :aria-label="loc.label"
                class="text-sm uppercase tracking-wider transition-colors duration-300"
                :class="locale === loc.code ? 'text-dark font-semibold' : 'text-dark/35'"
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
const route = useRoute();
const user = useSupabaseUser();
const userRole = ref("");

watch(
  user,
  async (u) => {
    if (u?.email) {
      try {
        const data = await $fetch("/api/user/role", {
          params: { email: u.email },
        });
        userRole.value = data.role;
      } catch {
        userRole.value = "";
      }
    } else {
      userRole.value = "";
    }
  },
  { immediate: true }
);

const userSpaceRoute = computed(() => {
  if (!user.value) return "/login";
  if (userRole.value === "admin") return "/dashboard";
  if (userRole.value === "client") return "/mon-projet";
  return "/login";
});

const mobileMenuOpen = ref(false);
const mobileMenuVisible = ref(false);
const scrolled = ref(false);

// Transparent navbar only on homepage (dark hero)
const isHomepage = computed(() => {
  const path = route.path.replace(/^\/(fr|en|ja)/, '') || '/';
  return path === '/';
});
const isTransparent = computed(() => isHomepage.value && !scrolled.value);

// Reset header to expanded state on route change
watch(() => route.path, () => {
  scrolled.value = false;
});

// Template refs for focus management
const hamburgerBtn = ref(null);
const closeBtn = ref(null);
const firstMenuLink = ref(null);

const navLinks = [
  { key: "nav.weddings", to: "/mariages" },
  { key: "nav.events", to: "/evenements" },
  { key: "nav.workshops", to: "/ateliers" },
];

const mobileNavLinks = [
  { key: "nav.weddings", to: "/mariages" },
  { key: "nav.events", to: "/evenements" },
  { key: "nav.workshops", to: "/ateliers" },
];

// Active path detection for mobile menu
const isActivePath = (path) => {
  const currentPath = route.path;
  const resolvedPath = localePath(path);
  return currentPath === resolvedPath
    || currentPath.startsWith(resolvedPath + "/");
};

const openMobileMenu = () => {
  mobileMenuOpen.value = true;
  document.body.style.overflow = "hidden";
  nextTick(() => {
    requestAnimationFrame(() => {
      mobileMenuVisible.value = true;
      // Focus the first interactive element (CTA link)
      nextTick(() => {
        const menu = document.getElementById("mobile-menu");
        if (menu) {
          const firstFocusable = menu.querySelector(
            "a, button, [tabindex]"
          );
          if (firstFocusable) firstFocusable.focus();
        }
      });
    });
  });
};

const closeMobileMenu = () => {
  mobileMenuVisible.value = false;
  document.body.style.overflow = "";
  setTimeout(() => {
    mobileMenuOpen.value = false;
    // Return focus to hamburger button
    nextTick(() => {
      hamburgerBtn.value?.focus();
    });
  }, 200);
};

// Focus trap: keep Tab cycling within the mobile menu
const onKeydown = (e) => {
  if (e.key === "Escape" && mobileMenuOpen.value) {
    closeMobileMenu();
    return;
  }
  if (e.key === "Tab" && mobileMenuOpen.value) {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;
    const focusables = menu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 50;
  });
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

const availableLocales = [
  { code: "fr", label: "Passer en fran\u00e7ais" },
  { code: "en", label: "Switch to English" },
  { code: "ja", label: "\u65e5\u672c\u8a9e\u306b\u5207\u308a\u66ff\u3048" },
];

const switchLocale = (code) => {
  router.push(switchLocalePath(code));
};
</script>
