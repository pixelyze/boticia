/**
 * Rappel de relance : Laëtitia reçoit un email deux jours après qu'une
 * cliente a ouvert son devis sans y répondre, pour lui écrire sur WhatsApp.
 * Fonctions pures, testées dans tests/unit/followup.test.ts.
 */

const TIME_ZONE = "Europe/Paris";

/** Date du jour à Paris, au format ISO (2026-11-02). */
function parisDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Instant UTC de minuit à Paris pour une date ISO (heure d'été comprise). */
function parisMidnight(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  // Décalage de Paris à cet instant : 1 h en hiver, 2 h en été.
  const wall = new Date(guess.toLocaleString("en-US", { timeZone: TIME_ZONE }));
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(guess.getTime() - (wall.getTime() - utc.getTime()));
}

/**
 * Un devis ouvert avant cet instant mérite un rappel aujourd'hui.
 * C'est minuit, heure de Paris, la veille : un devis ouvert le mardi
 * (à n'importe quelle heure) donne un rappel le jeudi matin.
 */
export function followupCutoff(now: Date): Date {
  const today = parisMidnight(parisDate(now));
  // Midi la veille, pour tomber sur la bonne date même un jour de
  // changement d'heure (journée de 23 ou 25 h).
  const yesterdayNoon = new Date(today.getTime() - 12 * 60 * 60 * 1000);
  return parisMidnight(parisDate(yesterdayNoon));
}

/** Samedi ou dimanche à Paris : pas de rappel, ils partent le lundi. */
export function isWeekendInParis(now: Date): boolean {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(now);
  return day === "Sat" || day === "Sun";
}

/**
 * Numéro au format attendu par wa.me (chiffres seuls, indicatif sans « + »).
 * Les numéros français saisis sans indicatif prennent le 33.
 * Renvoie null si le numéro est inexploitable.
 */
export function toWhatsAppNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  // « +33 06 47… » : le 0 national en trop après l'indicatif.
  if (digits.startsWith("330") && digits.length === 12) {
    digits = "33" + digits.slice(3);
  }
  // « 06 47 96 15 80 » : numéro français sans indicatif.
  if (digits.startsWith("0") && digits.length === 10) {
    digits = "33" + digits.slice(1);
  }
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/** Premier prénom saisi (« Clémentine Vallet » → « Clémentine »). */
export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

/** Lien WhatsApp avec le message de relance déjà écrit. */
export function followupWhatsAppUrl(number: string, firstName: string): string {
  const text =
    `Bonjour ${firstName}, c'est Laëtitia de Boticia 🌸 Avez-vous eu le ` +
    "temps de regarder le devis ? Je reste disponible si vous avez des " +
    "questions.";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** « jeudi 29 octobre », à l'heure de Paris. */
export function formatParisDay(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}
