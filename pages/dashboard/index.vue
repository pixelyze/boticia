<template>
  <div class="flex-1 flex flex-col bg-white">
    <!-- Loading -->
    <div v-if="!user" class="py-12 md:py-16">
      <div class="px-10">
        <div class="animate-pulse">
          <div class="h-7 bg-gray-200 rounded w-48 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-32 mb-8"></div>
          <div class="space-y-4">
            <div class="h-32 bg-gray-200 rounded-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Authenticated dashboard -->
    <template v-else>
      <section class="py-12 md:py-16">
        <div class="px-10">
          <!-- Welcome -->
          <div class="mb-10">
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ greeting }}, {{ userDisplayName }}
            </h1>
            <p class="text-dark/40 mt-1">{{ motivationalQuote }}</p>
          </div>

          <!-- Content management -->
          <div class="rounded-[2rem] border-2 border-dark/10 overflow-hidden">
            <NuxtLink
              v-for="(page, i) in contentPages"
              :key="page.key"
              :to="localePath(page.to)"
              class="flex items-center justify-between px-8 py-6 transition-colors hover:bg-cream/50 group"
              :class="i < contentPages.length - 1 ? 'border-b-2 border-dark/10' : ''"
            >
              <div>
                <span class="font-heading text-lg text-dark block">
                  {{ t(page.key) }}
                </span>
                <span class="text-sm text-dark/40">
                  {{ t(page.descKey) }}
                </span>
              </div>
              <IconLucid
                name="ChevronRight"
                size="sm"
                class="text-dark/20 group-hover:text-dark/50 transition-colors"
              />
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

definePageMeta({
  ssr: false,
  layout: 'dashboard'
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();

const contentPages = [
  { key: "dashboard.page_home", descKey: "dashboard.page_home_desc", to: "/dashboard" },
  { key: "dashboard.page_weddings", descKey: "dashboard.page_weddings_desc", to: "/dashboard" },
  { key: "dashboard.page_events", descKey: "dashboard.page_events_desc", to: "/dashboard" },
  { key: "dashboard.page_workshops", descKey: "dashboard.page_workshops_desc", to: "/dashboard" },
  { key: "dashboard.page_quotes", descKey: "dashboard.page_quotes_desc", to: "/dashboard/quotes" },
];

// Redirect to login if not authenticated
watch(user, (val) => {
  if (val === null) {
    router.push(localePath('/login'));
  }
}, { immediate: true });

// Greeting
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return t("dashboard.greeting_morning");
  if (hour >= 12 && hour < 18) return t("dashboard.greeting_afternoon");
  return t("dashboard.greeting_evening");
});

const MOTIVATION_COUNT = 8;
const motivationalQuote = computed(() => {
  const index = Math.floor(Math.random() * MOTIVATION_COUNT) + 1;
  return t(`dashboard.motivation_${index}`);
});

const userDisplayName = computed(() => {
  if (!user.value?.email) return "";
  const emailPart = user.value.email.split("@")[0];
  return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
});

useHead({
  title: t("dashboard.page_title"),
});
</script>
