<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10">
        <!-- Status filters -->
        <div class="flex flex-wrap gap-2 mb-6 copilot-fade-in copilot-fade-in-1">
          <button
            v-for="filter in statusFilters"
            :key="filter.value"
            class="px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all"
            :class="
              activeFilter === filter.value
                ? 'bg-dark text-cream border-dark'
                : 'bg-cream text-dark/60 border-dark/10 hover:border-dark/30'
            "
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="py-16 text-center">
          <IconLucid
            name="Loader2"
            size="lg"
            class="animate-spin mx-auto text-dark/30"
          />
          <p class="text-dark/40 mt-4">{{ t("common.loading") }}</p>
        </div>

        <!-- Error -->
        <div
          v-else-if="fetchError"
          class="py-16 text-center"
        >
          <IconLucid
            name="AlertCircle"
            size="lg"
            class="mx-auto text-red-400 mb-4"
          />
          <p class="text-dark/60 mb-4">
            {{ t("dashboard.quotes_error") }}
          </p>
          <Button icon="RefreshCw" @click="fetchQuotes">
            {{ t("dashboard.quotes_retry") }}
          </Button>
        </div>

        <!-- Empty -->
        <div
          v-else-if="filteredQuotes.length === 0"
          class="py-16 text-center"
        >
          <IconLucid
            name="Inbox"
            size="lg"
            class="mx-auto text-dark/20 mb-4"
          />
          <p class="text-dark/40">
            {{
              activeFilter
                ? t("dashboard.quotes_empty_filtered")
                : t("dashboard.quotes_empty")
            }}
          </p>
        </div>

        <!-- List -->
        <div v-else class="space-y-3">
          <button
            v-for="(quote, i) in filteredQuotes"
            :key="quote.id"
            class="w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all group text-left copilot-fade-in"
            :class="
              quote.budget === 'lt_10000'
                ? 'bg-cream-dark hover:bg-cream border-2 border-dark/60'
                : quote.budget === 'lt_4000'
                  ? 'bg-cream-dark hover:bg-cream border-2 border-fuchsia-400/45'
                  : 'bg-cream-dark hover:bg-cream'
            "
            :style="{ animationDelay: `${0.1 + i * 0.07}s` }"
            @click="navigateTo(localePath('/dashboard/quotes/' + quote.id))"
          >
            <div class="flex-1 min-w-0">
              <span class="font-heading text-lg text-dark block truncate">
                {{ quote.partner1_name }} & {{ quote.partner2_name }}
              </span>
              <div class="flex items-center gap-3 mt-1">
                <Tag :variant="statusVariant(quote.status)">
                  {{ t(`dashboard.quote_status_${quote.status}`) }}
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type {
  QuoteRequest,
  QuoteRequestStatus,
} from "~/server/utils/quotes-types";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const { adminFetch } = useAdminFetch();

const pageTitle = useState<string | null>("dashboard-page-title", () => null);
pageTitle.value = t("dashboard.quotes_title");

useHead({
  title: t("dashboard.quotes_title") + " - Boticia",
});

// State
const quotes = ref<QuoteRequest[]>([]);
const loading = ref(true);
const refreshing = ref(false);
const activeFilter = ref<string>("");
const fetchError = ref(false);

// Filters
const statusFilters = computed(() => [
  { label: t("dashboard.quotes_filter_all"), value: "" },
  { label: t("dashboard.quotes_filter_new"), value: "new" },
  { label: t("dashboard.quotes_filter_contacted"), value: "contacted" },
  {
    label: t("dashboard.quotes_filter_quote_sent"),
    value: "quote_sent",
  },
  { label: t("dashboard.quotes_filter_signed"), value: "signed" },
  {
    label: t("dashboard.quotes_filter_completed"),
    value: "completed",
  },
  {
    label: t("dashboard.quotes_filter_cancelled"),
    value: "cancelled",
  },
]);

const filteredQuotes = computed(() => {
  if (!activeFilter.value) return quotes.value;
  return quotes.value.filter((q) => q.status === activeFilter.value);
});

// Status tag variant mapping
const statusVariant = (
  status: QuoteRequestStatus
): "default" | "success" | "warning" | "info" | "completed" => {
  const map: Record<QuoteRequestStatus, string> = {
    new: "warning",
    contacted: "info",
    quote_sent: "selection",
    signed: "success",
    completed: "completed",
    cancelled: "default",
  };
  return (map[status] || "default") as any;
};

// Fetch quotes
const fetchQuotes = async () => {
  refreshing.value = true;
  fetchError.value = false;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest[];
    }>("/api/quotes");
    quotes.value = res.data;
  } catch (err) {
    console.error("Error fetching quotes:", err);
    fetchError.value = true;
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// Date formatting
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
</script>
