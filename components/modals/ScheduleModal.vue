<template>
  <BaseModal
    :isOpen="isOpen"
    :title="isConfirmed ? $t('planifier.confirmed_title') : $t('planifier.title')"
    :subtitle="isConfirmed ? undefined : props.subtitle"
    :closeButtonText="isConfirmed ? $t('planifier.back_to_space') : $t('common.close')"
    @close="onClose"
  >
    <!-- État confirmé -->
    <template v-if="isConfirmed">
      <div class="text-center">
        <StatusIcon type="success" class="mb-6" />
        <p class="text-lg text-gray-600 mb-4">
          {{ $t("planifier.confirmed_message", { date: formatSelectedSlot() }) }}
        </p>
        <p class="text-sm text-gray-500">
          {{ $t("planifier.confirmed_hint") }}
        </p>
      </div>
    </template>

    <!-- Sélection de créneau -->
    <template v-else>
      <div>
        <!-- Header avec mois et navigation -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h3 class="text-lg font-bold uppercase tracking-wide">
            {{ currentMonthLabel }}
          </h3>
          <div class="flex gap-1">
            <button
              @click="previousMonth"
              :disabled="!canGoPrevious"
              class="w-10 h-10 flex items-center justify-center transition-colors"
              :class="canGoPrevious ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-300 cursor-not-allowed'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              @click="nextMonth"
              :disabled="!canGoNext"
              class="w-10 h-10 flex items-center justify-center transition-colors"
              :class="canGoNext ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-300 cursor-not-allowed'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Info politique de report -->
        <div class="bg-gray-50 border-l-4 border-gray-400 p-4 mb-6">
          <p class="text-sm text-gray-700">
            <span class="font-semibold">📅 {{ $t("planifier.reschedule_info_title") }}</span><br>
            {{ $t("planifier.reschedule_info_message") }}
          </p>
        </div>

        <!-- État de chargement -->
        <div v-if="isLoading" class="py-12 text-center">
          <div class="inline-block w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
          <p class="text-gray-500">{{ $t("planifier.loading") }}</p>
        </div>

        <!-- État vide (aucun créneau disponible) -->
        <div v-else-if="processedGroups.length === 0" class="py-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <p class="text-gray-500">{{ $t("planifier.no_slots") }}</p>
        </div>

        <!-- Liste des jours groupés par semaine -->
        <div v-else class="space-y-6">
          <div v-for="(group, groupIndex) in processedGroups" :key="groupIndex">
            <!-- Label de la semaine -->
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {{ group.label }}
            </p>

            <!-- Grille des jours -->
            <div class="grid grid-cols-2 gap-3">
              <template v-for="(day, index) in group.days" :key="day.dateKey">
                <!-- Jour hors du mois courant (Placeholder vide) -->
                <div
                  v-if="day.isOutOfMonth"
                  class="p-4 border border-gray-200 bg-white"
                >
                  <!-- Vide avec bordure grise -->
                </div>
                <!-- Placeholder pour jour non disponible -->
                <div
                  v-else-if="day.slots.length === 0 || areAllSlotsExpired(day)"
                  class="p-4 border-2 border-dashed border-gray-200 bg-gray-50"
                >
                  <p class="font-semibold text-base text-gray-300 capitalize">{{ day.shortLabel }}</p>
                  <p class="text-xs mt-1 text-gray-300">{{ $t("planifier.unavailable") }}</p>
                </div>
                <!-- Jour disponible -->
                <button
                  v-else
                  @click="selectDay(day)"
                  class="text-left p-4 border-2 transition-all"
                  :class="selectedDay?.dateKey === day.dateKey
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-gray-200 hover:border-black'"
                >
                  <p class="font-semibold text-base capitalize">{{ day.shortLabel }}</p>
                  <p
                    class="text-sm mt-1"
                    :class="selectedDay?.dateKey === day.dateKey ? 'text-gray-300' : 'text-gray-400'"
                  >
                    {{ day.relativeLabel }}
                  </p>
                </button>
              </template>
            </div>

            <!-- Créneaux horaires (sous la grille des jours si un jour de ce groupe est sélectionné) -->
            <div
              v-if="selectedDay && group.days.some(d => d.dateKey === selectedDay.dateKey)"
              :key="selectedDay.dateKey"
              class="slots-container space-y-2 mt-3"
            >
              <p class="text-xs text-dark/40 mb-1">
                {{ $t("planifier.timezone_hint") }}
              </p>
              <template v-for="slot in selectedDay.slots" :key="slot.id">
                <div class="flex gap-3">
                  <!-- Bouton créneau -->
                  <button
                    @click="!isSlotDisabled(slot) && selectSlot(slot)"
                    :disabled="isSlotDisabled(slot)"
                    class="slot-btn flex items-center gap-3 p-3 border-2 transition-all duration-300 origin-left"
                    :class="[
                      isSlotDisabled(slot)
                        ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed flex-1'
                        : selectedSlot?.id === slot.id
                          ? 'bg-black text-white border-black is-selected'
                          : 'bg-white border-gray-200 hover:border-black flex-1'
                    ]"
                  >
                    <span
                      class="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200"
                      :class="[
                        slot.isBooked ? 'bg-red-300' : isSlotExpired(slot) ? 'bg-gray-300' : (selectedSlot?.id === slot.id ? 'bg-green-400 scale-150' : 'bg-green-500')
                      ]"
                    />
                    <span class="font-medium flex-1 text-left">{{ formatTime(slot.time) }}</span>
                    <!-- Label pour créneau réservé -->
                    <span v-if="slot.isBooked" class="text-xs text-gray-400">
                      {{ $t("planifier.slot_booked") }}
                    </span>
                  </button>

                  <!-- Bouton Valider (apparaît si créneau sélectionné) -->
                  <Button
                    v-if="selectedSlot?.id === slot.id"
                    @click="confirmBooking"
                    variant="primary"
                    rightIcon="MoveRight"
                    class="validate-btn flex-1"
                  >
                    {{ $t("planifier.validate") }}
                  </Button>
                </div>
              </template>
            </div>
          </div>
        </div>

      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

