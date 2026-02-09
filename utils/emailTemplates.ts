/**
 * Email template utilities
 * After compiling MJML templates, use these helpers to render emails.
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
}

// Available email templates
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to My App!',
    category: 'onboarding',
  },
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    subject: 'Your order has been confirmed',
    category: 'transactional',
  },
];

/**
 * Get templates by category
 */
export function getEmailsByCategory(category: string): EmailTemplate[] {
  return emailTemplates.filter(t => t.category === category);
}

/**
 * Get a template by ID
 */
export function getEmailById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(t => t.id === id);
}
