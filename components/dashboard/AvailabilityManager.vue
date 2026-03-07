<template>
  <div class="space-y-6">
    <!-- Rules: Week Grid -->
    <div>
      <h2 class="font-heading text-lg text-dark mb-3">
        {{ t("availability.rules_title") }}
      </h2>

      <!-- Loading -->
      <div v-if="loadingRules" class="py-6 text-center">
        <IconLucid
          name="Loader2"
          size="md"
          class="animate-spin mx-auto text-dark"
        />
      </div>

      <!-- Week Grid: all 7 days, responsive -->
      <div
        v-else
        class="grid grid-cols-4 sm:grid-cols-7 gap-1.5"
      >
        <button
          v-for="dayIndex in allDayIndices"
          :key="dayIndex"
          @click="handleDayClick(dayIndex)"
          class="rounded-lg p-2 text-center transition-all min-h-[72px] sm:min-h-[80px] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          :class="cellClass(dayIndex)"
        >
          <template v-if="rulesByDay.get(dayIndex)">
            <span class="text-[10px] font-medium text-dark/70 uppercase">
              {{ dayShortLabel(dayIndex) }}
            </span>
            <span class="text-xs sm:text-sm font-semibold text-dark leading-tight">
              {{ formatTimeRange(rulesByDay.get(dayIndex)!) }}
            </span>
            <span class="text-[10px] text-dark/60">
              {{ rulesByDay.get(dayIndex)!.slot_duration }}min
            </span>
            <span
              class="inline-block w-1.5 h-1.5 rounded-full"
              :class="rulesByDay.get(dayIndex)!.is_active
                ? 'bg-green-500'
                : 'bg-gray-400'"
            />
          </template>
          <template v-else>
            <span class="text-[10px] font-medium text-dark/60 uppercase">
              {{ dayShortLabel(dayIndex) }}
            </span>
            <IconLucid
              name="Plus"
              size="xs"
              class="text-dark"
            />
          </template>
        </button>
      </div>

      <!-- Add/Edit rule form -->
      <div
        v-if="showForm"
        class="rounded-xl border-2 border-dark/5 bg-cream-light p-4 mt-3"
      >
        <h3
          class="font-heading text-xs text-dark/60 uppercase tracking-wider mb-3"
        >
          {{ editingRule
            ? t("availability.edit_rule")
            : t("availability.new_rule") }}
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.day") }}
            </label>
            <select
              v-model="newRule.day_of_week"
              class="avail-select w-full px-4 py-3 pr-10 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm appearance-none"
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
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.duration") }}
            </label>
            <select
              v-model="newRule.slot_duration"
              class="avail-select w-full px-4 py-3 pr-10 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm appearance-none"
            >
              <option :value="30">30 min</option>
              <option :value="60">1h</option>
              <option :value="90">1h30</option>
              <option :value="120">2h</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.start") }}
            </label>
            <input
              v-model="newRule.start_time"
              type="time"
              class="avail-input w-full px-4 py-3 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm"
            />
          </div>
          <div>
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.end") }}
            </label>
            <input
              v-model="newRule.end_time"
              type="time"
              class="avail-input w-full px-4 py-3 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm"
            />
          </div>
        </div>
        <div class="flex items-center gap-3 mt-4">
          <Button
            icon="Check"
            :loading="savingRule"
            @click="saveRule"
          >
            {{ t("availability.save") }}
          </Button>
          <Button
            v-if="editingRule"
            variant="ghost"
            @click="confirmDeleteRule"
          >
            {{ t("common.delete") }}
          </Button>
          <Button
            variant="ghost"
            @click="closeForm"
          >
            {{ t("common.close") }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Exceptions -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-heading text-lg text-dark">
          {{ t("availability.exceptions_title") }}
          <span
            v-if="exceptions.length > 0"
            class="text-sm font-normal text-dark/60 ml-1"
          >
            ({{ exceptions.length }})
          </span>
        </h2>
        <button
          @click="showAddException = true"
          class="px-3 py-1.5 rounded-full bg-dark text-cream text-xs font-semibold transition-all hover:bg-dark/80 flex items-center gap-1.5"
        >
          <IconLucid name="Plus" size="xs" />
          {{ t("availability.add_exception") }}
        </button>
      </div>

      <!-- Empty -->
      <div
        v-if="!loadingExceptions && exceptions.length === 0"
        class="py-6 text-center rounded-xl bg-cream"
      >
        <IconLucid
          name="Calendar"
          size="md"
          class="mx-auto text-dark mb-2"
        />
        <p class="text-dark/60 text-sm">
          {{ t("availability.no_exceptions") }}
        </p>
      </div>

      <!-- Exceptions list (compact) -->
      <div v-else class="space-y-1.5">
        <div
          v-for="ex in exceptions"
          :key="ex.id"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-cream"
        >
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
            :class="ex.exception_type === 'block'
              ? 'bg-red-100 text-red-600'
              : 'bg-green-100 text-green-600'"
          >
            {{ ex.exception_type === 'block'
              ? t("availability.blocked")
              : t("availability.added") }}
          </span>
          <div class="flex-1 min-w-0 truncate">
            <span class="text-sm text-dark">
              {{ formatDate(ex.exception_date) }}
            </span>
            <span class="text-xs text-dark/60 ml-1">
              {{ ex.start_time && ex.end_time
                ? `${ex.start_time} — ${ex.end_time}`
                : t("availability.full_day") }}
            </span>
            <span
              v-if="ex.reason"
              class="text-xs text-dark/60 ml-1"
            >
              · {{ ex.reason }}
            </span>
          </div>
          <button
            @click="deleteException(ex.id)"
            class="w-6 h-6 rounded-full hover:bg-cream-dark flex items-center justify-center transition-all shrink-0"
          >
            <IconLucid
              name="Trash2"
              size="xs"
              class="text-dark hover:text-red-500"
            />
          </button>
        </div>
      </div>

      <!-- Add exception form -->
      <div
        v-if="showAddException"
        class="rounded-xl border-2 border-dark/5 bg-cream-light p-4 mt-3"
      >
        <h3
          class="font-heading text-xs text-dark/60 uppercase tracking-wider mb-3"
        >
          {{ t("availability.new_exception") }}
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.date") }}
            </label>
            <input
              v-model="newException.exception_date"
              type="date"
              class="avail-input w-full px-4 py-3 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm"
            />
          </div>
          <div>
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.type") }}
            </label>
            <select
              v-model="newException.exception_type"
              class="avail-select w-full px-4 py-3 pr-10 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm appearance-none"
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
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.start") }}
            </label>
            <input
              v-model="newException.start_time"
              type="time"
              class="avail-input w-full px-4 py-3 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm"
            />
          </div>
          <div>
            <label class="text-xs text-dark/60 block mb-1">
              {{ t("availability.end") }}
            </label>
            <input
              v-model="newException.end_time"
              type="time"
              class="avail-input w-full px-4 py-3 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm"
            />
          </div>
        </div>
        <div class="mt-3">
          <label class="text-xs text-dark/60 block mb-1">
            {{ t("availability.reason") }}
          </label>
          <input
            v-model="newException.reason"
            type="text"
            :placeholder="t('availability.reason_placeholder')"
            class="w-full px-4 py-3 rounded-xl border-2 border-dark/5 bg-cream focus:outline-none focus:border-dark/30 transition-all text-sm"
          />
        </div>
        <div class="flex items-center gap-3 mt-4">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type {
  AvailabilityRuleRow,
  AvailabilityExceptionRow,
} from "~/server/utils/supabase";

const { t, locale } = useI18n();
const { adminFetch } = useAdminFetch();

// State
const rules = ref<AvailabilityRuleRow[]>([]);
const exceptions = ref<AvailabilityExceptionRow[]>([]);
const loadingRules = ref(true);
const loadingExceptions = ref(true);
const showAddException = ref(false);
const creatingException = ref(false);
const savingRule = ref(false);

// Week grid: Mon(1)..Sun(0) in display order
const allDayIndices = [1, 2, 3, 4, 5, 6, 0];

// Form state
const showForm = ref(false);
const editingRule = ref<AvailabilityRuleRow | null>(null);
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

// Computed: Map day_of_week → rule for O(1) lookup
const rulesByDay = computed(() => {
  const map = new Map<number, AvailabilityRuleRow>();
  for (const rule of rules.value) {
    map.set(rule.day_of_week, rule);
  }
  return map;
});

// Day labels
const dayShortLabels: Record<number, string> = {
  0: "availability.day_short_sun",
  1: "availability.day_short_mon",
  2: "availability.day_short_tue",
  3: "availability.day_short_wed",
  4: "availability.day_short_thu",
  5: "availability.day_short_fri",
  6: "availability.day_short_sat",
};

const dayShortLabel = (day: number) => t(dayShortLabels[day]);

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

const formatTimeRange = (rule: AvailabilityRuleRow) => {
  const start = rule.start_time.slice(0, 5);
  const end = rule.end_time.slice(0, 5);
  return `${start}-${end}`;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(locale.value, {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
};

const cellClass = (dayIndex: number) => {
  const rule = rulesByDay.value.get(dayIndex);
  if (rule) {
    return rule.is_active
      ? "bg-green-50 border-2 border-green-200 hover:border-green-300 shadow-sm"
      : "bg-gray-100 border-2 border-gray-200 hover:border-gray-300";
  }
  return "bg-cream border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-cream-light";
};

// Interactions
const handleDayClick = (dayIndex: number) => {
  const rule = rulesByDay.value.get(dayIndex);
  if (rule) {
    openEditForm(rule);
  } else {
    openAddForm(dayIndex);
  }
};

const openAddForm = (dayIndex?: number) => {
  editingRule.value = null;
  newRule.value = {
    day_of_week: dayIndex ?? 1,
    start_time: "10:00",
    end_time: "18:00",
    slot_duration: 120,
  };
  showForm.value = true;
};

const openEditForm = (rule: AvailabilityRuleRow) => {
  editingRule.value = rule;
  newRule.value = {
    day_of_week: rule.day_of_week,
    start_time: rule.start_time.slice(0, 5),
    end_time: rule.end_time.slice(0, 5),
    slot_duration: rule.slot_duration,
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingRule.value = null;
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

// CRUD Rules
const saveRule = async () => {
  savingRule.value = true;
  try {
    if (editingRule.value) {
      const res = await adminFetch<{
        success: boolean;
        data: AvailabilityRuleRow;
      }>(`/api/admin/availability/${editingRule.value.id}`, {
        method: "PATCH",
        body: newRule.value,
      });
      const idx = rules.value.findIndex(
        (r) => r.id === editingRule.value!.id
      );
      if (idx !== -1) rules.value[idx] = res.data;
    } else {
      const res = await adminFetch<{
        success: boolean;
        data: AvailabilityRuleRow;
      }>("/api/admin/availability", {
        method: "POST",
        body: newRule.value,
      });
      rules.value.push(res.data);
    }
    closeForm();
  } catch (err) {
    console.error("Error saving rule:", err);
  } finally {
    savingRule.value = false;
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

const confirmDeleteRule = async () => {
  if (!editingRule.value) return;
  if (!confirm(t("availability.delete_confirm"))) return;
  await deleteRule(editingRule.value.id);
  closeForm();
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

// CRUD Exceptions
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

<style scoped>
/* Custom select chevron — larger and consistent */
.avail-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
}

/* Time/date inputs: enlarge native icons */
.avail-input::-webkit-calendar-picker-indicator {
  width: 20px;
  height: 20px;
  opacity: 0.4;
  cursor: pointer;
}
.avail-input::-webkit-calendar-picker-indicator:hover {
  opacity: 0.6;
}
</style>
