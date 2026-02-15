<template>
  <header
    class="sticky top-0 z-50 bg-cream transition-all duration-500"
    :class="scrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm py-0' : ''"
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
            :to="localePath('/workshops')"
            class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors"
          >
            {{ t("nav.workshops") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/shop')"
            class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors"
          >
            {{ t("nav.shop") }}
          </NuxtLink>

          <!-- Language selector desktop -->
          <div class="flex items-center gap-2 text-xs text-dark/40">
            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              @click="switchLocale(loc.code)"
              class="uppercase tracking-wider transition-colors duration-300"
              :class="locale === loc.code ? 'text-dark font-semibold' : 'hover:text-dark'"
            >
              {{ loc.code }}
            </button>
          </div>

          <!-- Mon Espace button -->
          <NuxtLink
            :to="localePath(user ? '/dashboard' : '/login')"
            class="text-xs font-semibold uppercase tracking-[0.2em] text-dark hover:text-dark transition-colors border-2 border-dark px-4 py-2"
          >
            {{ t("nav.login") }}
          </NuxtLink>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-label="t('common.menu')"
        >
          <IconLucid :name="mobileMenuOpen ? 'X' : 'Menu'" size="sm" />
        </button>
      </nav>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-6 pb-2 flex flex-col items-center gap-4">
        <NuxtLink
          :to="localePath('/pricing')"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-dark"
          @click="mobileMenuOpen = false"
        >
          {{ t("nav.weddings") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/events')"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-dark"
          @click="mobileMenuOpen = false"
        >
          {{ t("nav.events") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/workshops')"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-dark"
          @click="mobileMenuOpen = false"
        >
          {{ t("nav.workshops") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/shop')"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-dark"
          @click="mobileMenuOpen = false"
        >
          {{ t("nav.shop") }}
        </NuxtLink>

        <!-- Language selector mobile -->
        <div class="flex items-center gap-3 mt-2 pt-4 border-t border-dark/10">
          <button
            v-for="loc in availableLocales"
            :key="loc.code"
            @click="switchLocale(loc.code); mobileMenuOpen = false"
            class="text-xs uppercase tracking-wider transition-colors duration-300"
            :class="locale === loc.code ? 'text-dark font-semibold' : 'text-dark/40 hover:text-dark'"
          >
            {{ loc.code }}
          </button>
        </div>

        <!-- Mon Espace button mobile -->
        <NuxtLink
          :to="localePath(user ? '/dashboard' : '/login')"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-dark border-2 border-dark px-6 py-2 mt-2"
          @click="mobileMenuOpen = false"
        >
          {{ t("nav.login") }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
const user = useSupabaseUser();
const mobileMenuOpen = ref(false);
const scrolled = ref(false);

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 50;
  });
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
