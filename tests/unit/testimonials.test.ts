import { describe, it, expect } from "vitest";
import {
  localizeTestimonial,
  parseTestimonialInput,
  TESTIMONIAL_LIMITS,
} from "~/utils/testimonials";

const full = {
  id: "1",
  text_fr: "Magnifique",
  text_en: "Beautiful",
  author_name: "Sophie M.",
  context_fr: "Mariage en Provence",
  context_en: "Wedding in Provence",
};

describe("localizeTestimonial", () => {
  it("français sur le site français", () => {
    expect(localizeTestimonial(full, "fr")).toEqual({
      id: "1",
      text: "Magnifique",
      name: "Sophie M.",
      location: "Mariage en Provence",
    });
  });

  it("anglais sur le site anglais", () => {
    const t = localizeTestimonial(full, "en");
    expect(t.text).toBe("Beautiful");
    expect(t.location).toBe("Wedding in Provence");
  });

  it("anglais sur le site japonais", () => {
    expect(localizeTestimonial(full, "ja").text).toBe("Beautiful");
  });

  it("français si l'anglais manque", () => {
    const t = localizeTestimonial(
      { ...full, text_en: null, context_en: "" },
      "en"
    );
    expect(t.text).toBe("Magnifique");
    expect(t.location).toBe("Mariage en Provence");
  });

  it("pas de précision : null", () => {
    const t = localizeTestimonial(
      { ...full, context_fr: null, context_en: null },
      "fr"
    );
    expect(t.location).toBeNull();
  });
});

describe("parseTestimonialInput", () => {
  it("nettoie les espaces et vide les champs facultatifs", () => {
    const r = parseTestimonialInput({
      text_fr: "  Merci !  ",
      text_en: "   ",
      author_name: " Inès ",
      context_fr: "",
      is_published: false,
    });
    expect(r).toEqual({
      data: {
        text_fr: "Merci !",
        text_en: null,
        author_name: "Inès",
        context_fr: null,
        context_en: null,
        is_published: false,
      },
    });
  });

  it("publié par défaut", () => {
    const r = parseTestimonialInput({ text_fr: "a", author_name: "b" });
    expect("data" in r && r.data.is_published).toBe(true);
  });

  it("refuse un texte français vide ou un nom vide", () => {
    expect(parseTestimonialInput({ author_name: "b" })).toHaveProperty("error");
    expect(parseTestimonialInput({ text_fr: "a" })).toHaveProperty("error");
    expect(parseTestimonialInput(null)).toHaveProperty("error");
  });

  it("refuse les textes trop longs", () => {
    const long = "x".repeat(TESTIMONIAL_LIMITS.text + 1);
    expect(
      parseTestimonialInput({ text_fr: "a", text_en: long, author_name: "b" })
    ).toHaveProperty("error");
  });

  it("ignore les champs inconnus (pas de position ni d'id imposés)", () => {
    const r = parseTestimonialInput({
      text_fr: "a",
      author_name: "b",
      position: 99,
      id: "x",
    } as any);
    expect("data" in r && Object.keys(r.data)).not.toContain("position");
  });

  it("refuse les valeurs qui ne sont pas du texte", () => {
    expect(
      parseTestimonialInput({ text_fr: 42, author_name: "b" } as any)
    ).toHaveProperty("error");
  });
});
