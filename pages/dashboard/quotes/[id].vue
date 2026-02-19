<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10">
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
        <div v-else-if="fetchError" class="py-16 text-center">
          <IconLucid
            name="AlertCircle"
            size="lg"
            class="mx-auto text-red-400 mb-4"
          />
          <p class="text-dark/60 mb-4">
            {{ t("dashboard.quotes_error") }}
          </p>
          <Button icon="RefreshCw" @click="fetchQuote">
            {{ t("dashboard.quotes_retry") }}
          </Button>
        </div>

        <!-- Detail content -->
        <template v-else-if="quote">
          <!-- Copilot full-page view -->
          <div
            v-if="activeSection === 'copilot'"
            class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
          >
            <div class="max-w-lg w-full text-center">
              <!-- Sparkles icon -->
              <div
                class="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-8 copilot-fade-in copilot-fade-in-1"
              >
                <IconLucid
                  name="Sparkles"
                  size="md"
                  class="text-fuchsia-500 animate-pulse"
                />
              </div>

              <!-- Urgent badge -->
              <div v-if="isUrgent" class="mb-4 copilot-fade-in copilot-fade-in-2">
                <Tag variant="warning">Urgent</Tag>
              </div>

              <!-- Typewriter message -->
              <p
                class="text-xl md:text-2xl font-heading text-dark leading-relaxed mb-10 copilot-fade-in copilot-fade-in-2"
              >
                <span>{{ displayedText }}</span>
                <a
                  v-if="isTypingLink || displayedLinkText"
                  :href="calendarUrl"
                  target="_blank"
                  class="text-fuchsia-500 hover:underline"
                >{{ displayedLinkText }}</a>
                <span
                  v-if="isTyping || isTypingLink"
                  class="copilot-cursor"
                >|</span>
              </p>

              <!-- CTA row: Status + Espace projet -->
              <div
                v-if="!isTyping && !isTypingLink"
                class="flex flex-wrap justify-center items-center gap-3 copilot-actions-reveal"
              >
                <span
                  class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cream text-base font-medium text-dark"
                >
                  <span
                    class="w-2.5 h-2.5 rounded-full"
                    :class="statusDotColor(quote.status)"
                  ></span>
                  {{ t(`dashboard.quote_status_${quote.status}`) }}
                </span>
                <button
                  @click="activeSection = 'section-status'"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/80 transition-all"
                >
                  <IconLucid name="NotebookPen" size="xs" />
                  Espace projet
                </button>
              </div>

            </div>
          </div>

          <!-- Section content view -->
          <div v-else class="flex gap-6">
          <!-- Sidebar navigation -->
          <nav class="hidden md:flex flex-col gap-4 sticky top-24 self-start w-24">
            <!-- Back to copilot -->
            <button
              @click="activeSection = 'copilot'"
              class="w-24 h-12 rounded-2xl border-2 flex items-center justify-center gap-1.5 transition-all bg-cream text-dark/40 border-dark/10 hover:border-dark/30 hover:text-dark/60"
            >
              <IconLucid name="Sparkles" size="sm" />
            </button>
            <button
              v-for="nav in sectionNav"
              :key="nav.id"
              @click="activeSection = nav.id"
              class="w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all"
              :class="
                activeSection === nav.id
                  ? 'bg-dark text-cream border-dark'
                  : 'bg-cream text-dark/40 border-dark/10 hover:border-dark/30 hover:text-dark/60'
              "
            >
              <IconLucid :name="nav.icon" size="sm" :class="activeSection === nav.id ? '' : 'text-fuchsia-500'" />
              <span class="text-[10px] font-semibold uppercase tracking-wider leading-none" :class="activeSection === nav.id ? '' : 'text-fuchsia-500'">
                {{ nav.label }}
              </span>
            </button>
          </nav>

          <!-- Main content -->
          <div class="flex-1 min-w-0">
            <!-- Tab: Statut & Contact -->
            <template v-if="activeSection === 'section-status'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Gestion -->
                <div
                  class="rounded-[1.5rem] border-2 border-dark/10 p-5"
                >
                  <h2
                    class="font-heading text-sm text-dark/50 uppercase tracking-wider mb-4"
                  >
                    {{ t("dashboard.quote_detail_status") }}
                  </h2>
                  <div class="space-y-4">
                    <button
                      class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dark/10 hover:border-dark/30 transition-all w-full text-left"
                      @click="statusModalOpen = true"
                    >
                      <div
                        class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        :class="statusIconBg(quote.status)"
                      >
                        <IconLucid
                          :name="statusIcon(quote.status)"
                          size="sm"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <span class="font-medium text-dark block">
                          {{ t(`dashboard.quote_status_${quote.status}`) }}
                        </span>
                        <span class="text-xs text-dark/40">
                          {{ t("dashboard.quote_detail_change_status") }}
                        </span>
                      </div>
                      <IconLucid
                        name="ChevronRight"
                        size="sm"
                        class="text-dark/20"
                      />
                    </button>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0"
                      >
                        <IconLucid
                          name="Calendar"
                          size="sm"
                          class="text-dark/40"
                        />
                      </div>
                      <span class="text-dark font-medium">
                        {{
                          quote.wedding_date
                            ? formatDate(quote.wedding_date)
                            : t(
                                "dashboard.quote_detail_no_date"
                              )
                        }}
                      </span>
                    </div>
                    <button
                      class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dark/10 hover:border-dark/30 transition-all w-full text-left"
                      @click="scheduleModalOpen = true"
                    >
                      <div
                        class="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0"
                      >
                        <IconLucid
                          name="CalendarCheck"
                          size="sm"
                          class="text-dark/40"
                        />
                      </div>
                      <div class="flex-1">
                        <span
                          class="text-dark block"
                          :class="
                            !quote.meeting_date
                              ? 'text-dark/40'
                              : 'font-medium'
                          "
                        >
                          {{
                            quote.meeting_date
                              ? formatDate(
                                  quote.meeting_date
                                ) +
                                (quote.meeting_time
                                  ? ` — ${quote.meeting_time}`
                                  : "")
                              : t(
                                  "dashboard.quote_detail_no_meeting"
                                )
                          }}
                        </span>
                        <span class="text-xs text-dark/40">
                          {{ t("dashboard.quote_detail_change_meeting") }}
                        </span>
                      </div>
                      <IconLucid
                        name="ChevronRight"
                        size="sm"
                        class="text-dark/20"
                      />
                    </button>
                  </div>
                </div>

                <!-- Coordonnees -->
                <div
                  class="rounded-[1.5rem] border-2 border-dark/10 p-5"
                >
                  <h2
                    class="font-heading text-sm text-dark/50 uppercase tracking-wider mb-4"
                  >
                    {{ t("dashboard.quote_detail_contact") }}
                  </h2>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0"
                      >
                        <IconLucid
                          name="Mail"
                          size="sm"
                          class="text-dark/40"
                        />
                      </div>
                      <a
                        :href="`mailto:${quote.email}`"
                        class="text-dark underline truncate"
                      >
                        {{ quote.email }}
                      </a>
                    </div>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0"
                      >
                        <IconLucid
                          name="Phone"
                          size="sm"
                          class="text-dark/40"
                        />
                      </div>
                      <span v-if="quote.phone">
                        <a
                          :href="`tel:${quote.phone}`"
                          class="text-dark underline"
                        >
                          {{ quote.phone }}
                        </a>
                      </span>
                      <span v-else class="text-dark/40">
                        {{
                          t(
                            "dashboard.quote_detail_no_phone"
                          )
                        }}
                      </span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0"
                      >
                        <IconLucid
                          name="Target"
                          size="sm"
                          class="text-dark/40"
                        />
                      </div>
                      <span class="text-dark">
                        {{
                          quote.venue ||
                          t(
                            "dashboard.quote_detail_no_venue"
                          )
                        }}
                      </span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0"
                      >
                        <IconLucid
                          name="BadgeEuro"
                          size="sm"
                          class="text-dark/40"
                        />
                      </div>
                      <span class="text-dark">
                        {{
                          quote.budget
                            ? t(
                                `quote_form.budget_${quote.budget}`
                              )
                            : t(
                                "dashboard.quote_detail_no_budget"
                              )
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Metadata -->
              <div
                class="flex flex-wrap gap-x-6 gap-y-1 text-xs text-dark/30 px-2 mt-4"
              >
                <span>
                  {{ t("dashboard.quote_detail_created") }}:
                  {{ formatDateTime(quote.created_at) }}
                </span>
                <span>
                  {{ t("dashboard.quote_detail_updated") }}:
                  {{ formatDateTime(quote.updated_at) }}
                </span>
                <span>
                  {{ t("dashboard.quote_detail_locale") }}:
                  {{ quote.locale }}
                </span>
              </div>
            </template>

            <!-- Tab: Prestations -->
            <template
              v-else-if="activeSection === 'section-needs'"
            >
              <div
                v-if="quote.floral_needs?.length"
                class="rounded-[1.5rem] border-2 border-dark/10 p-5"
              >
                <h2
                  class="font-heading text-sm text-dark/50 uppercase tracking-wider mb-4"
                >
                  {{ t("dashboard.quote_detail_needs") }}
                </h2>
                <div class="flex flex-wrap gap-2">
                  <Tag
                    v-for="need in quote.floral_needs"
                    :key="need"
                    variant="info"
                  >
                    {{ t(`quote_form.need_${need}`) }}
                  </Tag>
                </div>
              </div>
              <div v-else class="py-12 text-center">
                <IconLucid
                  name="Flower2"
                  size="lg"
                  class="mx-auto text-dark/20 mb-4"
                />
                <p class="text-dark/40">
                  {{ t("dashboard.quote_detail_no_needs") }}
                </p>
              </div>
            </template>

            <!-- Tab: Notes admin -->
            <template
              v-else-if="activeSection === 'section-notes'"
            >
              <div
                class="rounded-[1.5rem] border-2 border-dark/10 p-5"
              >
                <h2
                  class="font-heading text-sm text-dark/50 uppercase tracking-wider mb-4"
                >
                  {{ t("dashboard.quote_detail_notes") }}
                </h2>
                <textarea
                  v-model="adminNotes"
                  :placeholder="
                    t(
                      'dashboard.quote_detail_notes_placeholder'
                    )
                  "
                  class="w-full h-28 px-4 py-3 rounded-xl border border-dark/5 bg-cream focus:outline-none focus:border-dark/20 transition-all resize-none"
                />
                <div class="mt-3">
                  <Button
                    icon="Save"
                    :loading="savingNotes"
                    @click="saveNotes"
                  >
                    {{
                      t("dashboard.quote_detail_save_notes")
                    }}
                  </Button>
                </div>
              </div>
            </template>

            <!-- Tab: Espace client -->
            <template
              v-else-if="activeSection === 'section-portal'"
            >
              <PortalToggle
                :enabled="portalEnabled"
                :quoteEmail="quote.email"
                :sending="sendingInvite"
                :inviteSent="inviteSent"
                @toggle="handlePortalToggle"
                @invite="handleSendInvite"
              />
            </template>

            <!-- Tab: Moodboard & Inspirations -->
            <template
              v-else-if="activeSection === 'section-moodboard'"
            >
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <MoodboardManager
                  :items="moodboardItems"
                  :moodboardNote="moodboardNote"
                  :savingNote="savingMoodboardNote"
                  :uploading="uploadingMoodboard"
                  :addingLink="addingMoodboardLink"
                  @upload="handleMoodboardUpload"
                  @addLink="handleMoodboardAddLink"
                  @deleteItem="handleMoodboardDelete"
                  @saveNote="handleSaveMoodboardNote"
                  @update:moodboardNote="
                    moodboardNote = $event
                  "
                />

                <ClientInspirationsViewer
                  :inspirations="clientInspirations"
                  :loading="loadingInspirations"
                />
              </div>
            </template>

            <!-- Tab: Proposition -->
            <template
              v-else-if="
                activeSection === 'section-proposals'
              "
            >
              <ProposalManager
                :proposals="proposals"
                :loading="loadingProposals"
                :creating="creatingProposal"
                @create="handleCreateProposal"
                @delete="handleDeleteProposal"
              />
            </template>
          </div>
        </div>
        </template>
      </div>
    </section>

    <!-- Status modal -->
    <BaseModal
      :isOpen="statusModalOpen"
      :title="t('dashboard.quote_detail_status')"
      :showCloseButton="true"
      :closeButtonText="t('common.close')"
      @close="statusModalOpen = false"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          class="flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left"
          :class="
            quote?.status === opt.value
              ? 'bg-dark text-cream border-dark'
              : 'bg-cream text-dark border-dark/10 hover:border-dark/30'
          "
          @click="selectStatus(opt.value)"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            :class="
              quote?.status === opt.value
                ? 'bg-cream/20'
                : statusIconBg(opt.value)
            "
          >
            <IconLucid
              :name="statusIcon(opt.value)"
              size="md"
              :class="
                quote?.status === opt.value
                  ? 'text-cream'
                  : 'text-white'
              "
            />
          </div>
          <div>
            <span class="font-heading text-lg block">
              {{ opt.label }}
            </span>
            <span
              class="text-sm"
              :class="
                quote?.status === opt.value
                  ? 'text-cream/60'
                  : 'text-dark/40'
              "
            >
              {{ t(`dashboard.quote_status_desc_${opt.value}`) }}
            </span>
          </div>
        </button>
      </div>
    </BaseModal>

    <!-- Schedule modal -->
    <ScheduleModal
      :isOpen="scheduleModalOpen"
      @close="scheduleModalOpen = false"
      @confirmed="handleMeetingConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import type {
  QuoteRequest,
  QuoteRequestStatus,
} from "~/server/utils/quotes-types";
import type {
  ClientInspiration,
  MoodboardItem,
  ProjectProposal,
} from "~/server/utils/client-portal-types";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { adminFetch } = useAdminFetch();

const quoteId = route.params.id as string;
const pageTitle = useState<string | null>("dashboard-page-title", () => null);

// State
const quote = ref<QuoteRequest | null>(null);
const loading = ref(true);
const fetchError = ref(false);
const adminNotes = ref("");
const savingNotes = ref(false);

// Portal state
const portalEnabled = ref(false);
const sendingInvite = ref(false);
const inviteSent = ref(false);
const moodboardItems = ref<MoodboardItem[]>([]);
const moodboardNote = ref("");
const savingMoodboardNote = ref(false);
const uploadingMoodboard = ref(false);
const addingMoodboardLink = ref(false);
const clientInspirations = ref<ClientInspiration[]>([]);
const loadingInspirations = ref(false);
const proposals = ref<ProjectProposal[]>([]);
const loadingProposals = ref(false);
const creatingProposal = ref(false);

// Section navigation
const sectionNav = [
  { id: "section-status", icon: "Flag", label: "Statut" },
  { id: "section-needs", icon: "Leaf", label: "Prestations" },
  { id: "section-notes", icon: "MessageSquare", label: "Notes" },
  { id: "section-moodboard", icon: "Images", label: "Moodboard" },
  {
    id: "section-proposals",
    icon: "FileText",
    label: "Proposition",
  },
];

const activeSection = ref("copilot");
const statusModalOpen = ref(false);
const scheduleModalOpen = ref(false);

// Copilot
const user = useSupabaseUser();
const copilotGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return t("dashboard.greeting_morning");
  if (hour >= 12 && hour < 18) return t("dashboard.greeting_afternoon");
  return t("dashboard.greeting_evening");
});
const copilotName = computed(() => {
  if (!user.value?.email) return "";
  const part = user.value.email.split("@")[0];
  return part.charAt(0).toUpperCase() + part.slice(1);
});

