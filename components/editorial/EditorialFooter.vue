<template>
  <!-- [COMP-EDITORIAL-FOOTER] — Pied de page du design « gravure et encre » -->
  <footer
    class="flex flex-col gap-9 border-t-[1.5px] border-ed-ink px-[5%] pb-9 pt-12"
  >
    <div class="flex flex-wrap items-start justify-between gap-x-16 gap-y-8">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :to="localePath('/')"
          class="text-3xl font-bold no-underline"
        >
          boticia
        </NuxtLink>
        <p class="text-[17px] italic">{{ $t("editorial.footer.tagline") }}</p>
      </div>
      <nav
        :aria-label="$t('editorial.footer.nav_label')"
        class="flex flex-wrap gap-x-9 gap-y-3 text-lg"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="localePath(link.to)"
          class="no-underline hover:opacity-70"
        >
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>
      <nav
        :aria-label="$t('editorial.footer.social_label')"
        class="flex flex-wrap gap-x-7 gap-y-3 text-lg italic"
      >
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-1 underline-offset-4 hover:opacity-70"
        >{{ social.name }}</a>
      </nav>
    </div>
    <p class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      <span>{{ $t("footer.copyright") }}</span>
      <NuxtLink :to="localePath('/legal')" class="underline underline-offset-2">
        {{ $t("footer.legal_link") }}
      </NuxtLink>
      <NuxtLink :to="localePath('/login')" class="underline underline-offset-2">
        {{ $t("nav.login") }}
      </NuxtLink>
    </p>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

const links = [
  { to: "/mariages", label: "editorial.services.weddings_title" },
  { to: "/evenements", label: "editorial.services.events_title" },
  { to: "/ateliers", label: "editorial.services.workshops_title" },
  { to: "/about", label: "footer.about_link" },
  { to: "/faq", label: "editorial.footer.faq" },
];

const socials = [
  { name: "Instagram", href: "https://instagram.com/boticia_" },
  { name: "Pinterest", href: "https://fr.pinterest.com/Boticia_Paris/" },
  { name: "Facebook", href: "https://www.facebook.com/BoticiaParis/" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/la%C3%ABtitia-schaeffer-cr%C3%A9atrice-florale/",
  },
];
</script>
