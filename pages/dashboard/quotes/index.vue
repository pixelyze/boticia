<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10">
        <!-- View toggle + Status filters -->
        <div
          class="flex flex-wrap items-center gap-2 mb-6 copilot-fade-in copilot-fade-in-1"
        >
          <!-- View toggle -->
          <div
            class="inline-flex rounded-full border-2 border-dark/10 overflow-hidden mr-2"
          >
            <button
              class="px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5"
              :class="
                viewMode === 'list'
                  ? 'bg-dark text-cream'
                  : 'bg-cream text-dark/60 hover:text-dark'
              "
              @click="viewMode = 'list'"
            >
              <IconLucid name="Menu" size="xs" />
              {{ t("dashboard.view_list") }}
            </button>
            <button
              class="px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5"
              :class="
                viewMode === 'kanban'
                  ? 'bg-dark text-cream'
                  : 'bg-cream text-dark/60 hover:text-dark'
              "
              @click="viewMode = 'kanban'"
            >
              <IconLucid name="Layout" size="xs" />
              {{ t("dashboard.view_kanban") }}
            </button>
          </div>

          <!-- Status filters (list view only) -->
          <template v-if="viewMode === 'list'">
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
          </template>
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
          v-else-if="quotes.length === 0"
          class="py-16 text-center"
        >
          <IconLucid
            name="Inbox"
            size="lg"
            class="mx-auto text-dark/20 mb-4"
          />
          <p class="text-dark/40">
            {{ t("dashboard.quotes_empty") }}
          </p>
        </div>

        <!-- ===================== LIST VIEW ===================== -->
        <template v-else-if="viewMode === 'list'">
          <div
            v-if="filteredQuotes.length === 0"
            class="py-16 text-center"
          >
            <IconLucid
              name="Inbox"
              size="lg"
              class="mx-auto text-dark/20 mb-4"
            />
            <p class="text-dark/40">
              {{ t("dashboard.quotes_empty_filtered") }}
            </p>
          </div>
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <button
              v-for="(quote, i) in filteredQuotes"
              :key="quote.id"
              class="flex flex-col p-5 rounded-[1.5rem] transition-all group text-left copilot-fade-in"
              :class="
                quote.budget === 'lt_10000'
                  ? 'bg-cream-dark hover:bg-cream border-2 border-dark/60'
                  : quote.budget === 'lt_4000'
                    ? 'bg-cream-dark hover:bg-cream border-2 border-fuchsia-400/45'
                    : 'bg-cream-dark hover:bg-cream border border-dark/5'
              "
              :style="{ animationDelay: `${0.1 + i * 0.07}s` }"
              @click="navigateTo(localePath('/dashboard/quotes/' + quote.id))"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex flex-wrap items-center gap-1.5">
                  <Tag :variant="statusVariant(quote.status)">
                    {{ t(`dashboard.quote_status_${quote.status}`) }}
                  </Tag>
                  <Tag
                    v-if="quote.moodboard_sent_at"
                    variant="info"
                    icon="Palette"
                  >
                    {{ t("dashboard.moodboard_sent") }}
                  </Tag>
                </div>
                <IconLucid
                  name="ArrowRight"
                  size="sm"
                  class="text-stone-400 group-hover:text-orange-500 transition-colors shrink-0"
                />
              </div>
              <span class="font-heading text-lg text-dark block truncate">
                {{ quote.partner1_name }}
                <template v-if="quote.partner2_name">
                  &amp; {{ quote.partner2_name }}
                </template>
              </span>
              <span class="text-sm text-fuchsia-600 truncate mt-1">
                {{ quote.email }}
              </span>
              <div
                class="flex items-center gap-3 mt-3 text-sm text-dark/50"
              >
                <span
                  v-if="quote.wedding_date"
                  class="flex items-center gap-1"
                >
                  <IconLucid name="Calendar" size="xs" />
                  {{ formatDate(quote.wedding_date) }}
                </span>
                <span
                  v-if="quote.venue"
                  class="flex items-center gap-1 truncate"
                >
                  <IconLucid name="MapPin" size="xs" />
                  {{ quote.venue }}
                </span>
              </div>
              <span class="text-xs text-dark/30 mt-2">
                {{ formatDate(quote.created_at) }}
              </span>
            </button>
          </div>
        </template>

        <!-- ===================== KANBAN VIEW ===================== -->
        <template v-else>
          <div
            class="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-10 md:px-10"
          >
            <div
              v-for="col in kanbanColumns"
              :key="col.status"
              class="min-w-[280px] w-[280px] shrink-0 rounded-2xl p-3 transition-all min-h-[200px]"
              :class="
                dragOverStatus === col.status
                  ? 'bg-fuchsia-50/50 ring-2 ring-fuchsia-400/40'
                  : 'bg-cream/50'
              "
              @dragover.prevent="
                onColumnDragOver($event, col.status)
              "
              @dragleave.self="onColumnDragLeave"
              @drop="onDrop($event, col.status)"
            >
              <!-- Column header -->
              <div
                class="flex items-center justify-between mb-3 px-1"
              >
                <div class="flex items-center gap-2">
                  <Tag :variant="statusVariant(col.status)">
                    {{ col.label }}
                  </Tag>
                  <span class="text-sm text-dark/40">
                    {{ col.quotes.length }}
                  </span>
                </div>
              </div>

              <!-- Cards -->
              <div class="flex flex-col gap-3">
                <template
                  v-for="(quote, idx) in col.quotes"
                  :key="quote.id"
                >
                  <!-- Drop indicator before card -->
                  <div
                    v-if="
                      showDropIndicator(col.status, idx)
                    "
                    class="h-1 bg-fuchsia-400 rounded-full mx-2 -mb-2"
                  />
                  <!-- Card -->
                  <button
                    data-kanban-card
                    draggable="true"
                    class="w-full text-left p-4 rounded-2xl bg-cream-dark hover:bg-cream border border-dark/5 transition-all cursor-grab active:cursor-grabbing active:shadow-lg"
                    :class="
                      draggedQuoteId === quote.id
                        ? 'opacity-30'
                        : ''
                    "
                    @dragstart="
                      onDragStart($event, quote)
                    "
                    @dragend="onDragEnd"
                    @click="onCardClick(quote.id)"
                  >
                    <span
                      class="font-heading text-base text-dark block truncate"
                    >
                      {{ quote.partner1_name }}
                      <template
                        v-if="quote.partner2_name"
                      >
                        &amp; {{ quote.partner2_name }}
                      </template>
                    </span>
                    <span
                      class="text-sm text-dark/50 block truncate mt-0.5"
                    >
                      {{ quote.email }}
                    </span>
                    <!-- Alert badges -->
                    <div
                      v-if="
                        isStale(quote) ||
                        isUrgent(quote) ||
                        quote.moodboard_sent_at
                      "
                      class="flex flex-wrap gap-1.5 mt-2"
                    >
                      <Tag
                        v-if="quote.moodboard_sent_at"
                        variant="info"
                        icon="Palette"
                      >
                        {{ t("dashboard.moodboard_sent") }}
                      </Tag>
                      <Tag
                        v-if="isStale(quote)"
                        variant="error"
                        icon="AlertCircle"
                      >
                        {{ t("dashboard.stale_alert") }}
                      </Tag>
                      <Tag
                        v-if="isUrgent(quote)"
                        variant="warning"
                        icon="Clock"
                      >
                        {{
                          t(
                            "dashboard.days_until_wedding",
                            {
                              days: daysUntilWedding(
                                quote
                              ),
                            }
                          )
                        }}
                      </Tag>
                    </div>
                    <!-- Wedding date / venue -->
                    <div
                      v-if="
                        quote.wedding_date || quote.venue
                      "
                      class="flex items-center gap-3 mt-2 text-xs text-dark/40"
                    >
                      <span
                        v-if="quote.wedding_date"
                        class="flex items-center gap-1"
                      >
                        <IconLucid
                          name="Calendar"
                          size="xs"
                        />
                        {{
                          formatDate(quote.wedding_date)
                        }}
                      </span>
                      <span
                        v-if="quote.venue"
                        class="flex items-center gap-1 truncate"
                      >
                        <IconLucid
                          name="MapPin"
                          size="xs"
                        />
                        {{ quote.venue }}
                      </span>
                    </div>
                  </button>
                </template>
                <!-- Drop indicator at end of column -->
                <div
                  v-if="
                    showDropIndicator(
                      col.status,
                      col.quotes.length
                    )
                  "
                  class="h-1 bg-fuchsia-400 rounded-full mx-2 -mt-2"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
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
const session = useSupabaseSession();
const { adminFetch } = useAdminFetch();