const calendarUrl = computed(() => {
  const q = quote.value;
  if (!q?.meeting_date) return "";
  const date = q.meeting_date.replace(/-/g, "");
  const raw = (q.meeting_time || "10h00").replace(/[h:]/g, "");
  const hh = raw.slice(0, 2);
  const mm = raw.slice(2, 4) || "00";
  const startTime = `${hh}${mm}00`;
  const endHH = String(
    Math.min(parseInt(hh) + 1, 23)
  ).padStart(2, "0");
  const endTime = `${endHH}${mm}00`;
  const title = encodeURIComponent(
    `RDV ${q.partner1_name} & ${q.partner2_name} — Boticia`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}T${startTime}/${date}T${endTime}`;
});

const daysToWedding = computed(() => {
  if (!quote.value?.wedding_date) return null;
  const now = new Date();
  const wedding = new Date(quote.value.wedding_date);
  const days = Math.ceil(
    (wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return days > 0 ? days : null;
});

const statusDotColor = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-yellow-500",
    contacted: "bg-blue-500",
    quote_sent: "bg-gray-500",
    signed: "bg-green-500",
    completed: "bg-green-700",
    cancelled: "bg-red-500",
  };
  return map[status] || "bg-gray-500";
};

const copilotInsight = computed(() => {
  const q = quote.value;
  if (!q)
    return { message: "", actions: [] as { label: string; section?: string; action?: string; icon: string }[] };

  const s = q.status;
  const now = new Date();
  const g = { greeting: copilotGreeting.value, name: copilotName.value, partner1: q.partner1_name, partner2: q.partner2_name };
  const meetingDate = q.meeting_date ? new Date(q.meeting_date) : null;
  const weddingDate = q.wedding_date ? new Date(q.wedding_date) : null;
  const daysToWedding = weddingDate
    ? Math.ceil(
        (weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  if (s === "new") {
    if (meetingDate) {
      return {
        message: t("dashboard.copilot_new_with_meeting", {
          ...g,
          date: formatDate(q.meeting_date!),
          time: q.meeting_time || "",
        }),
        actions: [
          {
            label: t("dashboard.copilot_action_status"),
            section: "section-status",
            icon: "Flag",
          },
          {
            label: t("dashboard.copilot_action_moodboard"),
            section: "section-moodboard",
            icon: "Images",
          },
        ],
      };
    }
    return {
      message: t("dashboard.copilot_new_no_meeting", g),
      actions: [
        {
          label: t("dashboard.copilot_action_schedule"),
          action: "open-schedule",
          icon: "CalendarCheck",
        },
        {
          label: t("dashboard.copilot_action_status"),
          section: "section-status",
          icon: "Flag",
        },
      ],
    };
  }

  if (s === "contacted") {
    if (!meetingDate) {
      return {
        message: t("dashboard.copilot_contacted_no_meeting", g),
        actions: [
          {
            label: t("dashboard.copilot_action_schedule"),
            action: "open-schedule",
            icon: "CalendarCheck",
          },
        ],
      };
    }
    if (meetingDate > now) {
      return {
        message: t("dashboard.copilot_contacted_meeting_future", {
          ...g,
          date: formatDate(q.meeting_date!),
          time: q.meeting_time || "",
        }),
        actions: [
          {
            label: t("dashboard.copilot_action_moodboard"),
            section: "section-moodboard",
            icon: "Images",
          },
        ],
      };
    }
    return {
      message: t("dashboard.copilot_contacted_meeting_past", g),
      actions: [
        {
          label: t("dashboard.copilot_action_status"),
          section: "section-status",
          icon: "Flag",
        },
      ],
    };
  }

  if (s === "quote_sent") {
    if (daysToWedding !== null && daysToWedding < 60) {
      return {
        message: t("dashboard.copilot_quote_sent_urgent", {
          ...g,
          days: daysToWedding,
        }),
        actions: [
          {
            label: t("dashboard.copilot_action_status"),
            section: "section-status",
            icon: "Flag",
          },
        ],
      };
    }
    return {
      message: t("dashboard.copilot_quote_sent", g),
      actions: [],
    };
  }

  if (s === "signed") {
    if (!portalEnabled.value) {
      return {
        message: t("dashboard.copilot_signed_no_portal", g),
        actions: [
          {
            label: t("dashboard.copilot_action_portal"),
            section: "section-portal",
            icon: "Shield",
          },
        ],
      };
    }
    if (moodboardItems.value.length === 0) {
      return {
        message: t("dashboard.copilot_signed_no_moodboard", g),
        actions: [
          {
            label: t("dashboard.copilot_action_moodboard"),
            section: "section-moodboard",
            icon: "Images",
          },
        ],
      };
    }
    if (proposals.value.length === 0) {
      return {
        message: t("dashboard.copilot_signed_no_proposal", g),
        actions: [
          {
            label: t("dashboard.copilot_action_proposal"),
            section: "section-proposals",
            icon: "FileText",
          },
        ],
      };
    }
  }

  if (s === "completed") {
    return {
      message: t("dashboard.copilot_completed", g),
      actions: [],
    };
  }

  return { message: "", actions: [] };
});

const isUrgent = computed(() => {
  if (!quote.value?.wedding_date) return false;
  const now = new Date();
  const wedding = new Date(quote.value.wedding_date);
  const days = Math.ceil(
    (wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return days > 0 && days < 30;
});

const handleCopilotAction = (action: { section?: string; action?: string }) => {
  if (action.action === "open-schedule") {
    scheduleModalOpen.value = true;
  } else if (action.section) {
    activeSection.value = action.section;
  }
};

const displayedText = ref("");
const displayedLinkText = ref("");
const isTyping = ref(true);
const isTypingLink = ref(false);
const LINK_TEXT = " Ajoute-le dans ton agenda →";
let typingInterval: ReturnType<typeof setInterval> | null = null;
let linkTypingInterval: ReturnType<typeof setInterval> | null = null;

const startLinkTypewriter = () => {
  if (!quote.value?.meeting_date) return;
  displayedLinkText.value = "";
  isTypingLink.value = true;
  let j = 0;
  linkTypingInterval = setInterval(() => {
    displayedLinkText.value = LINK_TEXT.slice(0, ++j);
    if (j >= LINK_TEXT.length) {
      clearInterval(linkTypingInterval!);
      linkTypingInterval = null;
      isTypingLink.value = false;
    }
  }, 12);
};

watch(
  () => copilotInsight.value.message,
  (fullText) => {
    if (!fullText) return;
    if (typingInterval) clearInterval(typingInterval);
    if (linkTypingInterval) clearInterval(linkTypingInterval);
    displayedText.value = "";
    displayedLinkText.value = "";
    isTyping.value = true;
    isTypingLink.value = false;
    let i = 0;
    typingInterval = setInterval(() => {
      displayedText.value = fullText.slice(0, ++i);
      if (i >= fullText.length) {
        clearInterval(typingInterval!);
        typingInterval = null;
        isTyping.value = false;
        startLinkTypewriter();
      }
    }, 12);
  },
  { immediate: true }
);

const statusIcon = (status: string) => {
  const map: Record<string, string> = {
    new: "Sparkles",
    contacted: "Phone",
    quote_sent: "Send",
    signed: "BadgeCheck",
    completed: "CheckCircle",
    cancelled: "XCircle",
  };
  return map[status] || "Flag";
};

const statusIconBg = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-yellow-500",
    contacted: "bg-blue-500",
    quote_sent: "bg-gray-500",
    signed: "bg-green-500",
    completed: "bg-green-700",
    cancelled: "bg-red-500",
  };
  return map[status] || "bg-gray-500";
};

const selectStatus = (value: string) => {
  if (!quote.value) return;
  quote.value.status = value as QuoteRequestStatus;
  onStatusChange(value);
  statusModalOpen.value = false;
};

const statusOptions = computed(() => [
  { label: t("dashboard.quote_status_new"), value: "new" },
  {
    label: t("dashboard.quote_status_contacted"),
    value: "contacted",
  },
  {
    label: t("dashboard.quote_status_quote_sent"),
    value: "quote_sent",
  },
  { label: t("dashboard.quote_status_signed"), value: "signed" },
  {
    label: t("dashboard.quote_status_completed"),
    value: "completed",
  },
  {
    label: t("dashboard.quote_status_cancelled"),
    value: "cancelled",
  },
]);

// Fetch quote by ID
const fetchQuote = async () => {
  loading.value = true;
  fetchError.value = false;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`);
    quote.value = res.data;
    pageTitle.value = `${res.data.partner1_name} & ${res.data.partner2_name}`;
    adminNotes.value = res.data.admin_notes || "";
    portalEnabled.value = res.data.portal_enabled || false;
    moodboardNote.value = res.data.moodboard_note || "";
    fetchPortalData();
  } catch (err) {
    console.error("Error fetching quote:", err);
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
};