// Helper pour obtenir une clé de date locale (YYYY-MM-DD) sans problème de timezone
const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface Slot {
  id: string;
  date: Date;
  time: string;
  isBooked: boolean;
}

interface DayGroup {
  dateKey: string;
  shortLabel: string;
  relativeLabel: string;
  slots: Slot[];
  isOutOfMonth?: boolean;
}

interface WeekGroup {
  label: string;
  days: DayGroup[];
}

interface ApiSlot {
  date: string;
  time: string;
  available: boolean;
}

const props = defineProps<{
  isOpen: boolean;
  reservationCode?: string;
  expiresAt?: string; // Date d'expiration pour limiter les créneaux (format ISO)
  subtitle?: string; // Sous-titre personnalisé (ex: "Shooting Portrait Signature • 498€")
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirmed", data: { date: string; time: string; displayDate: string }): void;
}>();

// État
const isConfirmed = ref(false);
const selectedDay = ref<DayGroup | null>(null);
const selectedSlot = ref<Slot | null>(null);
const currentMonth = ref(new Date());
const isLoading = ref(false);
const apiSlots = ref<Slot[]>([]);

// Calculer la plage de dates à récupérer (6 mois à l'avance ou jusqu'à expiresAt)
const getDateRange = () => {
  const today = new Date();
  const from = getLocalDateKey(today);

  let to: Date;
  if (props.expiresAt) {
    to = new Date(props.expiresAt);
  } else {
    to = new Date(today);
    to.setMonth(to.getMonth() + 6);
  }
  return { from, to: getLocalDateKey(to) };
};

// Récupérer les créneaux depuis l'API
const fetchSlots = async () => {
  isLoading.value = true;
  try {
    const { from, to } = getDateRange();
    const response = await $fetch<{ slots: ApiSlot[]; total: number }>(
      "/api/availability/slots",
      { query: { from, to } }
    );

    // Convertir les créneaux API en format interne
    // Ajouter T12:00:00 pour éviter les problèmes de fuseau horaire
    apiSlots.value = response.slots.map((slot) => ({
      id: `${slot.date}-${slot.time}`,
      date: new Date(slot.date + "T12:00:00"),
      time: slot.time,
      isBooked: !slot.available,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux:", error);
    apiSlots.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Reset et fetch quand la modale s'ouvre
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    isConfirmed.value = false;
    selectedDay.value = null;
    selectedSlot.value = null;
    currentMonth.value = new Date();
    await fetchSlots();
  }
});

// Label du mois courant
const currentMonthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString(locale.value, {
    month: "long",
    year: "numeric"
  }).toUpperCase();
});

// Navigation entre les mois
const canGoPrevious = computed(() => {
  const today = new Date();
  return currentMonth.value.getMonth() > today.getMonth() ||
         currentMonth.value.getFullYear() > today.getFullYear();
});

const canGoNext = computed(() => {
  let maxMonth: Date;
  if (props.expiresAt) {
    maxMonth = new Date(props.expiresAt);
  } else {
    const today = new Date();
    maxMonth = new Date(today);
    maxMonth.setMonth(today.getMonth() + 5); // Max 6 mois à l'avance
  }
  return currentMonth.value < maxMonth;
});

