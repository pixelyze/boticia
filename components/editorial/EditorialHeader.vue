<template>
  <!-- [COMP-EDITORIAL-HEADER] — En-tête du design « gravure et encre »
       Ordinateur : logo texte, menu en minuscules grasses, lien devis
       en italique, langues. Téléphone : bouton menu qui ouvre un
       panneau plein écran (Échap ou bouton pour fermer). -->
  <header class="flex items-center justify-between gap-6 px-[5%] py-6 md:py-8">
    <NuxtLink
      :to="localePath('/')"
      class="text-2xl font-bold no-underline md:text-[28px]"
    >
      boticia
    </NuxtLink>

    <nav
      :aria-label="$t('editorial.nav.main_label')"
      class="hidden items-center gap-x-10 text-lg font-bold lg:flex xl:gap-x-11 xl:text-xl"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.label"
        :to="localePath(link.to)"
        class="no-underline transition-opacity duration-300 hover:opacity-70"
      >
        {{ $t(link.label) }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('/devis')"
        class="font-normal italic text-ed-accent underline decoration-1 underline-offset-[6px] transition-opacity duration-300 hover:opacity-70"
      >
        {{ $t("editorial.nav.quote") }}
      </NuxtLink>
      <ul
        :aria-label="$t('editorial.nav.languages_label')"
        class="flex gap-3 text-sm font-normal uppercase tracking-wider"
      >
        <li v-for="loc in locales" :key="loc">
          <NuxtLink
            :to="switchLocalePath(loc)"
            :lang="loc"
            :aria-current="locale === loc ? 'true' : undefined"
            class="no-underline"
            :class="locale === loc ? 'font-bold' : 'opacity-60 hover:opacity-100'"
          >
            {{ loc }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <Button
      variant="ghost"
      icon-only
      icon="Menu"
      class="!text-ed-ink hover:!bg-ed-ink/5 lg:hidden"
      :aria-label="$t('editorial.nav.menu_open')"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      @click="menuOpen = true"
    />

    <!-- Menu téléphone -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-ed-ground p-2.5 lg:hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('editorial.nav.main_label')"
      >
        <div class="flex min-h-full flex-col border-[1.5px] border-ed-ink px-6 py-6">
          <div class="flex items-center justify-between">
            <NuxtLink
              :to="localePath('/')"
              class="text-2xl font-bold no-underline"
              @click="menuOpen = false"
            >
              boticia
            </NuxtLink>
            <Button
              variant="ghost"
              icon-only
              icon="X"
              class="!text-ed-ink hover:!bg-ed-ink/5"
              :aria-label="$t('editorial.nav.menu_close')"
              @click="menuOpen = false"
            />
          </div>
          <nav
            :aria-label="$t('editorial.nav.main_label')"
            class="mt-14 flex flex-col gap-5 text-5xl leading-none"
          >
            <NuxtLink
              v-for="link in links"
              :key="link.label"
              :to="localePath(link.to)"
              class="no-underline"
              @click="menuOpen = false"
            >
              {{ $t(link.label) }}
            </NuxtLink>
          </nav>
          <Button
            variant="link"
            right-icon="MoveRight"
            :to="localePath('/devis')"
            class="mt-10 text-2xl text-ed-accent"
            @click="menuOpen = false"
          >
            {{ $t("editorial.nav.quote") }}
          </Button>
          <ul
            :aria-label="$t('editorial.nav.languages_label')"
            class="mt-auto flex gap-6 pt-12 text-base uppercase tracking-wider"
          >
            <li v-for="loc in locales" :key="loc">
              <NuxtLink
                :to="switchLocalePath(loc)"
                :lang="loc"
                :aria-current="locale === loc ? 'true' : undefined"
                class="inline-flex min-h-[44px] items-center no-underline"
                :class="locale === loc ? 'font-bold' : 'opacity-60'"
                @click="menuOpen = false"
              >
                {{ loc }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const links = [
  { to: "/mariages", label: "editorial.nav.weddings" },
  { to: "/evenements", label: "editorial.nav.events" },
  { to: "/evenements", label: "editorial.nav.subscription" },
];
const locales = ["fr", "en", "ja"];

const menuOpen = ref(false);

// Bloque le défilement de la page sous le menu ouvert
watch(menuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? "hidden" : "";
});

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") menuOpen.value = false;
};
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>