// Update status
const onStatusChange = async (newStatus: string | number) => {
  if (!quote.value) return;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    quote.value = res.data;
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

// Handle meeting confirmed from ScheduleModal
const handleMeetingConfirmed = async (data: {
  date: string;
  time: string;
  displayDate: string;
}) => {
  if (!quote.value) return;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: {
        meeting_date: data.date,
        meeting_time: data.time,
      },
    });
    quote.value = res.data;
  } catch (err) {
    console.error("Error updating meeting:", err);
  }
};

// Save notes
const saveNotes = async () => {
  if (!quote.value) return;
  savingNotes.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: QuoteRequest;
    }>(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      body: { admin_notes: adminNotes.value },
    });
    quote.value = res.data;
  } catch (err) {
    console.error("Error saving notes:", err);
  } finally {
    savingNotes.value = false;
  }
};

// Portal data fetch
const fetchPortalData = async () => {
  loadingInspirations.value = true;
  loadingProposals.value = true;
  moodboardItems.value = [];
  clientInspirations.value = [];
  proposals.value = [];

  try {
    const [moodRes, inspRes, propRes] = await Promise.all([
      adminFetch<{ success: boolean; data: MoodboardItem[] }>(
        `/api/admin/moodboard/${quoteId}`
      ),
      adminFetch<{
        success: boolean;
        data: ClientInspiration[];
      }>(`/api/admin/inspirations/${quoteId}`),
      adminFetch<{
        success: boolean;
        data: ProjectProposal[];
      }>(`/api/admin/proposals/${quoteId}`),
    ]);
    moodboardItems.value = moodRes.data;
    clientInspirations.value = inspRes.data;
    proposals.value = propRes.data;
  } catch (err) {
    console.error("Error fetching portal data:", err);
  } finally {
    loadingInspirations.value = false;
    loadingProposals.value = false;
  }
};