const previousMonth = () => {
  if (canGoPrevious.value) {
    const newDate = new Date(currentMonth.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentMonth.value = newDate;
    selectedDay.value = null;
    selectedSlot.value = null;
  }
};

const nextMonth = () => {
  if (canGoNext.value) {
    const newDate = new Date(currentMonth.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentMonth.value = newDate;
    selectedDay.value = null;
    selectedSlot.value = null;
  }
};

// Créneaux disponibles (depuis l'API)
const availableSlots = computed<Slot[]>(() => apiSlots.value);

// Vérifier si un créneau est désactivé (réservé ou passé)
const isSlotDisabled = (slot: Slot): boolean => {
  return slot.isBooked || isSlotExpired(slot);
};

// Vérifier si un créneau est passé
const isSlotExpired = (slot: Slot): boolean => {
  const now = new Date();
  const todayKey = getLocalDateKey(now);
  const slotDateKey = getLocalDateKey(slot.date);
  
  // Si la date est passée
  if (slotDateKey < todayKey) return true;
  
  // Si c'est aujourd'hui, on vérifie l'heure
  if (slotDateKey === todayKey) {
     // Normaliser le format de l'heure (remplacer 'h' par ':')
     const normalizedTime = slot.time.replace('h', ':');
     const [slotHours, slotMinutes] = normalizedTime.split(':').map(Number);
     
     const currentHours = now.getHours();
     const currentMinutes = now.getMinutes();
     
     if (slotHours < currentHours) return true;
     if (slotHours === currentHours && slotMinutes <= currentMinutes) return true;
  }
  
  return false;
};

// Vérifier si tous les créneaux d'un jour sont passés
const areAllSlotsExpired = (day: DayGroup): boolean => {
  return day.slots.length > 0 && day.slots.every(slot => isSlotExpired(slot));
};

// Calculer le nombre de jours depuis aujourd'hui
const getDaysFromNow = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  return Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Label relatif (aujourd'hui, demain, après-demain, dans X jours)
const getRelativeLabel = (date: Date): string => {
  const days = getDaysFromNow(date);
  if (days === 0) return t("planifier.today");
  if (days === 1) return t("planifier.tomorrow");
  if (days === 2) return t("planifier.day_after_tomorrow");
  return t("planifier.in_days", { count: days });
};

// Grouper les créneaux par semaine
const groupedSlots = computed<WeekGroup[]>(() => {
  const groups: WeekGroup[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculer le début de cette semaine (lundi)
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const thisWeekStart = getWeekStart(today);

  // Grouper par semaine
  const weekMap = new Map<number, { weekStart: Date; slots: Slot[] }>();

  availableSlots.value.forEach(slot => {
    const slotDate = new Date(slot.date);
    const weekStart = getWeekStart(slotDate);
    const weekKey = weekStart.getTime();

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { weekStart, slots: [] });
    }
    weekMap.get(weekKey)!.slots.push(slot);
  });

  // Convertir en groupes avec labels
  const sortedWeeks = Array.from(weekMap.values()).sort(
    (a, b) => a.weekStart.getTime() - b.weekStart.getTime()
  );

  sortedWeeks.forEach(({ weekStart, slots }) => {
    const weeksDiff = Math.round(
      (weekStart.getTime() - thisWeekStart.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );

    let label: string;
    if (weeksDiff === 0) {
      label = t("planifier.this_week");
    } else if (weeksDiff === 1) {
      label = t("planifier.next_week");
    } else {
      label = t("planifier.in_weeks", { count: weeksDiff });
    }

    // Grouper par jour
    const dayMap = new Map<string, DayGroup>();
    slots.forEach(slot => {
      const dateKey = getLocalDateKey(slot.date);
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          dateKey,
          shortLabel: slot.date.toLocaleDateString(locale.value, {
            weekday: "short",
            day: "numeric",
            month: "long"
          }),
          relativeLabel: getRelativeLabel(slot.date),
          slots: []
        });
      }
      dayMap.get(dateKey)!.slots.push(slot);
    });

    groups.push({
      label,
      days: Array.from(dayMap.values())
    });
  });

  return groups;
});

// Filtrer les groupes pour le mois courant et avant la date d'expiration
const filteredGroups = computed<WeekGroup[]>(() => {
  const month = currentMonth.value.getMonth();
  const year = currentMonth.value.getFullYear();
  const expiresAt = props.expiresAt ? new Date(props.expiresAt) : null;

  return groupedSlots.value
    .map(group => ({
      ...group,
      days: group.days.filter(day => {
        const date = new Date(day.dateKey + "T12:00:00");
        const inCurrentMonth = date.getMonth() === month && date.getFullYear() === year;
        const beforeExpiry = !expiresAt || date <= expiresAt;
        return inCurrentMonth && beforeExpiry;
      })
    }))
    .filter(group => group.days.length > 0);
});

