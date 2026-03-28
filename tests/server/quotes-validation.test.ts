import { describe, it, expect } from "vitest";

/**
 * Tests de la logique de validation du formulaire de devis
 * (validation extraite de server/api/quotes/index.post.ts)
 */

const VALID_SERVICE_TYPES = ["mariage", "evenement", "atelier"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateQuoteInput(body: Record<string, any>): string | null {
  if (!body.service_type || !VALID_SERVICE_TYPES.includes(body.service_type)) {
    return "service_type must be mariage, evenement, or atelier";
  }
  if (!body.partner1_name?.trim()) return "partner1_name is required";
  if (!body.email?.trim()) return "email is required";
  if (!body.phone?.trim()) return "phone is required";
  if (!body.meeting_date?.trim()) return "meeting_date is required";
  if (!body.meeting_time?.trim()) return "meeting_time is required";
  if (!EMAIL_REGEX.test(body.email)) return "Invalid email format";
  return null;
}

describe("Quote input validation", () => {
  const validInput = {
    service_type: "mariage",
    partner1_name: "Marie",
    email: "marie@test.com",
    phone: "0612345678",
    meeting_date: "2026-04-10",
    meeting_time: "14h00",
  };

  it("accepte un input valide", () => {
    expect(validateQuoteInput(validInput)).toBeNull();
  });

  it("rejette un service_type invalide", () => {
    expect(validateQuoteInput({ ...validInput, service_type: "invalid" })).toBe(
      "service_type must be mariage, evenement, or atelier"
    );
  });

  it("rejette un service_type vide", () => {
    expect(validateQuoteInput({ ...validInput, service_type: "" })).toBe(
      "service_type must be mariage, evenement, or atelier"
    );
  });

  it("accepte tous les service_types valides", () => {
    for (const type of VALID_SERVICE_TYPES) {
      expect(validateQuoteInput({ ...validInput, service_type: type })).toBeNull();
    }
  });

  it("rejette un partner1_name vide", () => {
    expect(validateQuoteInput({ ...validInput, partner1_name: "" })).toBe(
      "partner1_name is required"
    );
  });

  it("rejette un partner1_name avec seulement des espaces", () => {
    expect(validateQuoteInput({ ...validInput, partner1_name: "   " })).toBe(
      "partner1_name is required"
    );
  });

  it("rejette un email vide", () => {
    expect(validateQuoteInput({ ...validInput, email: "" })).toBe(
      "email is required"
    );
  });

  it("rejette un email invalide", () => {
    expect(validateQuoteInput({ ...validInput, email: "pas-un-email" })).toBe(
      "Invalid email format"
    );
  });

  it("rejette un email sans @", () => {
    expect(validateQuoteInput({ ...validInput, email: "marie.test.com" })).toBe(
      "Invalid email format"
    );
  });

  it("accepte un email valide avec sous-domaine", () => {
    expect(
      validateQuoteInput({ ...validInput, email: "marie@sub.domain.com" })
    ).toBeNull();
  });

  it("rejette un phone vide", () => {
    expect(validateQuoteInput({ ...validInput, phone: "" })).toBe(
      "phone is required"
    );
  });

  it("rejette un meeting_date vide", () => {
    expect(validateQuoteInput({ ...validInput, meeting_date: "" })).toBe(
      "meeting_date is required"
    );
  });

  it("rejette un meeting_time vide", () => {
    expect(validateQuoteInput({ ...validInput, meeting_time: "" })).toBe(
      "meeting_time is required"
    );
  });

  it("rejette un input completement vide", () => {
    expect(validateQuoteInput({})).toBe(
      "service_type must be mariage, evenement, or atelier"
    );
  });
});
