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
    let query = getSupabase()
      .from("quote_requests")
      .select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error getting quote requests:", error.message);
      return [];
    }

    return data || [];
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
