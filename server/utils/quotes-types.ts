/**
 * Types TypeScript pour les demandes de devis mariage
 */

// ========================================
// ENUMS & CONSTANTS
// ========================================

export type QuoteRequestStatus =
  | "new"
  | "contacted"
  | "quote_sent"
  | "signed"
  | "completed"
  | "cancelled";

export type BudgetRange =
  | "lt_2500"
  | "lt_4000"
  | "lt_10000";

export type FloralNeedKey =
  | "bridal_bouquet"
  | "bridesmaid_bouquet"
  | "boutonnieres"
  | "ceremony_arch"
  | "ceremony_aisle"
  | "table_centerpieces"
  | "table_runner"
  | "welcome_sign"
  | "cocktail_decor"
  | "cake_flowers"
  | "hair_flowers"
  | "venue_entrance";

// ========================================
// QUOTE REQUEST
// ========================================

export interface QuoteRequest {
  id: string;
  partner1_name: string;
  partner2_name?: string;
  email: string;
  phone?: string;
  wedding_date?: string;
  venue?: string;
  budget?: BudgetRange;
  floral_needs: FloralNeedKey[];
  meeting_date?: string;
  meeting_time?: string;
  status: QuoteRequestStatus;
  admin_notes?: string;
  portal_enabled: boolean;
  moodboard_note?: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQuoteRequestInput {
  partner1_name: string;
  partner2_name?: string;
  email: string;
  phone?: string;
  wedding_date?: string;
  venue?: string;
  budget?: BudgetRange;
  floral_needs: FloralNeedKey[];
  meeting_date?: string;
  meeting_time?: string;
  locale?: string;
}

export interface UpdateQuoteRequestInput {
  status?: QuoteRequestStatus;
  admin_notes?: string;
  portal_enabled?: boolean;
  moodboard_note?: string;
}
