<template>
  <div class="flex-1 flex flex-col bg-white">
    <section class="py-6 md:py-8">
      <div class="px-4 md:px-10">
        <!-- Rules -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-heading text-lg text-dark">
              {{ t("availability.rules_title") }}
            </h2>
            <button
              @click="showAddRule = true"
              class="px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold transition-all hover:bg-dark/80 flex items-center gap-2"
            >
              <IconLucid name="Plus" size="xs" />
              {{ t("availability.add_rule") }}
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loadingRules" class="py-8 text-center">
            <IconLucid
              name="Loader2"
              size="lg"
              class="animate-spin mx-auto text-dark/30"
            />
          </div>

          <!-- Empty -->
          <div
            v-else-if="rules.length === 0"
            class="py-8 text-center rounded-[1.5rem] bg-cream"
          >
            <IconLucid
              name="CalendarClock"
              size="lg"
              class="mx-auto text-dark/20 mb-3"
            />
            <p class="text-dark/40">
              {{ t("availability.no_rules") }}
            </p>
          </div>

          <!-- Rules list -->
          <div v-else class="space-y-3">
            <div
              v-for="rule in rules"
              :key="rule.id"
              class="flex items-center gap-4 px-5 py-4 rounded-[1.5rem] bg-cream"
            >
              <div
                class="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center shrink-0"
              >
                <IconLucid
                  name="CalendarClock"
                  size="sm"
                  class="text-dark/50"
                />
              </div>
              <div class="flex-1 min-w-0">
                <span class="font-medium text-dark block">
                  {{ dayLabel(rule.day_of_week) }}
                </span>
                <span class="text-sm text-dark/40">
                  {{ rule.start_time }} — {{ rule.end_time }}
                  · {{ t("availability.slot_duration", { min: rule.slot_duration }) }}
                </span>
              </div>
              <button
                @click="toggleRule(rule)"
                class="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                :class="
                  rule.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                "
              >
                {{ rule.is_active ? t("availability.active") : t("availability.inactive") }}
              </button>
              <button
                @click="deleteRule(rule.id)"
                class="w-8 h-8 rounded-full hover:bg-cream-dark flex items-center justify-center transition-all"
              >
                <IconLucid
                  name="Trash2"
                  size="xs"
                  class="text-dark/30 hover:text-red-500"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Add rule form -->
        <div
          v-if="showAddRule"
          class="rounded-[1.5rem] border-2 border-dark/10 p-5 mb-8"
        >
          <h3
            class="font-heading text-sm text-dark/50 uppercase tracking-wider mb-4"
          >
            {{ t("availability.new_rule") }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.day") }}
              </label>
              <select
                v-model="newRule.day_of_week"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
              >
                <option
                  v-for="d in 7"
                  :key="d - 1"
                  :value="d - 1"
                >
                  {{ dayLabel(d - 1) }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.start") }}
              </label>
              <input
                v-model="newRule.start_time"
                type="time"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
              />
            </div>
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.end") }}
              </label>
              <input
                v-model="newRule.end_time"
                type="time"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
              />
            </div>
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.duration") }}
              </label>
              <select
                v-model="newRule.slot_duration"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
              >
                <option :value="30">30 min</option>
                <option :value="60">1h</option>
                <option :value="90">1h30</option>
                <option :value="120">2h</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <Button
              icon="Check"
              :loading="creatingRule"
              @click="createRule"
            >
              {{ t("availability.save") }}
            </Button>
            <Button
              variant="ghost"
              @click="showAddRule = false"
            >
              {{ t("common.close") }}
            </Button>
          </div>
        </div>

        <!-- Exceptions -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-heading text-lg text-dark">
              {{ t("availability.exceptions_title") }}
            </h2>
            <button
              @click="showAddException = true"
              class="px-4 py-2 rounded-full bg-dark text-cream text-sm font-semibold transition-all hover:bg-dark/80 flex items-center gap-2"
            >
              <IconLucid name="Plus" size="xs" />
              {{ t("availability.add_exception") }}
            </button>
          </div>

          <!-- Empty -->
          <div
            v-if="!loadingExceptions && exceptions.length === 0"
            class="py-8 text-center rounded-[1.5rem] bg-cream"
          >
            <IconLucid
              name="Calendar"
              size="lg"
              class="mx-auto text-dark/20 mb-3"
            />
            <p class="text-dark/40">
              {{ t("availability.no_exceptions") }}
            </p>
          </div>

          <!-- Exceptions list -->
          <div v-else class="space-y-3">
            <div
              v-for="ex in exceptions"
              :key="ex.id"
              class="flex items-center gap-4 px-5 py-4 rounded-[1.5rem] bg-cream"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                :class="
                  ex.exception_type === 'block'
                    ? 'bg-red-100'
                    : 'bg-green-100'
                "
              >
                <IconLucid
                  :name="ex.exception_type === 'block' ? 'X' : 'Plus'"
                  size="sm"
                  :class="
                    ex.exception_type === 'block'
                      ? 'text-red-500'
                      : 'text-green-600'
                  "
                />
              </div>
              <div class="flex-1 min-w-0">
                <span class="font-medium text-dark block">
                  {{ formatDate(ex.exception_date) }}
                  <span class="text-dark/40 font-normal">
                    — {{ ex.exception_type === 'block'
                      ? t("availability.blocked")
                      : t("availability.added") }}
                  </span>
                </span>
                <span
                  v-if="ex.start_time"
                  class="text-sm text-dark/40"
                >
                  {{ ex.start_time }} — {{ ex.end_time }}
                </span>
                <span
                  v-else
                  class="text-sm text-dark/40"
                >
                  {{ t("availability.full_day") }}
                </span>
                <span
                  v-if="ex.reason"
                  class="text-sm text-dark/30 block"
                >
                  {{ ex.reason }}
                </span>
              </div>
              <button
                @click="deleteException(ex.id)"
                class="w-8 h-8 rounded-full hover:bg-cream-dark flex items-center justify-center transition-all"
              >
                <IconLucid
                  name="Trash2"
                  size="xs"
                  class="text-dark/30 hover:text-red-500"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Add exception form -->
        <div
          v-if="showAddException"
          class="rounded-[1.5rem] border-2 border-dark/10 p-5 mt-6"
        >
          <h3
            class="font-heading text-sm text-dark/50 uppercase tracking-wider mb-4"
          >
            {{ t("availability.new_exception") }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.date") }}
              </label>
              <input
                v-model="newException.exception_date"
                type="date"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
              />
            </div>
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.type") }}
              </label>
              <select
                v-model="newException.exception_type"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
              >
                <option value="block">
                  {{ t("availability.block") }}
                </option>
                <option value="add">
                  {{ t("availability.add") }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.start") }}
              </label>
              <input
                v-model="newException.start_time"
                type="time"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
                :placeholder="t('availability.optional')"
              />
            </div>
            <div>
              <label class="text-xs text-dark/40 block mb-1">
                {{ t("availability.end") }}
              </label>
              <input
                v-model="newException.end_time"
                type="time"
                class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
                :placeholder="t('availability.optional')"
              />
            </div>
          </div>
          <div class="mt-3">
            <label class="text-xs text-dark/40 block mb-1">
              {{ t("availability.reason") }}
            </label>
            <input
              v-model="newException.reason"
              type="text"
              :placeholder="t('availability.reason_placeholder')"
              class="w-full px-3 py-2 rounded-xl border border-dark/10 bg-cream text-sm"
            />
          </div>
          <div class="flex gap-3 mt-4">
            <Button
              icon="Check"
              :loading="creatingException"
              @click="createException"
            >
              {{ t("availability.save") }}
            </Button>
            <Button
              variant="ghost"
              @click="showAddException = false"
            >
              {{ t("common.close") }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type {
  AvailabilityRuleRow,
  AvailabilityExceptionRow,
} from "~/server/utils/supabase";

definePageMeta({
  ssr: false,
  layout: "dashboard",
  middleware: ["auth-admin"],
});

const { t, locale } = useI18n();
const { adminFetch } = useAdminFetch();

const pageTitle = useState<string | null>(
  "dashboard-page-title",
  () => null
);
pageTitle.value = t("availability.page_title");

useHead({
  title: t("availability.page_title") + " - Boticia",
});

// State
const rules = ref<AvailabilityRuleRow[]>([]);
const exceptions = ref<AvailabilityExceptionRow[]>([]);
const loadingRules = ref(true);
const loadingExceptions = ref(true);
const showAddRule = ref(false);
const showAddException = ref(false);
const creatingRule = ref(false);
const creatingException = ref(false);

const newRule = ref({
  day_of_week: 1,
  start_time: "10:00",
  end_time: "18:00",
  slot_duration: 120,
});

const newException = ref({
  exception_date: "",
  exception_type: "block" as "block" | "add",
  start_time: "",
  end_time: "",
  reason: "",
});

// Day labels
const dayLabel = (day: number) => {
  const days = [
    t("availability.day_sun"),
    t("availability.day_mon"),
    t("availability.day_tue"),
    t("availability.day_wed"),
    t("availability.day_thu"),
    t("availability.day_fri"),
    t("availability.day_sat"),
  ];
  return days[day];
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(locale.value, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Fetch
const fetchRules = async () => {
  loadingRules.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: AvailabilityRuleRow[];
    }>("/api/admin/availability");
    rules.value = res.data;
  } catch (err) {
    console.error("Error fetching rules:", err);
  } finally {
    loadingRules.value = false;
  }
};

const fetchExceptions = async () => {
  loadingExceptions.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: AvailabilityExceptionRow[];
    }>("/api/admin/availability/exceptions");
    exceptions.value = res.data;
  } catch (err) {
    console.error("Error fetching exceptions:", err);
  } finally {
    loadingExceptions.value = false;
  }
};

// CRUD
const createRule = async () => {
  creatingRule.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: AvailabilityRuleRow;
    }>("/api/admin/availability", {
      method: "POST",
      body: newRule.value,
    });
    rules.value.push(res.data);
    showAddRule.value = false;
    newRule.value = {
      day_of_week: 1,
      start_time: "10:00",
      end_time: "18:00",
      slot_duration: 120,
    };
  } catch (err) {
    console.error("Error creating rule:", err);
  } finally {
    creatingRule.value = false;
  }
};

const toggleRule = async (rule: AvailabilityRuleRow) => {
  try {
    const res = await adminFetch<{
      success: boolean;
      data: AvailabilityRuleRow;
    }>(`/api/admin/availability/${rule.id}`, {
      method: "PATCH",
      body: { is_active: !rule.is_active },
    });
    const idx = rules.value.findIndex((r) => r.id === rule.id);
    if (idx !== -1) rules.value[idx] = res.data;
  } catch (err) {
    console.error("Error toggling rule:", err);
  }
};

const deleteRule = async (id: string) => {
  try {
    await adminFetch(`/api/admin/availability/${id}`, {
      method: "DELETE",
    });
    rules.value = rules.value.filter((r) => r.id !== id);
  } catch (err) {
    console.error("Error deleting rule:", err);
  }
};

const createException = async () => {
  creatingException.value = true;
  try {
    const res = await adminFetch<{
      success: boolean;
      data: AvailabilityExceptionRow;
    }>("/api/admin/availability/exceptions", {
      method: "POST",
      body: newException.value,
    });
    exceptions.value.push(res.data);
    showAddException.value = false;
    newException.value = {
      exception_date: "",
      exception_type: "block",
      start_time: "",
      end_time: "",
      reason: "",
    };
  } catch (err) {
    console.error("Error creating exception:", err);
  } finally {
    creatingException.value = false;
  }
};

const deleteException = async (id: string) => {
  try {
    await adminFetch(
      `/api/admin/availability/exceptions/${id}`,
      { method: "DELETE" }
    );
    exceptions.value = exceptions.value.filter(
      (e) => e.id !== id
    );
  } catch (err) {
    console.error("Error deleting exception:", err);
  }
};

onMounted(() => {
  fetchRules();
  fetchExceptions();
});
</script>
