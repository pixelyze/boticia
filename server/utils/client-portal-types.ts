/**
 * Types TypeScript pour le portail client (couples)
 */

// ========================================
// ENUMS & CONSTANTS
// ========================================

export type MoodboardItemType = "image" | "pdf" | "link";

export type ProposalStatus =
  | "draft"
  | "pending"
  | "viewed"
  | "accepted"
  | "revision_requested";

// ========================================
// CLIENT INSPIRATION
// ========================================

export interface ClientInspiration {
  id: string;
  quote_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInspirationInput {
  quote_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  caption?: string;
  uploaded_by?: string;
}

// ========================================
// MOODBOARD ITEM
// ========================================

export interface MoodboardItem {
  id: string;
  quote_id: string;
  item_type: MoodboardItemType;
  filename?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  storage_path?: string;
  public_url?: string;
  external_url?: string;
  title?: string;
  description?: string;
  sort_order: number;
  uploaded_by?: string;
  /** Date d'envoi de sa version. Absent = en préparation. */
  sent_at?: string | null;
  /** Version du moodboard dont fait partie l'élément (1, 2…). */
  version?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMoodboardItemInput {
  quote_id: string;
  item_type: MoodboardItemType;
  filename?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  storage_path?: string;
  public_url?: string;
  external_url?: string;
  title?: string;
  description?: string;
  sort_order?: number;
  uploaded_by?: string;
}

// ========================================
// PROJECT PROPOSAL
// ========================================

export interface ProjectProposal {
  id: string;
  quote_id: string;
  title: string;
  description?: string;
  total_amount_cents?: number;
  filename?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  storage_path?: string;
  public_url?: string;
  status: ProposalStatus;
  viewed_at?: string;
  responded_at?: string;
  client_comment?: string;
  created_by?: string;
  /** Date d'envoi à la cliente. Absent = brouillon en préparation. */
  sent_at?: string | null;
  /** Numéro de version, attribué à l'envoi (1, 2…). */
  version?: number | null;
  /** Date d'envoi de la version suivante. Absent = version en cours. */
  superseded_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProposalInput {
  quote_id: string;
  title: string;
  description?: string;
  total_amount_cents?: number;
  filename?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  storage_path?: string;
  public_url?: string;
  status?: ProposalStatus;
  created_by?: string;
}

export interface UpdateProposalInput {
  title?: string;
  description?: string;
  total_amount_cents?: number;
  filename?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  storage_path?: string;
  public_url?: string;
  status?: ProposalStatus;
  viewed_at?: string;
  responded_at?: string;
  client_comment?: string;
  sent_at?: string;
  version?: number;
  superseded_at?: string;
}