// Organiser les jours avec placeholders pour maintenir l'alignement
// Weekdays (lun-ven) sur une ligne, Weekend (sam-dim) alignés en paires
const processDaysWithPlaceholders = (days: DayGroup[]): DayGroup[] => {
  const result: DayGroup[] = [];

  // Séparer weekdays et weekends
  const weekdays: DayGroup[] = [];
  const weekendMap = new Map<string, { saturday: DayGroup | null; sunday: DayGroup | null }>();

  days.forEach(day => {
    const date = new Date(day.dateKey + "T12:00:00");
    const dayOfWeek = date.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lundi à vendredi
      weekdays.push(day);
    } else {
      // Samedi (6) ou Dimanche (0)
      // Calculer la clé de la semaine (basée sur le samedi)
      const weekStart = new Date(date);
      if (dayOfWeek === 0) {
        weekStart.setDate(date.getDate() - 1); // Dimanche -> samedi précédent
      }
      const weekKey = getLocalDateKey(weekStart);

      if (!weekendMap.has(weekKey)) {
        weekendMap.set(weekKey, { saturday: null, sunday: null });
      }

      if (dayOfWeek === 6) {
        weekendMap.get(weekKey)!.saturday = day;
      } else {
        weekendMap.get(weekKey)!.sunday = day;
      }
    }
  });

  // Ajouter les weekdays triés
  weekdays.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  result.push(...weekdays);

  // Helper pour vérifier si une date est hors du mois courant
  const isDateOutOfMonth = (date: Date): boolean => {
    return date.getMonth() !== currentMonth.value.getMonth() || 
           date.getFullYear() !== currentMonth.value.getFullYear();
  };

  // Helper pour créer un jour vide
  const createUnavailableDay = (date: Date): DayGroup => {
    return {
      dateKey: getLocalDateKey(date),
      shortLabel: date.toLocaleDateString(locale.value, {
        weekday: "short",
        day: "numeric",
        month: "long"
      }),
      relativeLabel: getRelativeLabel(date),
      slots: [],
      isOutOfMonth: isDateOutOfMonth(date)
    };
  };

  // Ajouter les weekends avec placeholders
  const sortedWeekends = Array.from(weekendMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  sortedWeekends.forEach(([weekKey, weekend]) => {
    // Samedi
    if (weekend.saturday) {
      result.push(weekend.saturday);
    } else {
      const satDate = new Date(weekKey + "T12:00:00");
      result.push(createUnavailableDay(satDate));
    }

    // Dimanche
    if (weekend.sunday) {
      result.push(weekend.sunday);
    } else {
      const satDate = new Date(weekKey + "T12:00:00");
      const sunDate = new Date(satDate);
      sunDate.setDate(sunDate.getDate() + 1);
      result.push(createUnavailableDay(sunDate));
    }
  });

  return result;
};

// Groupes finaux avec les placeholders appliqués
const processedGroups = computed<WeekGroup[]>(() => {
  return filteredGroups.value.map(group => ({
    ...group,
    days: processDaysWithPlaceholders(group.days)
  }));
});

// Sélectionner un jour
const selectDay = (day: DayGroup) => {
  if (selectedDay.value?.dateKey === day.dateKey) {
    selectedDay.value = null;
    selectedSlot.value = null;
  } else {
    selectedDay.value = day;
    selectedSlot.value = null;
  }
};

// Sélectionner un créneau
const selectSlot = (slot: Slot) => {
  selectedSlot.value = slot;
};

// Formater l'heure (10h00 -> 10h00)
const formatTime = (time: string): string => {
  return time;
};

// Formater le créneau sélectionné pour la confirmation
const formatSelectedSlot = () => {
  if (!selectedSlot.value) return "";
  const dateStr = selectedSlot.value.date.toLocaleDateString(locale.value, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return `${dateStr} à ${selectedSlot.value.time}`;
};

// Formater la date en ISO (YYYY-MM-DD) pour l'API
const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Confirmer la réservation
const confirmBooking = () => {
  if (!selectedSlot.value) return;

  isConfirmed.value = true;
  emit("confirmed", {
    date: formatDateISO(selectedSlot.value.date),
    time: selectedSlot.value.time,
    displayDate: formatSelectedSlot(),
  });
};

// Fermer la modale
const onClose = () => {
  emit("close");
};
</script>

<style scoped>
.slots-container {
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slot-btn {
  width: 100%;
}

.slot-btn.is-selected {
  width: 65%;
}

.validate-btn {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
</style>
