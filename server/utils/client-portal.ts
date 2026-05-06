/**
 * Client Portal Utility Functions
 * CRUD operations for inspirations, moodboard, and proposals
 */

import { getSupabase } from "./supabase";
import type {
  ClientInspiration,
  CreateInspirationInput,
  MoodboardItem,
  CreateMoodboardItemInput,
  ProjectProposal,
  CreateProposalInput,
  UpdateProposalInput,
} from "./client-portal-types";

// ========================================
// INSPIRATIONS
// ========================================

/**
 * Get inspirations by quote ID
 */
export async function getInspirationsByQuoteId(
  quoteId: string
): Promise<ClientInspiration[]> {
  try {
    const { data, error } = await getSupabase()
      .from("client_inspirations")
      .select("*")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting inspirations:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Create an inspiration
 */
export async function createInspiration(
  input: CreateInspirationInput
): Promise<ClientInspiration | null> {
  try {
    const { data, error } = await getSupabase()
      .from("client_inspirations")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Error creating inspiration:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete an inspiration
 */
export async function deleteInspiration(
  id: string
): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("client_inspirations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting inspiration:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

/**
 * Get inspiration by ID
 */
export async function getInspirationById(
  id: string
): Promise<ClientInspiration | null> {
  try {
    const { data, error } = await getSupabase()
      .from("client_inspirations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting inspiration:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Count inspirations for a quote
 */
export async function countInspirations(
  quoteId: string
): Promise<number> {
  try {
    const { count, error } = await getSupabase()
      .from("client_inspirations")
      .select("*", { count: "exact", head: true })
      .eq("quote_id", quoteId);

    if (error) {
      console.error("Error counting inspirations:", error.message);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error("Error:", err);
    return 0;
  }
}

// ========================================
// MOODBOARD
// ========================================

/**
 * Get moodboard items by quote ID
 */
export async function getMoodboardByQuoteId(
  quoteId: string
): Promise<MoodboardItem[]> {
  try {
    const { data, error } = await getSupabase()
      .from("project_moodboard_items")
      .select("*")
      .eq("quote_id", quoteId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error getting moodboard:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Create a moodboard item
 */
export async function createMoodboardItem(
  input: CreateMoodboardItemInput
): Promise<MoodboardItem | null> {
  try {
    const { data, error } = await getSupabase()
      .from("project_moodboard_items")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating moodboard item:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete a moodboard item
 */
export async function deleteMoodboardItem(
  id: string
): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("project_moodboard_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting moodboard item:",
        error.message
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

/**
 * Get moodboard item by ID
 */
export async function getMoodboardItemById(
  id: string
): Promise<MoodboardItem | null> {
  try {
    const { data, error } = await getSupabase()
      .from("project_moodboard_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error getting moodboard item:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

// ========================================
// PROPOSALS
// ========================================

/**
 * Get proposals by quote ID
 */
export async function getProposalsByQuoteId(
  quoteId: string
): Promise<ProjectProposal[]> {
  try {
    const { data, error } = await getSupabase()
      .from("project_proposals")
      .select("*")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting proposals:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

/**
 * Create a proposal
 */
export async function createProposal(
  input: CreateProposalInput
): Promise<ProjectProposal | null> {
  try {
    const { data, error } = await getSupabase()
      .from("project_proposals")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Error creating proposal:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Update a proposal
 */
export async function updateProposal(
  id: string,
  input: UpdateProposalInput
): Promise<ProjectProposal | null> {
  try {
    const { data, error } = await getSupabase()
      .from("project_proposals")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating proposal:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

/**
 * Delete a proposal
 */
export async function deleteProposal(
  id: string
): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("project_proposals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting proposal:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

/**
 * Get proposal by ID
 */
export async function getProposalById(
  id: string
): Promise<ProjectProposal | null> {
  try {
    const { data, error } = await getSupabase()
      .from("project_proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting proposal:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

// ========================================
// QUOTE HELPERS
// ========================================

/**
 * Find the most recent quote_request by email
 */
export async function getQuoteByClientEmail(
  email: string
): Promise<any | null> {
  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .select("*")
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Update portal fields on quote_requests
 */
export async function updateQuotePortal(
  id: string,
  input: {
    portal_enabled?: boolean;
    moodboard_note?: string;
  }
): Promise<any | null> {
  try {
    const { data, error } = await getSupabase()
      .from("quote_requests")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating quote portal:",
        error.message
      );
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}
