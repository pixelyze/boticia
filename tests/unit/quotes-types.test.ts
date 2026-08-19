import { describe, it, expect } from "vitest";
import type {
  QuoteRequest,
  QuoteRequestStatus,
  ServiceType,
  BudgetRange,
  CreateQuoteRequestInput,
} from "~/server/utils/quotes-types";

describe("quotes-types", () => {
  it("ServiceType accepte les valeurs valides", () => {
    const types: ServiceType[] = ["mariage", "evenement", "atelier"];
    expect(types).toHaveLength(3);
    types.forEach((t) => expect(typeof t).toBe("string"));
  });

  it("QuoteRequestStatus couvre tous les statuts du pipeline", () => {
    // L'envoi du moodboard n'est plus une étape : il est porté par
    // moodboard_sent_at sur le dossier.
    const statuses: QuoteRequestStatus[] = [
      "new",
      "contacted",
      "quote_sent",
      "signed",
      "completed",
      "cancelled",
    ];
    expect(statuses).toHaveLength(6);
  });

  it("BudgetRange couvre les tranches definies", () => {
    const ranges: BudgetRange[] = ["lt_2500", "lt_4000", "lt_10000"];
    expect(ranges).toHaveLength(3);
  });

  it("QuoteRequest a les champs obligatoires", () => {
    const quote: QuoteRequest = {
      id: "uuid-123",
      service_type: "mariage",
      partner1_name: "Marie",
      email: "marie@test.com",
      phone: "0612345678",
      floral_needs: ["bridal_bouquet", "table_centerpieces"],
      status: "new",
      portal_enabled: false,
      locale: "fr",
      kanban_position: 0,
      created_at: "2026-03-28T10:00:00Z",
      updated_at: "2026-03-28T10:00:00Z",
    };
    expect(quote.id).toBe("uuid-123");
    expect(quote.service_type).toBe("mariage");
    expect(quote.status).toBe("new");
    expect(quote.floral_needs).toContain("bridal_bouquet");
  });

  it("CreateQuoteRequestInput requiert les champs du formulaire", () => {
    const input: CreateQuoteRequestInput = {
      service_type: "mariage",
      partner1_name: "Marie",
      partner2_name: "Jean",
      email: "couple@test.com",
      phone: "0612345678",
      wedding_date: "2026-09-15",
      venue: "Chateau de Versailles",
      budget: "lt_4000",
      floral_needs: ["bridal_bouquet", "ceremony_arch"],
      meeting_date: "2026-04-10",
      meeting_time: "14h00",
    };
    expect(input.service_type).toBe("mariage");
    expect(input.partner2_name).toBe("Jean");
    expect(input.floral_needs).toHaveLength(2);
  });
});