// Portal toggle
const handlePortalToggle = async (value: boolean) => {
  if (!quote.value) return;
  portalEnabled.value = value;
  try {
    await adminFetch(`/api/admin/portal/${quoteId}`, {
      method: "PATCH",
      body: { portal_enabled: value },
    });
    quote.value.portal_enabled = value;
  } catch (err) {
    console.error("Error toggling portal:", err);
    portalEnabled.value = !value;
  }
};

// Send invite
const handleSendInvite = async () => {
  if (!quote.value) return;
  sendingInvite.value = true;
  try {
    await adminFetch("/api/auth/send-magic-link", {
      method: "POST",
      body: { email: quote.value.email },
    });
    inviteSent.value = true;
  } catch (err) {
    console.error("Error sending invite:", err);
  } finally {
    sendingInvite.value = false;
  }
};

// Moodboard note save
const handleSaveMoodboardNote = async () => {
  if (!quote.value) return;
  savingMoodboardNote.value = true;
  try {
    await adminFetch(`/api/admin/portal/${quoteId}`, {
      method: "PATCH",
      body: { moodboard_note: moodboardNote.value },
    });
  } catch (err) {
    console.error("Error saving moodboard note:", err);
  } finally {
    savingMoodboardNote.value = false;
  }
};

// Moodboard upload
const handleMoodboardUpload = async (file: File) => {
  if (!quote.value) return;
  uploadingMoodboard.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch<{
      success: boolean;
      data: MoodboardItem;
    }>(`/api/admin/moodboard/${quoteId}`, {
      method: "POST",
      body: formData,
    });
    if (res.data) {
      moodboardItems.value.push(res.data);
    }
  } catch (err) {
    console.error("Error uploading moodboard:", err);
  } finally {
    uploadingMoodboard.value = false;
  }
};

