import { describe, it, expect } from "vitest";
import {
  followupCutoff,
  isWeekendInParis,
  toWhatsAppNumber,
  firstNameOf,
  followupWhatsAppUrl,
  formatParisDay,
} from "~/server/utils/followup";

describe("followupCutoff", () => {
  // Le cron passe à 6 h UTC, soit 7 h à Paris en hiver.
  const thursday = new Date("2026-11-05T06:00:00Z");

  it("vaut minuit à Paris la veille (hiver, UTC+1)", () => {
    expect(followupCutoff(thursday).toISOString()).toBe(
      "2026-11-03T23:00:00.000Z"
    );
  });

  it("vaut minuit à Paris la veille (été, UTC+2)", () => {
    expect(
      followupCutoff(new Date("2026-07-09T06:00:00Z")).toISOString()
    ).toBe("2026-07-07T22:00:00.000Z");
  });

  it("un devis ouvert mardi soir est relancé jeudi", () => {
    const tuesdayNight = new Date("2026-11-03T22:59:00Z"); // 23 h 59 Paris
    expect(tuesdayNight < followupCutoff(thursday)).toBe(true);
  });

  it("un devis ouvert mercredi n'est pas encore relancé jeudi", () => {
    const wednesdayDawn = new Date("2026-11-03T23:01:00Z"); // 0 h 01 Paris
    expect(wednesdayDawn < followupCutoff(thursday)).toBe(false);
  });

  it("tombe juste le lendemain du passage à l'heure d'hiver", () => {
    // Dimanche 25 octobre 2026 : journée de 25 h.
    expect(
      followupCutoff(new Date("2026-10-26T06:00:00Z")).toISOString()
    ).toBe("2026-10-24T22:00:00.000Z");
  });
});

describe("isWeekendInParis", () => {
  it("samedi et dimanche", () => {
    expect(isWeekendInParis(new Date("2026-11-07T06:00:00Z"))).toBe(true);
    expect(isWeekendInParis(new Date("2026-11-08T06:00:00Z"))).toBe(true);
  });

  it("lundi et vendredi", () => {
    expect(isWeekendInParis(new Date("2026-11-09T06:00:00Z"))).toBe(false);
    expect(isWeekendInParis(new Date("2026-11-06T06:00:00Z"))).toBe(false);
  });
});

describe("toWhatsAppNumber", () => {
  it("numéro français sans indicatif", () => {
    expect(toWhatsAppNumber("06 47 96 15 80")).toBe("33647961580");
  });

  it("indicatif avec le 0 en trop", () => {
    expect(toWhatsAppNumber("+33 06 47 96 15 80")).toBe("33647961580");
  });

  it("indicatif correct ou en 00", () => {
    expect(toWhatsAppNumber("+33 6 47 96 15 80")).toBe("33647961580");
    expect(toWhatsAppNumber("0033647961580")).toBe("33647961580");
  });

  it("numéro étranger gardé tel quel", () => {
    expect(toWhatsAppNumber("+81 90 1234 5678")).toBe("819012345678");
  });

  it("numéro vide ou inexploitable", () => {
    expect(toWhatsAppNumber("")).toBeNull();
    expect(toWhatsAppNumber(null)).toBeNull();
    expect(toWhatsAppNumber("12")).toBeNull();
  });
});

describe("textes", () => {
  it("premier prénom", () => {
    expect(firstNameOf("Clémentine Vallet")).toBe("Clémentine");
    expect(firstNameOf("  Inès ")).toBe("Inès");
  });

  it("lien WhatsApp avec le message écrit", () => {
    const url = followupWhatsAppUrl("33647961580", "Clémentine");
    expect(url.startsWith("https://wa.me/33647961580?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1])).toContain(
      "Bonjour Clémentine, c'est Laëtitia de Boticia"
    );
  });

  it("date en français, heure de Paris", () => {
    // 23 h 30 UTC le mercredi = jeudi à Paris.
    expect(formatParisDay("2026-10-28T23:30:00Z")).toBe("jeudi 29 octobre");
  });
});
