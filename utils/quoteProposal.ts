import type { QuoteRequest } from "~/server/utils/quotes-types";

/**
 * La cliente a demandé une modification de son dernier devis.
 *
 * Seul le dernier compte : quand Laetitia dépose un devis corrigé,
 * l'ancien garde son statut "revision_requested".
 */
export function isRevisionRequested(q: QuoteRequest): boolean {
  const latest = [...(q.project_proposals || [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  )[0];
  return latest?.status === "revision_requested";
}