// Moodboard add link
const handleMoodboardAddLink = async (
  url: string,
  title: string
) => {
  if (!quote.value) return;
  addingMoodboardLink.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: MoodboardItem;
    }>(`/api/admin/moodboard/${quoteId}/link`, {
      method: "POST",
      body: { url, title },
    });
    if (res.data) {
      moodboardItems.value.push(res.data);
    }
  } catch (err) {
    console.error("Error adding link:", err);
  } finally {
    addingMoodboardLink.value = false;
  }
};

// Moodboard delete item
const handleMoodboardDelete = async (id: string) => {
  try {
    await adminFetch(`/api/admin/moodboard/item/${id}`, {
      method: "DELETE",
    });
    moodboardItems.value = moodboardItems.value.filter(
      (i) => i.id !== id
    );
  } catch (err) {
    console.error("Error deleting moodboard item:", err);
  }
};

// Proposal create
const handleCreateProposal = async (data: {
  title: string;
  description: string;
  amount: number;
  status: string;
  file: File | null;
}) => {
  if (!quote.value) return;
  creatingProposal.value = true;
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.amount) {
      formData.append(
        "total_amount_cents",
        String(Math.round(data.amount * 100))
      );
    }
    formData.append("status", data.status);
    if (data.file) {
      formData.append("file", data.file);
    }

    const res = await adminFetch<{
      success: boolean;
      data: ProjectProposal;
    }>(`/api/admin/proposals/${quoteId}`, {
      method: "POST",
      body: formData,
    });
    if (res.data) {
      proposals.value.unshift(res.data);
    }
  } catch (err) {
    console.error("Error creating proposal:", err);
  } finally {
    creatingProposal.value = false;
  }
};

// Proposal delete
const handleDeleteProposal = async (id: string) => {
  try {
    await adminFetch(`/api/admin/proposals/item/${id}`, {
      method: "DELETE",
    });
    proposals.value = proposals.value.filter(
      (p) => p.id !== id
    );
  } catch (err) {
    console.error("Error deleting proposal:", err);
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
  fetchQuote();
});

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval);
  if (linkTypingInterval) clearInterval(linkTypingInterval);
});

useHead({
  title: computed(() =>
    quote.value
      ? `${quote.value.partner1_name} & ${quote.value.partner2_name} - Boticia`
      : t("dashboard.quotes_title") + " - Boticia"
  ),
});
</script>
