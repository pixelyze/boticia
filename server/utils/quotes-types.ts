/**
 * Types TypeScript pour les demandes de devis
 */

// ========================================
// ENUMS & CONSTANTS
// ========================================

export type ServiceType = "mariage" | "evenement" | "atelier";

export type QuoteRequestStatus =
  | "new"
  | "contacted"
  | "moodboard_sent"
  | "quote_sent"
  | "signed"
  | "completed"
  | "cancelled";

/**
 * ATTENTION : ces clés ne correspondent plus aux montants qu'elles nomment.
 *
 * Les tranches ont été relevées (commit a75759b) sans renommer les clés,
 * qui sont stockées telles quelles en base. La correspondance réelle est :
 *
 *   lt_2500   ->  3 000 – 5 000 €
 *   lt_4000   ->  5 000 – 8 000 €
 *   lt_10000  ->  8 000 € et plus
 *
 * L'affichage est correct partout, car il passe par les libellés i18n
 * (`quote_form.budget_<clé>`). Le piège ne concerne que la lecture directe
 * de la base : un export ou une requête SQL sur `budget` induit en erreur.
 *
 * Au prochain changement de tarif, renommer en clés neutres (budget_1,
 * budget_2, budget_3) — migration SQL + type + 3 locales + le badge de
 * `pages/dashboard/quotes/index.vue`, à déployer d'un seul tenant.
 */
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

export type EventNeedKey =
  | "scenographie"
  | "corner_floral"
  | "suspended_installations"
  | "stage_decor"
  | "table_decor"
  | "welcome_compositions";

export type WorkshopTypeKey =
  | "bouquet_composition"
  | "wreath"
  | "terrarium"
  | "seasonal";

// ========================================
// QUOTE REQUEST
// ========================================

export interface QuoteRequest {
  id: string;
  service_type: ServiceType;
  partner1_name: string;
  partner2_name?: string;
  email: string;
  phone: string;
  wedding_date?: string;
  venue?: string;
  budget?: BudgetRange;
  floral_needs: FloralNeedKey[];
  event_type?: string;
  guest_count?: number;
  workshop_type?: string;
  meeting_date?: string;
  meeting_time?: string;
  status: QuoteRequestStatus;
  admin_notes?: string;
  portal_enabled: boolean;
  moodboard_note?: string;
  locale: string;
  kanban_position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateQuoteRequestInput {
  service_type: ServiceType;
  partner1_name: string;
  partner2_name?: string;
  email: string;
  phone: string;
  wedding_date?: string;
  venue?: string;
  budget?: BudgetRange;
  floral_needs: (FloralNeedKey | EventNeedKey)[];
  event_type?: string;
  guest_count?: number;
  workshop_type?: string;
  meeting_date: string;
  meeting_time: string;
  locale?: string;
}

export interface UpdateQuoteRequestInput {
  status?: QuoteRequestStatus;
  admin_notes?: string;
  portal_enabled?: boolean;
  moodboard_note?: string;
  meeting_date?: string;
  meeting_time?: string;
  kanban_position?: number;
}

// ========================================
// ACTIVITY LOG
// ========================================

export type QuoteActivityAction =
  | "status_changed"
  | "note_updated"
  | "meeting_scheduled"
  | "portal_toggled"
  | "moodboard_added"
  | "proposal_created"
  | "note_added";

export interface QuoteActivityLog {
  id: string;
  quote_id: string;
  action: QuoteActivityAction;
  details: Record<string, any>;
  created_at: string;
}
