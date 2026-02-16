<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-12 md:py-16">
      <div class="px-10">
        <!-- Bordered container -->
        <div class="rounded-[2rem] border-2 border-dark/10 p-8 md:p-10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold">
                {{ t("dashboard.quotes_title") }}
              </h1>
              <p v-if="quotes.length > 0" class="text-dark/40 text-sm mt-1">
                {{ t("dashboard.quotes_count", { count: quotes.length }) }}
              </p>
            </div>
            <Button
              icon="RefreshCw"
              :loading="refreshing"
              @click="fetchQuotes"
            >
              {{ t("dashboard.quotes_refresh") }}
            </Button>
          </div>

          <!-- Status filters -->
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="filter in statusFilters"
              :key="filter.value"
              class="px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all"
              :class="
                activeFilter === filter.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-dark/60 border-dark/10 hover:border-dark/30'
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
        <div
          v-else
          class="rounded-[2rem] border-2 border-dark/10 overflow-hidden"
        >
          <button
            v-for="(quote, i) in filteredQuotes"
            :key="quote.id"
            class="w-full flex items-center justify-between px-8 py-5 transition-colors hover:bg-cream/50 group text-left"
            :class="
              i < filteredQuotes.length - 1
                ? 'border-b-2 border-dark/10'
                : ''
            "
            @click="openDetail(quote)"
          >
            <div class="flex-1 min-w-0">
              <span class="font-heading text-lg text-dark block truncate">
                {{ quote.partner1_name }} & {{ quote.partner2_name }}
              </span>
              <div class="flex items-center gap-3 mt-1">
                <Tag :variant="statusVariant(quote.status)">
                  {{ t(`dashboard.quote_status_${quote.status}`) }}
                </Tag>
                <span class="text-sm text-dark/40 truncate">
                  {{ quote.email }}
                </span>
                <span class="text-sm text-dark/30 hidden md:inline">
                  {{ formatDate(quote.created_at) }}
                </span>
              </div>
            </div>
            <IconLucid
              name="ChevronRight"
              size="sm"
              class="text-dark/20 group-hover:text-dark/50 transition-colors shrink-0 ml-4"
            />
          </button>
        </div>
        </div>
      </div>
    </section>

    <!-- Detail modal -->
    <BaseModal
      :isOpen="!!selectedQuote"
      :title="
        selectedQuote
          ? `${selectedQuote.partner1_name} & ${selectedQuote.partner2_name}`
          : ''
      "
      :showCloseButton="true"
      :closeButtonText="t('common.close')"
      @close="selectedQuote = null"
    >
      <template v-if="selectedQuote">
        <!-- Status -->
        <div>
          <h4 class="font-heading text-sm text-dark/50 uppercase mb-2">
            {{ t("dashboard.quote_detail_status") }}
          </h4>
          <Select
            v-model="selectedQuote.status"
            :options="statusOptions"
            @update:modelValue="onStatusChange"
          />
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-heading text-sm text-dark/50 uppercase mb-3">
            {{ t("dashboard.quote_detail_contact") }}
          </h4>
          <div class="space-y-2">
            <p class="flex items-center gap-2">
              <IconLucid name="Mail" size="sm" class="text-dark/40" />
              <a
                :href="`mailto:${selectedQuote.email}`"
                class="text-dark underline"
              >
                {{ selectedQuote.email }}
              </a>
            </p>
            <p class="flex items-center gap-2">
              <IconLucid name="User" size="sm" class="text-dark/40" />
              <span v-if="selectedQuote.phone">
                <a
                  :href="`tel:${selectedQuote.phone}`"
                  class="text-dark underline"
                >
                  {{ selectedQuote.phone }}
                </a>
              </span>
              <span v-else class="text-dark/40">
                {{ t("dashboard.quote_detail_no_phone") }}
              </span>
            </p>
          </div>
        </div>

        <!-- Wedding details -->
        <div>
          <h4 class="font-heading text-sm text-dark/50 uppercase mb-3">
            {{ t("dashboard.quote_detail_wedding") }}
          </h4>
          <div class="space-y-2 text-dark/70">
            <p class="flex items-center gap-2">
              <IconLucid name="Calendar" size="sm" class="text-dark/40" />
              <span class="font-medium text-dark/50 w-16">
                {{ t("dashboard.quote_detail_date") }}
              </span>
              <span>
                {{
                  selectedQuote.wedding_date
                    ? formatDate(selectedQuote.wedding_date)
                    : t("dashboard.quote_detail_no_date")
                }}
              </span>
            </p>
            <p class="flex items-center gap-2">
              <IconLucid name="Target" size="sm" class="text-dark/40" />
              <span class="font-medium text-dark/50 w-16">
                {{ t("dashboard.quote_detail_venue") }}
              </span>
              <span>
                {{
                  selectedQuote.venue ||
                  t("dashboard.quote_detail_no_venue")
                }}
              </span>
            </p>
            <p class="flex items-center gap-2">
              <IconLucid
                name="BadgeEuro"
                size="sm"
                class="text-dark/40"
              />
              <span class="font-medium text-dark/50 w-16">
                {{ t("dashboard.quote_detail_budget") }}
              </span>
              <span>
                {{
                  selectedQuote.budget
                    ? t(`quote_form.budget_${selectedQuote.budget}`)
                    : t("dashboard.quote_detail_no_budget")
                }}
              </span>
            </p>
          </div>
        </div>

        <!-- Floral needs -->
        <div v-if="selectedQuote.floral_needs?.length">
          <h4 class="font-heading text-sm text-dark/50 uppercase mb-3">
            {{ t("dashboard.quote_detail_needs") }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <Tag
              v-for="need in selectedQuote.floral_needs"
              :key="need"
              variant="info"
            >
              {{ t(`quote_form.need_${need}`) }}
            </Tag>
          </div>
        </div>

        <!-- Admin notes -->
        <div>
          <h4 class="font-heading text-sm text-dark/50 uppercase mb-3">
            {{ t("dashboard.quote_detail_notes") }}
          </h4>
          <textarea
            v-model="adminNotes"
            :placeholder="t('dashboard.quote_detail_notes_placeholder')"
            class="w-full h-28 px-4 py-3 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all resize-none"
          />
          <div class="mt-3">
            <Button
              icon="Save"
              :loading="savingNotes"
              @click="saveNotes"
            >
              {{ t("dashboard.quote_detail_save_notes") }}
            </Button>
          </div>
        </div>

        <!-- Metadata -->
        <div class="text-sm text-dark/40 space-y-1 pt-4 border-t border-gray-200">
          <h4 class="font-heading text-sm text-dark/50 uppercase mb-2">
            {{ t("dashboard.quote_detail_metadata") }}
          </h4>
          <p>
            {{ t("dashboard.quote_detail_created") }}:
            {{ formatDateTime(selectedQuote.created_at) }}
          </p>
          <p>
            {{ t("dashboard.quote_detail_updated") }}:
            {{ formatDateTime(selectedQuote.updated_at) }}
          </p>
          <p>
            {{ t("dashboard.quote_detail_locale") }}:
            {{ selectedQuote.locale }}
          </p>
        </div>
      </template>
    </BaseModal>
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
});

