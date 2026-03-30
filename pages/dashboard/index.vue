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

          <!-- Pipeline résumé -->
          <div
            class="rounded-[2rem] bg-cream/50 p-8 md:p-10 mb-8 copilot-fade-in copilot-fade-in-2"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold">
                {{ t("dashboard.pipeline_title") }}
              </h2>
              <button
                @click="navigateTo(localePath('/dashboard/quotes'))"
                class="px-5 py-2.5 rounded-full bg-cream-dark text-sm font-semibold text-dark/60 hover:text-dark/80 transition-all"
              >
                {{ t("dashboard.quotes_see_all") }}
              </button>
            </div>

            <!-- Loading -->
            <div v-if="loadingQuotes" class="py-8 text-center">
              <IconLucid
                name="Loader2"
                size="lg"
                class="animate-spin mx-auto text-dark/30"
              />
            </div>

            <!-- Empty (no quotes at all) -->
            <div
              v-else-if="quotes.length === 0"
              class="py-8 text-center"
            >
              <IconLucid
                name="Inbox"
                size="lg"
                class="mx-auto text-dark/20 mb-4"
              />
              <p class="text-dark/40">
                {{ t("dashboard.pipeline_empty") }}
              </p>
            </div>

            <!-- Pipeline content -->
            <template v-else>
              <!-- Status counters -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="s in pipelineStatuses"
                  :key="s.status"
                  class="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium"
                  :class="
                    statusCount(s.status) > 0
                      ? 'bg-cream-dark hover:bg-cream text-dark'
                      : 'bg-cream/50 text-dark/30 hover:text-dark/50'
                  "
                  @click="
                    navigateTo(
                      localePath('/dashboard/quotes') +
                        '?filter=' +
                        s.status
                    )
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full shrink-0"
                    :class="s.dotColor"
                  ></span>
                  <span>{{ statusCount(s.status) }}</span>
                  <span>{{ t(s.labelKey) }}</span>
                </button>
              </div>

              <!-- Alerts -->
              <div
                v-if="alerts.length > 0"
                class="mt-5 flex flex-col gap-2"
              >
                <button
                  v-for="alert in alerts"
                  :key="alert.id"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-left transition-all"
                  :class="
                    alert.type === 'stale'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  "
                  @click="
                    navigateTo(
                      localePath('/dashboard/quotes/' + alert.id)
                    )
                  "
                >
                  <IconLucid
                    :name="
                      alert.type === 'stale'
                        ? 'AlertTriangle'
                        : 'Clock'
                    "
                    size="sm"
                    class="shrink-0"
                  />
                  <span>{{ alert.message }}</span>
                  <IconLucid
                    name="ChevronRight"
                    size="xs"
                    class="ml-auto shrink-0 opacity-40"
                  />
                </button>
              </div>
            </template>
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
              <NuxtLink
                :to="localePath('/dashboard/galleries')"
                class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-dark/50 hover:text-dark transition-colors"
              >
                <IconLucid name="Image" size="xs" color="currentColor" />
                {{ t("dashboard.page_galleries") }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/dashboard/photo-citation')"
                class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-dark/50 hover:text-dark transition-colors"
              >
                <IconLucid name="Camera" size="xs" color="currentColor" />
                {{ t("dashboard.blockquote_title") }}
              </NuxtLink>
            </div>

            <!-- Mariages — with sub-link -->
            <div
              class="rounded-[1.5rem] bg-cream/50 p-6 flex flex-col items-center text-center gap-3 copilot-fade-in"
              :style="{ animationDelay: '0.37s' }"
            >
              <div class="w-14 h-14 rounded-2xl bg-cream-dark flex items-center justify-center">
                <IconLucid name="Heart" size="md" class="text-dark" />
              </div>
              <div>
                <span class="font-heading text-base text-dark block">
                  {{ t("dashboard.page_weddings") }}
                </span>
                <span class="text-sm text-dark/40">
                  {{ t("dashboard.page_weddings_desc") }}
                </span>
              </div>
              <NuxtLink
                :to="localePath('/dashboard/galleries')"
                class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-dark/50 hover:text-dark transition-colors"
              >
                <IconLucid name="Image" size="xs" color="currentColor" />
                {{ t("dashboard.page_galleries") }}
              </NuxtLink>
            </div>

            <!-- Other pages -->
            <NuxtLink
              v-for="(page, i) in contentPages"
              :key="page.key"
              :to="localePath(page.to)"
              class="rounded-[1.5rem] bg-cream/50 p-6 flex flex-col items-center text-center gap-3 transition-all hover:bg-cream group copilot-fade-in"
              :style="{ animationDelay: `${0.44 + i * 0.07}s` }"
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
  { key: "dashboard.page_events", descKey: "dashboard.page_events_desc", icon: "PartyPopper", to: "/dashboard" },
  { key: "dashboard.page_workshops", descKey: "dashboard.page_workshops_desc", icon: "Flower2", to: "/dashboard" },
];

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

const fetchQuotes = async () => {
  loadingQuotes.value = true;
  try {
    const res = await adminFetch<{ success: boolean; data: QuoteRequest[] }>("/api/quotes");
    quotes.value = res.data;
  } catch (err) {
    console.error("Error fetching quotes:", err);
  } finally {
    loadingQuotes.value = false;
  }
};

onMounted(() => {
  fetchQuotes();
});

// Pipeline statuses config
const pipelineStatuses = [
  { status: "new", labelKey: "dashboard.quotes_filter_new", dotColor: "bg-yellow-400" },
  { status: "contacted", labelKey: "dashboard.quotes_filter_contacted", dotColor: "bg-purple-400" },
  { status: "moodboard_sent", labelKey: "dashboard.quotes_filter_moodboard_sent", dotColor: "bg-blue-400" },
  { status: "quote_sent", labelKey: "dashboard.quotes_filter_quote_sent", dotColor: "bg-orange-400" },
  { status: "signed", labelKey: "dashboard.quotes_filter_signed", dotColor: "bg-green-400" },
  { status: "completed", labelKey: "dashboard.quotes_filter_completed", dotColor: "bg-green-600" },
];

const statusCount = (status: string) =>
  quotes.value.filter((q) => q.status === status).length;

const daysSince = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
};

const daysUntil = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
};

const quoteName = (q: QuoteRequest) =>
  q.partner2_name
    ? `${q.partner1_name} & ${q.partner2_name}`
    : q.partner1_name;

const alerts = computed(() => {
  const result: {
    id: string;
    type: "stale" | "urgent";
    message: string;
  }[] = [];

  for (const q of quotes.value) {
    // Stale: quote_sent for > 7 days
    if (q.status === "quote_sent" && daysSince(q.updated_at) > 7) {
      result.push({
        id: q.id,
        type: "stale",
        message: t("dashboard.alert_stale", {
          name: quoteName(q),
          days: daysSince(q.updated_at),
        }),
      });
    }
    // Urgent: wedding in < 60 days
    if (
      q.wedding_date &&
      q.status !== "completed" &&
      q.status !== "cancelled"
    ) {
      const days = daysUntil(q.wedding_date);
      if (days > 0 && days < 60) {
        result.push({
          id: q.id,
          type: "urgent",
          message: t("dashboard.alert_urgent", {
            name: quoteName(q),
            days,
          }),
        });
      }
    }
  }

  // Sort: stale first, then by urgency (fewer days = more urgent)
  result.sort((a, b) => {
    if (a.type !== b.type) return a.type === "stale" ? -1 : 1;
    return 0;
  });

  return result.slice(0, 3);
});

useHead({
  title: t("dashboard.page_title"),
});
</script>
