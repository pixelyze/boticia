/**
 * Envoi des rappels de relance, appelé par le cron quotidien.
 * Règles (calculs dans followup.ts) :
 * - devis ouvert par la cliente au plus tard l'avant-veille, heure de Paris ;
 * - toujours sans réponse : ni validé, ni message « Écrire à Laëtitia » ;
 * - version en cours, demande ni signée, ni terminée, ni annulée ;
 * - un seul rappel par version ; rien le week-end (rattrapé le lundi).
 */

import { getSupabase } from "~/server/utils/supabase";
import { getClientMessages } from "~/server/utils/quotes";
import { sendProposalFollowupReminder } from "~/server/utils/email";
import {
  followupCutoff,
  isWeekendInParis,
  toWhatsAppNumber,
  firstNameOf,
  followupWhatsAppUrl,
  formatParisDay,
} from "~/server/utils/followup";

const CLOSED_QUOTE_STATUSES = ["signed", "completed", "cancelled"];

export async function sendFollowupReminders(
  now = new Date()
): Promise<{ sent: number; skipped: string | null }> {
  if (isWeekendInParis(now)) return { sent: 0, skipped: "weekend" };

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("project_proposals")
    .select(
      "id, quote_id, viewed_at, " +
        "quote_requests!inner(partner1_name, partner2_name, phone, status)"
    )
    .eq("status", "viewed")
    .not("sent_at", "is", null)
    .is("superseded_at", null)
    .is("followup_reminder_sent_at", null)
    .lt("viewed_at", followupCutoff(now).toISOString());

  if (error) throw new Error(`Followup query failed: ${error.message}`);

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3020";
  let sent = 0;

  for (const row of (data || []) as any[]) {
    const quote = row.quote_requests;
    if (CLOSED_QUOTE_STATUSES.includes(quote.status)) continue;

    // Elle a écrit à Laëtitia sur cette version : c'est déjà une réponse.
    const messages = await getClientMessages(row.quote_id, row.id);
    if (messages.length > 0) continue;

    const number = toWhatsAppNumber(quote.phone);
    const ok = await sendProposalFollowupReminder({
      coupleName: quote.partner2_name
        ? `${quote.partner1_name} & ${quote.partner2_name}`
        : quote.partner1_name,
      isCouple: !!quote.partner2_name,
      openedOn: formatParisDay(row.viewed_at),
      whatsappUrl: number
        ? followupWhatsAppUrl(number, firstNameOf(quote.partner1_name))
        : null,
      dashboardUrl: `${siteUrl}/fr/dashboard/quotes/${row.quote_id}`,
    });
    if (!ok) continue;

    const { error: markError } = await supabase
      .from("project_proposals")
      .update({ followup_reminder_sent_at: now.toISOString() })
      .eq("id", row.id);
    if (markError) {
      console.error("Followup mark failed:", row.id, markError.message);
    }
    sent++;
  }

  return { sent, skipped: null };
}