const pageTitle = useState<string | null>(
  "dashboard-page-title",
  () => null
);
pageTitle.value = t("dashboard.quotes_title");

useHead({
  title: t("dashboard.quotes_title") + " - Boticia",
});

// State
const route = useRoute();
const activeFilter = ref<string>("");
const viewMode = ref<"list" | "kanban">("list");
const dragOverStatus = ref<string | null>(null);
const draggedQuoteId = ref<string | null>(null);
const dropTarget = ref<{
  status: string;
  index: number;
} | null>(null);
let isDragging = false;

// State
const quotes = ref<QuoteRequest[]>([]);
const loading = ref(true);
const fetchError = ref(false);
const refreshing = ref(false);

const fetchQuotes = async () => {
  if (!loading.value) refreshing.value = true;
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

onMounted(() => {
  fetchQuotes();
});

// Read filter from URL query (?filter=new) and force list view
if (import.meta.client) {
  const filterParam = route.query.filter as string | undefined;
  if (filterParam) {
    activeFilter.value = filterParam;
    viewMode.value = "list";
  } else {
    const saved = localStorage.getItem("boticia-quotes-view");
    if (saved === "kanban" || saved === "list") {
      viewMode.value = saved;
    }
  }
}

watch(viewMode, (v) => {
  localStorage.setItem("boticia-quotes-view", v);
});

// Filters
const statusFilters = computed(() => [
  { label: t("dashboard.quotes_filter_all"), value: "" },
  { label: t("dashboard.quotes_filter_new"), value: "new" },
  {
    label: t("dashboard.quotes_filter_contacted"),
    value: "contacted",
  },
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
  return quotes.value.filter(
    (q) => q.status === activeFilter.value
  );
});

// Kanban columns (excludes cancelled)
const KANBAN_STATUSES: QuoteRequestStatus[] = [
  "new",
  "contacted",
  "quote_sent",
  "signed",
  "completed",
];

const kanbanColumns = computed(() =>
  KANBAN_STATUSES.map((status) => ({
    status,
    label: t(`dashboard.quote_status_${status}`),
    quotes: quotes.value
      .filter((q) => q.status === status)
      .sort(
        (a, b) => a.kanban_position - b.kanban_position
      ),
  }))
);

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

// Alert helpers
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
  return Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
};

