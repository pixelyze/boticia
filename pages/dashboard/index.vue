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
      <section class="py-6 md:py-8">
        <div class="px-10">
          <!-- Welcome -->
          <div class="mb-10 copilot-fade-in copilot-fade-in-1">
            <h1 class="text-2xl md:text-3xl font-bold">
              {{ greeting }}, {{ userDisplayName }}
            </h1>
            <p class="text-dark/40 mt-1">{{ motivationalQuote }}</p>
          </div>

          <!-- New quotes block -->
          <div class="rounded-[2rem] bg-cream/50 p-8 md:p-10 mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold">
                  {{ t("dashboard.quotes_title") }}
                </h2>
                <p v-if="newQuotes.length > 0" class="text-dark/40 text-sm mt-1">
                  {{ t("dashboard.quotes_count", { count: newQuotes.length }) }}
                </p>
              </div>
              <button
                @click="navigateTo(localePath('/dashboard/quotes'))"
                class="px-5 py-2.5 rounded-full bg-cream-dark text-sm font-semibold text-dark/60 hover:text-dark/80 transition-all"
              >
                {{ t("dashboard.quotes_see_all") }}
              </button>
            </div>

            <!-- Loading -->
            <div v-if="loadingQuotes" class="py-12 text-center">
              <IconLucid
                name="Loader2"
                size="lg"
                class="animate-spin mx-auto text-dark/30"
              />
            </div>

            <!-- Empty -->
            <div
              v-else-if="newQuotes.length === 0"
              class="py-12 text-center"
            >
              <IconLucid
                name="CheckCircle"
                size="lg"
                class="mx-auto text-dark/20 mb-4"
              />
              <p class="text-dark/40">
                {{ t("dashboard.quotes_no_new") }}
              </p>
            </div>

            <!-- List -->
            <div v-else class="space-y-3">
              <button
                v-for="quote in newQuotes"
                :key="quote.id"
                class="w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-cream-dark transition-all hover:bg-cream group text-left"
                @click="navigateTo(localePath('/dashboard/quotes/' + quote.id))"
              >
                <div class="flex-1 min-w-0">
                  <span class="font-heading text-lg text-dark block truncate">
                    {{ quote.partner1_name }} & {{ quote.partner2_name }}
                  </span>
                  <div class="flex items-center gap-3 mt-1">
                    <Tag variant="warning">
                      {{ t("dashboard.quote_status_new") }}
                    </Tag>
                    <span class="text-base text-fuchsia-600 truncate">
                      {{ quote.email }}
                    </span>
                    <span class="text-base text-fuchsia-600 hidden md:inline">
                      {{ formatDate(quote.created_at) }}
                    </span>
                  </div>
                </div>
                <IconLucid
                  name="ArrowRight"
                  size="sm"
                  class="text-stone-400 group-hover:text-orange-500 transition-colors shrink-0 ml-4"
                />
              </button>
            </div>
          </div>

          <!-- Content management -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Page d'accueil — with sub-links -->
            <div
              class="rounded-[1.5rem] bg-cream/50 p-6 flex flex-col items-center text-center gap-3 copilot-fade-in"
              :style="{ animationDelay: '0.3s' }"
            >
              <div class="w-14 h-14 rounded-2xl bg-cream-dark flex items-center justify-center">
                <IconLucid name="Layout" size="md" class="text-dark" />
              </div>
              <div>
                <span class="font-heading text-base text-dark block">
                  {{ t("dashboard.page_home") }}
                </span>
                <span class="text-sm text-dark/40">
                  {{ t("dashboard.page_home_desc") }}
                </span>
              </div>
              <NuxtLink
                :to="localePath('/dashboard/inspirations')"
                class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-dark/50 hover:text-dark transition-colors"
              >
                <IconLucid name="Images" size="xs" color="currentColor" />
                {{ t("dashboard.page_inspirations") }}
              </NuxtLink>
            </div>

            <!-- Other pages -->
            <NuxtLink
              v-for="(page, i) in contentPages"
              :key="page.key"
              :to="localePath(page.to)"
              class="rounded-[1.5rem] bg-cream/50 p-6 flex flex-col items-center text-center gap-3 transition-all hover:bg-cream group copilot-fade-in"
              :style="{ animationDelay: `${0.37 + i * 0.07}s` }"
            >
              <div class="w-14 h-14 rounded-2xl bg-cream-dark flex items-center justify-center transition-colors">
                <IconLucid
                  :name="page.icon"
                  size="md"
                  class="text-dark"
                />
              </div>
              <div>
                <span class="font-heading text-base text-dark block">
                  {{ t(page.key) }}
                </span>
                <span class="text-sm text-dark/40">
                  {{ t(page.descKey) }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type { QuoteRequest } from "~/server/utils/quotes-types";

definePageMeta({
  ssr: false,
  layout: 'dashboard',
  middleware: ['auth-admin'],
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = null;

const contentPages = [
  { key: "dashboard.page_weddings", descKey: "dashboard.page_weddings_desc", icon: "Heart", to: "/dashboard" },
  { key: "dashboard.page_events", descKey: "dashboard.page_events_desc", icon: "PartyPopper", to: "/dashboard" },
  { key: "dashboard.page_workshops", descKey: "dashboard.page_workshops_desc", icon: "Flower2", to: "/dashboard" },
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

// Quotes
const { adminFetch } = useAdminFetch();
const quotes = ref<QuoteRequest[]>([]);
const loadingQuotes = ref(true);

const newQuotes = computed(() =>
  quotes.value.filter((q) => q.status === "new")
);

const fetchQuotes = async () => {
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest[];
    }>("/api/quotes");
    quotes.value = res.data;
  } catch (err) {
    console.error("Error fetching quotes:", err);
  } finally {
    loadingQuotes.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  fetchQuotes();
});

useHead({
  title: t("dashboard.page_title"),
});
</script>
