/**
 * Quote Requests Utility Functions
 * CRUD operations for wedding quote requests
 */

import { getSupabase } from "./supabase";
import type {
  QuoteRequest,
  CreateQuoteRequestInput,
  UpdateQuoteRequestInput,
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