const { t } = useI18n();
const localePath = useLocalePath();
const user = useSupabaseUser();
const router = useRouter();
const { adminFetch } = useAdminFetch();

// Redirect if not authenticated
watch(user, (val) => {
  if (val === null) {
    router.push(localePath("/login"));
  }
}, { immediate: true });

useHead({
  title: t("dashboard.quotes_title") + " - Boticia",
});

// State
const quotes = ref<QuoteRequest[]>([]);
const loading = ref(true);
const refreshing = ref(false);
const activeFilter = ref<string>("");
const selectedQuote = ref<QuoteRequest | null>(null);
const adminNotes = ref("");
const savingNotes = ref(false);
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
]);

const statusOptions = computed(() => [
  { label: t("dashboard.quote_status_new"), value: "new" },
  { label: t("dashboard.quote_status_contacted"), value: "contacted" },
  {
    label: t("dashboard.quote_status_quote_sent"),
    value: "quote_sent",
  },
  { label: t("dashboard.quote_status_signed"), value: "signed" },
  { label: t("dashboard.quote_status_completed"), value: "completed" },
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
    quote_sent: "default",
    signed: "success",
    completed: "completed",
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

// Open detail modal
const openDetail = (quote: QuoteRequest) => {
  selectedQuote.value = { ...quote };
  adminNotes.value = quote.admin_notes || "";
};

// Update status
const onStatusChange = async (newStatus: string | number) => {
  if (!selectedQuote.value) return;

  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${selectedQuote.value.id}`, {
      method: "PATCH",
      body: { status: newStatus },
    });

    selectedQuote.value = res.data;

    // Update in list
    const idx = quotes.value.findIndex(
      (q) => q.id === res.data.id
    );
    if (idx !== -1) {
      quotes.value[idx] = res.data;
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

// Save notes
const saveNotes = async () => {
  if (!selectedQuote.value) return;

  savingNotes.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${selectedQuote.value.id}`, {
      method: "PATCH",
      body: { admin_notes: adminNotes.value },
    });

    selectedQuote.value = res.data;

    // Update in list
    const idx = quotes.value.findIndex(
      (q) => q.id === res.data.id
    );
    if (idx !== -1) {
      quotes.value[idx] = res.data;
    }
  } catch (err) {
    console.error("Error saving notes:", err);
  } finally {
    savingNotes.value = false;
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

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchQuotes();
});
</script>
