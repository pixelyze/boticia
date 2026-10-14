/**
 * Quote Requests Utility Functions
 * CRUD operations for wedding quote requests
 */

import { getSupabase } from "./supabase";
import type {
  QuoteRequest,
  CreateQuoteRequestInput,
  UpdateQuoteRequestInput,
  QuoteActivityAction,
  QuoteActivityLog,
} from "./quotes-types";

/**
 * Create a quote request
 */
export async function createQuoteRequest(
  input: CreateQuoteRequestInput
): Promise<QuoteRequest | null> {
  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Error creating quote request:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Get all quote requests with optional status filter
 */
export async function getQuoteRequests(
  filters?: { status?: string }
): Promise<QuoteRequest[]> {
  try {
    // L'état des devis est joint : le dashboard en a besoin pour repérer
    // les propositions restées sans réponse. Les changements de statut
    // datent l'envoi du devis (updated_at bouge à chaque note).
    let query = getSupabase()
      .from("quote_requests")
      // Une seule chaîne littérale : Supabase en déduit le type du résultat.
      .select(
        "*, project_proposals(id, status, created_at, sent_at), quote_activity_log(action, details, created_at)"
      )
      .in("quote_activity_log.action", ["status_changed", "client_message"]);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error getting quote requests:", error.message);
      return [];
    }

    return (data || []).map(({ quote_activity_log: log, ...quote }) => {
      // Date du dernier envoi : celle du devis le plus récemment envoyé
      // (une V2 relance le compteur), à défaut le journal d'activité.
      const proposalSentAt = (quote.project_proposals || [])
        .map((p: any) => p.sent_at as string | null)
        .filter(Boolean)
        .sort()
        .pop();
      const logSentAt = (log || [])
        .filter(
          (entry: any) =>
            entry.action === "status_changed" &&
            entry.details?.to === "quote_sent"
        )
        .map((entry: any) => entry.created_at as string)
        .sort()
        .pop();
      // Messages « Écrire à Laëtitia » sur le dernier devis : une nouvelle
      // version remet le compteur à zéro.
      const latestProposal = [...(quote.project_proposals || [])].sort(
        (a: any, b: any) => b.created_at.localeCompare(a.created_at)
      )[0];
      const clientMessageCount = latestProposal
        ? (log || []).filter(
            (entry: any) =>
              entry.action === "client_message" &&
              entry.details?.proposal_id === latestProposal.id
          ).length
        : 0;
      return {
        ...quote,
        quote_sent_at: proposalSentAt ?? logSentAt ?? null,
        client_message_count: clientMessageCount,
      };
    });
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Get quote request by ID
 */
export async function getQuoteRequestById(
  id: string
): Promise<QuoteRequest | null> {
  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting quote request:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update quote request (status + admin_notes)
 */
export async function updateQuoteRequest(
  id: string,
  input: UpdateQuoteRequestInput
): Promise<QuoteRequest | null> {
  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating quote request:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Add an entry to the quote activity log
 */
export async function addQuoteActivity(
  quoteId: string,
  action: QuoteActivityAction,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    const { error } = await getSupabase()
      .from("quote_activity_log")
      .insert({ quote_id: quoteId, action, details });

    if (error) {
      console.error("Error adding activity log:", error.message);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

/**
 * Messages « Écrire à Laëtitia » d'une cliente sur une version de devis,
 * du plus ancien au plus récent.
 */
export async function getClientMessages(
  quoteId: string,
  proposalId: string
): Promise<{ text: string; created_at: string }[]> {
  const { data, error } = await getSupabase()
    .from("quote_activity_log")
    .select("details, created_at")
    .eq("quote_id", quoteId)
    .eq("action", "client_message")
    .eq("details->>proposal_id", proposalId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error getting client messages:", error.message);
    return [];
  }
  return (data || []).map((row: any) => ({
    text: row.details?.text || "",
    created_at: row.created_at,
  }));
}

/**
 * Get the activity log for a quote
 */
export async function getQuoteActivityLog(
  quoteId: string
): Promise<QuoteActivityLog[]> {
  try {
    const { data, error } = await getSupabase()
      .from("quote_activity_log")
      .select("*")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting activity log:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Delete an activity log entry (notes only)
 */
export async function deleteQuoteActivity(
  activityId: string
): Promise<void> {
  const { error } = await getSupabase()
    .from("quote_activity_log")
    .delete()
    .eq("id", activityId)
    .eq("action", "note_added");

  if (error) {
    console.error("Error deleting activity:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }
}

/**
 * Update a note's text in the activity log
 */
export async function updateQuoteActivity(
  activityId: string,
  text: string
): Promise<QuoteActivityLog> {
  const { data, error } = await getSupabase()
    .from("quote_activity_log")
    .update({ details: { text } })
    .eq("id", activityId)
    .eq("action", "note_added")
    .select()
    .single();

  if (error) {
    console.error("Error updating activity:", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
}