const isStale = (q: QuoteRequest) =>
  q.status === "quote_sent" && daysSince(q.updated_at) > 7;

const isUrgent = (q: QuoteRequest) =>
  q.wedding_date !== undefined &&
  q.wedding_date !== null &&
  daysUntil(q.wedding_date) > 0 &&
  daysUntil(q.wedding_date) < 60;

const daysUntilWedding = (q: QuoteRequest) =>
  q.wedding_date ? daysUntil(q.wedding_date) : 0;

// Drag & Drop
const onDragStart = (
  event: DragEvent,
  quote: QuoteRequest
) => {
  isDragging = true;
  draggedQuoteId.value = quote.id;
  event.dataTransfer?.setData("text/plain", quote.id);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
};

const onDragEnd = () => {
  draggedQuoteId.value = null;
  dragOverStatus.value = null;
  dropTarget.value = null;
  setTimeout(() => {
    isDragging = false;
  }, 0);
};

const onCardClick = (quoteId: string) => {
  if (isDragging) return;
  navigateTo(
    localePath("/dashboard/quotes/" + quoteId)
  );
};

const onColumnDragOver = (
  event: DragEvent,
  colStatus: string
) => {
  dragOverStatus.value = colStatus;

  const column = event.currentTarget as HTMLElement;
  const cards = column.querySelectorAll(
    "[data-kanban-card]"
  );

  let insertIndex = cards.length;

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (event.clientY < midY) {
      insertIndex = i;
      break;
    }
  }

  dropTarget.value = { status: colStatus, index: insertIndex };
};

