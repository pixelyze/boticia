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

/** Délai après l'envoi du devis au-delà duquel il faut relancer. */
export const STALE_AFTER_DAYS = 7;

/**
 * Jours écoulés depuis l'envoi du devis. Sans envoi journalisé (anciens
 * dossiers), on retombe sur la dernière mise à jour de la demande.
 */
export function daysSinceQuoteSent(q: QuoteRequest): number {
  const from = new Date(q.quote_sent_at || q.updated_at);
  return Math.floor((Date.now() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Relance : devis envoyé depuis plus de 7 jours, sans réponse. Pas de
 * relance si la cliente a demandé une modification : elle a répondu, la
 * main est à Laetitia. Partagé par le suivi des demandes (étiquette) et
 * le tableau de bord (alerte), pour qu'ils disent toujours la même chose.
 */
export function isQuoteStale(q: QuoteRequest): boolean {
  return (
    q.status === "quote_sent" &&
    !isRevisionRequested(q) &&
    daysSinceQuoteSent(q) > STALE_AFTER_DAYS
  );
}
