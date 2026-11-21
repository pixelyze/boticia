<template>
  <div class="fixed top-0 left-0 right-0 z-50 font-body">
    <!-- Main header -->
    <header class="transition-all duration-500" :class="isHomepage || scrolled ? 'bg-transparent' : 'bg-cream-light'">
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
              :to="localePath('mariages')"
              class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              :class="isTransparent ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-dark/60'"
            >
              {{ t("nav.weddings") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('evenements')"
              class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              :class="isTransparent ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-dark/60'"
            >
              {{ t("nav.events") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('ateliers')"
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
                class="font-heading font-medium tracking-tight transition-all duration-500 block uppercase"
                :class="isTransparent ? 'text-xl md:text-4xl text-cream' : 'text-xl md:text-2xl text-dark'"
              >
                Boticia
              </span>
              <!-- Sous-titre dans la couleur des surtitres (orange vif) -->
              <p
                class="transition-all duration-500 hidden md:block text-orange-500"
                :class="isTransparent ? 'text-base mt-1' : 'text-sm mt-0.5'"
              >
                {{ t("app.tagline") }}
              </p>
            </NuxtLink>
          </div>

          <!-- Right nav -->
          <div class="hidden md:flex items-center justify-end gap-8">
            <!-- Devis : discret, simple lien souligné d'un filet fin -->
            <Button
              variant="link"
              :to="localePath('devis')"
              class="!text-xs !pb-1 [&_svg]:hidden"
              :class="isTransparent ? '!text-cream !border-cream hover:!border-cream/40' : 'hover:!border-dark/40'"
            >
              {{ t("nav.quote") }}
            </Button>
          </div>

          <!-- Mobile menu button : pastille « Menu » + deux traits -->
          <button
            ref="hamburgerBtn"
            class="md:hidden group h-10 w-[7.5rem] rounded-full border flex items-center justify-center gap-3 transition-colors duration-300"
            :class="isTransparent ? 'border-cream/30 text-cream hover:bg-cream/10' : 'border-dark/15 text-dark hover:bg-dark/5'"
            @click="openMobileMenu"
            :aria-label="t('common.menu')"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
          >
            <span class="text-[11px] font-semibold uppercase tracking-[0.2em]">
              {{ t("common.menu") }}
            </span>
            <span class="flex flex-col items-end gap-[5px]" aria-hidden="true">
              <span class="block h-[1.5px] w-5 rounded-full bg-current" />
              <span
                class="block h-[1.5px] w-3 rounded-full bg-current transition-all duration-300 group-hover:w-5"
              />
            </span>
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

          <!-- « Mon espace » : fonction pratique (comme la langue), séparée
               de la navigation principale ; même pastille que la langue active -->
          <Button
            variant="link"
            :to="localePath(userSpaceRoute)"
            class="!px-3 !py-1.5 !rounded-full !text-xs !tracking-wider !border-0 [&_svg]:hidden"
            :class="isTransparent ? '!bg-cream/15 !text-cream hover:!bg-cream/25' : '!bg-dark/10 !text-dark hover:!bg-dark/15'"
          >
            {{ t("nav.login") }}
          </Button>
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
          class="fixed inset-0 z-[100] bg-cream md:hidden flex flex-col overflow-y-auto font-body"
        >
          <!-- Modal header : mêmes marges que l'en-tête, selon son état
               (accueil, défilé…), pour que logo et bouton ne bougent pas. -->
          <div class="px-4" :class="scrolled ? 'pt-2 pb-2' : 'pt-4 pb-4'">
          <div
            class="flex items-center justify-between border-2 border-transparent"
            :class="isTransparent ? 'py-4 px-4' : 'py-2 px-5'"
          >
            <NuxtLink
              :to="localePath('/')"
              class="font-heading font-medium text-xl tracking-tight text-dark uppercase"
              @click="closeMobileMenu"
            >
              Boticia
            </NuxtLink>
            <button
              ref="closeBtn"
              @click="closeMobileMenu"
              class="h-10 w-[7.5rem] rounded-full border border-dark/15 text-dark flex items-center justify-center gap-3 hover:bg-dark/5 transition-colors"
              :aria-label="t('common.close')"
            >
              <span class="text-[11px] font-semibold uppercase tracking-[0.2em]">
                {{ t("common.close") }}
              </span>
              <span class="relative w-4 h-4" aria-hidden="true">
                <span class="absolute top-1/2 left-0 block h-[1.5px] w-4 rounded-full bg-current rotate-45" />
                <span class="absolute top-1/2 left-0 block h-[1.5px] w-4 rounded-full bg-current -rotate-45" />
              </span>
            </button>
          </div>
          </div>

          <!-- Navigation links : grands titres -->
          <nav class="flex flex-col px-6">
            <NuxtLink
              v-for="(link, i) in mobileNavLinks"
              :key="link.key"
              :to="localePath(link.to)"
              class="flex items-center gap-4 py-3 border-b border-dark/10 transition-all duration-500 ease-out"
              :class="mobileMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              :style="{ transitionDelay: `${80 + i * 70}ms` }"
              :aria-current="isActivePath(link.to) ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              <span
                class="font-heading text-[1.75rem] leading-tight text-dark"
                :class="isActivePath(link.to) ? 'italic' : ''"
              >
                {{ t(link.key) }}
              </span>
              <IconLucid
                name="ArrowUpRight"
                size="sm"
                class="ml-auto text-gray-400"
                :strokeWidth="1.5"
              />
            </NuxtLink>

            <!-- Mon Espace : pleine largeur, icône user -->
            <div
              class="pt-3 transition-all duration-500 ease-out"
              :class="mobileMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              :style="{ transitionDelay: `${80 + mobileNavLinks.length * 70}ms` }"
            >
              <Button
                variant="link"
                :to="localePath(userSpaceRoute)"
                :class="MENU_OUTLINE_BUTTON"
                class="w-full"
                @click="closeMobileMenu"
              >
                {{ t("nav.login") }}
              </Button>
            </div>
          </nav>

          <!-- Carte photo + CTA devis : prend toute la hauteur libre -->
          <div
            class="flex-1 flex flex-col px-6 mt-3 transition-all duration-700 ease-out"
            :class="mobileMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
            :style="{ transitionDelay: `${160 + mobileNavLinks.length * 70}ms` }"
          >
            <!-- Contenu en flux (pas en absolu) : rien ne se chevauche quand
                 la carte rétrécit. Écrans bas (< 700 px) : on garde le titre
                 et le bouton, sans la ligne du haut ni la phrase. -->
            <div
              class="relative flex-1 min-h-[10rem] overflow-hidden p-5 flex flex-col justify-between gap-4"
            >
              <img
                :src="menuImageFailed ? HERO_DEFAULT_IMAGE : heroImage"
                alt=""
                @error="menuImageFailed = true"
                class="absolute inset-0 w-full h-full object-cover scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/60 to-dark/40" />
              <span
                class="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/80 [@media(max-height:700px)]:hidden"
              >
                {{ t("app.tagline") }}
              </span>
              <div class="relative mt-auto">
                <p class="font-heading text-[1.75rem] leading-tight text-cream [text-shadow:0_1px_16px_rgb(0_0_0/0.35)]">
                  {{ t("quote_form.tagline") }}
                </p>
                <p
                  class="mt-2 text-[15px] leading-relaxed text-cream/80 [@media(max-height:700px)]:hidden"
                >
                  {{ t("quote_form.subtitle") }}
                </p>
                <Button
                  ref="firstMenuLink"
                  variant="cta"
                  :to="localePath('devis')"
                  class="mt-5 w-full justify-center !bg-cream !text-dark hover:!bg-white"
                  @click="closeMobileMenu"
                >
                  {{ t("nav.quote") }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Bottom section -->
          <div
            class="px-6 pt-3 pb-4 transition-opacity duration-700"
            :class="mobileMenuVisible ? 'opacity-100' : 'opacity-0'"
            :style="{ transitionDelay: `${240 + mobileNavLinks.length * 70}ms` }"
          >
            <!-- Le studio + FAQ : boutons à contour fin, côte à côte
                 (FAQ plus large : son libellé est plus long) -->
            <div class="grid grid-cols-[2fr_3fr] gap-3">
              <Button
                v-for="link in infoNavLinks"
                :key="link.key"
                variant="link"
                :to="localePath(link.to)"
                :class="MENU_OUTLINE_BUTTON"
                class="!tracking-[0.08em] [&_svg]:hidden"
                @click="closeMobileMenu"
              >
                {{ t(link.key) }}
              </Button>
            </div>

            <!-- Langues + Instagram, sous un filet fin -->
            <div
              class="flex items-center justify-between mt-4 pt-4 border-t border-dark/20"
            >
              <div class="flex items-center gap-5">
                <Button
                  v-for="loc in availableLocales"
                  :key="loc.code"
                  variant="link"
                  :class="[
                    '!pb-1 [&_svg]:hidden',
                    locale === loc.code
                      ? ''
                      : '!border-transparent !text-gray-500',
                  ]"
                  @click="switchLocale(loc.code); closeMobileMenu()"
                >
                  {{ loc.code }}
                  <span class="sr-only">{{ loc.label }}</span>
                </Button>
              </div>
              <Button
                variant="link"
                href="https://instagram.com/boticia_"
                target="_blank"
                rel="noopener"
                :class="MENU_TEXT_LINK"
              >
                Instagram
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

// Liens texte du bas du menu mobile : capitales espacées, sans flèche,
// soulignés seulement quand ils sont actifs (langue choisie)
// Boutons secondaires du menu mobile (Mon espace, Le studio, FAQ) :
// pilule à contour fin + flèche, pour qu'on voie que ce sont des boutons
const MENU_OUTLINE_BUTTON =
  "h-11 justify-center !px-3 !pb-0 rounded-full border !border-dark/30 !text-[12px] !tracking-[0.12em] whitespace-nowrap hover:!border-dark active:bg-dark/5";
const MENU_TEXT_LINK =
  "!border-transparent !pb-1 whitespace-nowrap !tracking-[0.15em] [&_svg]:hidden";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();
const userRole = ref("");

// Carte devis du menu mobile : même photo que le hero de l'accueil.
const heroImage = useHeroImage();
const menuImageFailed = ref(false);

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
  { key: "nav.weddings", to: "mariages" },
  { key: "nav.events", to: "evenements" },
  { key: "nav.workshops", to: "ateliers" },
];

const infoNavLinks = [
  { key: "nav.studio", to: "/studio" },
  { key: "footer.faq_link", to: "/faq" },
];

const mobileNavLinks = [
  { key: "nav.weddings", to: "mariages" },
  { key: "nav.events", to: "evenements" },
  { key: "nav.workshops", to: "ateliers" },
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
