import { defineEventHandler, getQuery, createError } from "h3";
import {
  getActiveAvailabilityRules,
  getAvailabilityExceptions,
  getBookedSlots,
  type AvailabilityRuleRow,
  type AvailabilityExceptionRow,
} from "~/server/utils/supabase";

interface SlotResponse {
  date: string;
  time: string;
  available: boolean;
}

// Générer les créneaux à partir d'une règle pour une date donnée
function generateSlotsFromRule(
  rule: AvailabilityRuleRow,
  date: string
): { time: string }[] {
  const slots: { time: string }[] = [];

  const [startHour, startMin] = rule.start_time.split(":").map(Number);
  const [endHour, endMin] = rule.end_time.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const duration = rule.slot_duration;

  for (let time = startMinutes; time + duration <= endMinutes; time += duration) {
    const hour = Math.floor(time / 60);
    const min = time % 60;
    slots.push({
      time: `${hour.toString().padStart(2, "0")}h${min.toString().padStart(2, "0")}`,
    });
  }

  return slots;
}

// Vérifier si une date est bloquée par une exception
function isDateBlocked(
  date: string,
  exceptions: AvailabilityExceptionRow[]
): boolean {
  return exceptions.some(
    (ex) =>
      ex.exception_date === date &&
      ex.exception_type === "block" &&
      !ex.start_time // Journée entière bloquée
  );
}

// Récupérer les exceptions "add" pour une date
function getAddedSlots(
  date: string,
  exceptions: AvailabilityExceptionRow[]
): { time: string }[] {
  const slots: { time: string }[] = [];

  exceptions
    .filter((ex) => ex.exception_date === date && ex.exception_type === "add")
    .forEach((ex) => {
      if (ex.start_time && ex.end_time) {
        const [startHour, startMin] = ex.start_time.split(":").map(Number);
        const [endHour, endMin] = ex.end_time.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const duration = 120; // 2h par défaut pour les exceptions

        for (let time = startMinutes; time + duration <= endMinutes; time += duration) {
          const hour = Math.floor(time / 60);
          const min = time % 60;
          slots.push({
            time: `${hour.toString().padStart(2, "0")}h${min.toString().padStart(2, "0")}`,
          });
        }
      }
    });

  return slots;
}

// Récupérer les créneaux bloqués partiellement pour une date
function getBlockedTimeSlots(
  date: string,
  exceptions: AvailabilityExceptionRow[]
): string[] {
  return exceptions
    .filter(
      (ex) =>
        ex.exception_date === date &&
        ex.exception_type === "block" &&
        ex.start_time
    )
    .map((ex) => {
      const [hour, min] = ex.start_time!.split(":").map(Number);
      return `${hour.toString().padStart(2, "0")}h${min.toString().padStart(2, "0")}`;
    });
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const fromDate = query.from as string;
    const toDate = query.to as string;

    if (!fromDate || !toDate) {
      throw createError({
        statusCode: 400,
        message: "Les paramètres 'from' et 'to' sont requis",
      });
    }

    // Récupérer les règles actives, les exceptions et les créneaux réservés en parallèle
    const [rules, exceptions, bookedSlots] = await Promise.all([
      getActiveAvailabilityRules(),
      getAvailabilityExceptions(fromDate, toDate),
      getBookedSlots(fromDate, toDate),
    ]);

    const slots: SlotResponse[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Générer les dates entre from et to
    const startDate = new Date(fromDate + "T12:00:00"); // Midi pour éviter les problèmes de fuseau horaire
    const endDate = new Date(toDate + "T12:00:00");

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      // Ne pas inclure les dates passées
      if (date < today) continue;

      // Formater la date en local (évite les problèmes avec toISOString qui est en UTC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const dayOfWeek = date.getDay();

      // Vérifier si la journée est bloquée
      if (isDateBlocked(dateStr, exceptions)) continue;

      // Récupérer les règles pour ce jour de la semaine
      const dayRules = rules.filter((r) => r.day_of_week === dayOfWeek);

      // Générer les créneaux depuis les règles
      const ruleSlots: { time: string }[] = [];
      dayRules.forEach((rule) => {
        ruleSlots.push(...generateSlotsFromRule(rule, dateStr));
      });

      // Ajouter les créneaux des exceptions "add"
      const addedSlots = getAddedSlots(dateStr, exceptions);
      ruleSlots.push(...addedSlots);

      // Récupérer les créneaux partiellement bloqués
      const blockedTimes = getBlockedTimeSlots(dateStr, exceptions);

      // Filtrer les créneaux bloqués
      const availableTimeSlots = ruleSlots.filter(
        (slot) => !blockedTimes.includes(slot.time)
      );

      // Vérifier la disponibilité de chaque créneau (recherche O(1) dans le Set)
      for (const slot of availableTimeSlots) {
        const slotKey = `${dateStr}_${slot.time}`;
        const isBooked = bookedSlots.has(slotKey);
        slots.push({
          date: dateStr,
          time: slot.time,
          available: !isBooked,
        });
      }
    }

    // Trier par date puis par heure
    slots.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

    return {
      slots, // Retourner tous les créneaux avec leur statut de disponibilité
      total: slots.length,
      available: slots.filter((s) => s.available).length,
    };
  } catch (error: any) {
    console.error("❌ Erreur API slots:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la récupération des créneaux",
    });
  }
});