const onColumnDragLeave = () => {
  dragOverStatus.value = null;
  dropTarget.value = null;
};

const showDropIndicator = (
  colStatus: string,
  index: number
) => {
  if (
    !dropTarget.value ||
    !draggedQuoteId.value
  )
    return false;
  if (dropTarget.value.status !== colStatus) return false;
  if (dropTarget.value.index !== index) return false;

  // Don't show at the dragged card's current position
  const col = kanbanColumns.value.find(
    (c) => c.status === colStatus
  );
  if (col) {
    const dragIdx = col.quotes.findIndex(
      (q) => q.id === draggedQuoteId.value
    );
    if (
      dragIdx !== -1 &&
      (index === dragIdx || index === dragIdx + 1)
    ) {
      return false;
    }
  }

  return true;
};

const onDrop = async (
  event: DragEvent,
  colStatus: QuoteRequestStatus
) => {
  event.preventDefault();
  const target = dropTarget.value;
  dragOverStatus.value = null;
  dropTarget.value = null;

  const quoteId = draggedQuoteId.value;
  draggedQuoteId.value = null;
  isDragging = false;

  if (!quoteId || !target) return;

  const quote = quotes.value.find(
    (q) => q.id === quoteId
  );
  if (!quote) return;

  const oldStatus = quote.status;
  const oldPosition = quote.kanban_position;

  // Build target column without the dragged card
  const targetQuotes = quotes.value
    .filter(
      (q) =>
        q.status === target.status && q.id !== quoteId
    )
    .sort(
      (a, b) => a.kanban_position - b.kanban_position
    );

  // Adjust index for same-column drag
  let insertIdx = target.index;
  if (oldStatus === target.status) {
    const allCol = quotes.value
      .filter((q) => q.status === target.status)
      .sort(
        (a, b) => a.kanban_position - b.kanban_position
      );
    const dragIdx = allCol.findIndex(
      (q) => q.id === quoteId
    );
    if (dragIdx !== -1 && dragIdx < insertIdx) {
      insertIdx--;
    }
  }
  insertIdx = Math.min(insertIdx, targetQuotes.length);

  // Check if this is a no-op (same column, same position)
  if (oldStatus === target.status) {
    const allCol = quotes.value
      .filter((q) => q.status === target.status)
      .sort(
        (a, b) => a.kanban_position - b.kanban_position
      );
    const dragIdx = allCol.findIndex(
      (q) => q.id === quoteId
    );
    if (dragIdx === insertIdx) return;
  }

  // Insert at target position
  targetQuotes.splice(insertIdx, 0, quote);

  // Optimistic update: positions and status
  quote.status = target.status as QuoteRequestStatus;
  const items: {
    id: string;
    kanban_position: number;
    status?: QuoteRequestStatus;
  }[] = [];
  targetQuotes.forEach((q, i) => {
    q.kanban_position = i;
    const item: {
      id: string;
      kanban_position: number;
      status?: QuoteRequestStatus;
    } = { id: q.id, kanban_position: i };
    if (
      q.id === quoteId &&
      oldStatus !== target.status
    ) {
      item.status =
        target.status as QuoteRequestStatus;
    }
    items.push(item);
  });

  try {
    await adminFetch<{ success: boolean }>(
      "/api/quotes/reorder",
      {
        method: "POST",
        body: { items },
      }
    );
  } catch (err) {
    console.error("Error reordering:", err);
    quote.status = oldStatus;
    quote.kanban_position = oldPosition;
    await fetchQuotes();
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
</script>
