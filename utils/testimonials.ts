/**
 * Avis de la page d'accueil : types et règles de langue (sans accès base,
 * testées dans tests/unit/testimonials.test.ts (partagé site + serveur)).
 */

export interface Testimonial {
  id: string;
  text_fr: string;
  text_en: string | null;
  author_name: string;
  context_fr: string | null;
  context_en: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

/** Champs modifiables depuis le tableau de bord (rien d'autre n'est lu). */
export interface TestimonialInput {
  text_fr: string;
  text_en: string | null;
  author_name: string;
  context_fr: string | null;
  context_en: string | null;
  is_published: boolean;
}

/** Avis tel qu'affiché sur le site, dans la langue du visiteur. */
export interface PublicTestimonial {
  id: string;
  text: string;
  name: string;
  location: string | null;
}

/**
 * Maximums (refusés au-delà, champ bloqué dans le tableau de bord).
 * Sur l'accueil, les cartes s'alignent sur la plus haute : un avis très
 * long allonge toutes les autres.
 */
export const TESTIMONIAL_LIMITS = {
  text: 300,
  author: 40,
  context: 50,
} as const;

/**
 * Longueurs conseillées, affichées sous les champs (les avis d'origine
 * font 114 à 154 caractères, soit 4 à 5 lignes sur mobile).
 */
export const TESTIMONIAL_ADVICE = {
  text: { min: 80, max: 200 },
  author: 25,
  context: 30,
} as const;

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/**
 * Lit et vérifie les champs envoyés par le tableau de bord. Renvoie les
 * données propres, ou le message d'erreur à afficher.
 */
export function parseTestimonialInput(
  body: Record<string, unknown> | null | undefined
): { data: TestimonialInput } | { error: string } {
  const b = body ?? {};
  const text_fr = clean(b.text_fr);
  const text_en = clean(b.text_en);
  const author_name = clean(b.author_name);
  const context_fr = clean(b.context_fr);
  const context_en = clean(b.context_en);

  if (!text_fr) return { error: "Le texte en français est obligatoire." };
  if (!author_name) return { error: "Le nom est obligatoire." };
  if (
    text_fr.length > TESTIMONIAL_LIMITS.text ||
    text_en.length > TESTIMONIAL_LIMITS.text
  ) {
    return {
      error: `Le texte ne doit pas dépasser ${TESTIMONIAL_LIMITS.text} caractères.`,
    };
  }
  if (author_name.length > TESTIMONIAL_LIMITS.author) {
    return {
      error: `Le nom ne doit pas dépasser ${TESTIMONIAL_LIMITS.author} caractères.`,
    };
  }
  if (
    context_fr.length > TESTIMONIAL_LIMITS.context ||
    context_en.length > TESTIMONIAL_LIMITS.context
  ) {
    return {
      error: `La précision ne doit pas dépasser ${TESTIMONIAL_LIMITS.context} caractères.`,
    };
  }

  return {
    data: {
      text_fr,
      text_en: text_en || null,
      author_name,
      context_fr: context_fr || null,
      context_en: context_en || null,
      is_published: b.is_published !== false,
    },
  };
}

/**
 * Version affichée selon la langue du site : français pour « fr », anglais
 * pour les autres langues (le japonais compris). Un anglais vide retombe
 * sur le français, pour qu'un avis non traduit reste visible.
 */
export function localizeTestimonial(
  t: Pick<
    Testimonial,
    "id" | "text_fr" | "text_en" | "author_name" | "context_fr" | "context_en"
  >,
  locale: string
): PublicTestimonial {
  const french = locale === "fr";
  return {
    id: t.id,
    text: (french ? t.text_fr : t.text_en || t.text_fr) ?? "",
    name: t.author_name,
    location: (french ? t.context_fr : t.context_en || t.context_fr) || null,
  };
}
