/**
 * Email utility — sends via SMTP (Inbucket) in dev, Resend in production
 */

import { Resend } from "resend";
import { createTransport } from "nodemailer";
import { renderWelcome } from "~/server/emails/compiled";

const LOGO_URL = process.env.NUXT_PUBLIC_SITE_URL
  ? `${process.env.NUXT_PUBLIC_SITE_URL}/logo-boticia.png`
  : "http://localhost:3001/logo-boticia.png";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY missing");
    resend = new Resend(key);
  }
  return resend;
}

const FROM_EMAIL = "Boticia <noreply@boticia.fr>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmailDev(opts: SendEmailOptions): Promise<boolean> {
  try {
    const transport = createTransport({
      host: "127.0.0.1",
      port: 54325,
      secure: false,
      tls: { rejectUnauthorized: false },
    });
    await transport.sendMail({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    console.log(`[EMAIL] Sent to Mailpit: ${opts.to} | ${opts.subject}`);
    return true;
  } catch (err) {
    console.error("[EMAIL] Dev SMTP failed:", err);
    return false;
  }
}

async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  const hasResendKey = !!process.env.RESEND_API_KEY;

  if (!hasResendKey) {
    return sendEmailDev(opts);
  }

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    });
    if (result.error) {
      console.error("[EMAIL] Resend error:", result.error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[EMAIL] Send failed:", err);
    return false;
  }
}

/**
 * Notify client that moodboard is available
 */
export async function sendMoodboardNotification(
  clientEmail: string,
  coupleName: string,
  portalUrl: string
): Promise<boolean> {
  const html = renderWelcome({
    logoUrl: LOGO_URL,
    title: "Votre moodboard est prêt !",
    greeting: `Bonjour ${coupleName},`,
    message:
      "Votre moodboard floral est maintenant disponible dans votre espace client. " +
      "Ce livre floral a été conçu pour vous aider à mieux visualiser le résultat final de votre composition florale.",
    ctaText: "Voir mon moodboard",
    ctaUrl: portalUrl,
    footerText: "Boticia — Atelier de design floral",
  });

  return sendEmail({
    to: clientEmail,
    subject: "Votre moodboard floral est prêt — Boticia",
    html,
  });
}

/**
 * Notify client that quote/proposal is available
 */
export async function sendProposalNotification(
  clientEmail: string,
  coupleName: string,
  portalUrl: string
): Promise<boolean> {
  const html = renderWelcome({
    logoUrl: LOGO_URL,
    title: "Votre devis floral est disponible",
    greeting: `Bonjour ${coupleName},`,
    message:
      "Votre devis floral personnalisé est maintenant disponible dans votre espace client. " +
      "Prenez le temps de le consulter et n'hésitez pas à nous contacter pour toute question.",
    ctaText: "Consulter mon devis",
    ctaUrl: portalUrl,
    footerText: "Boticia — Atelier de design floral",
  });

  return sendEmail({
    to: clientEmail,
    subject: "Votre devis floral est disponible — Boticia",
    html,
  });
}

const ADMIN_EMAIL = "laetitia@boticia.fr";
const DEV_EMAIL = "brutalstudio.click@gmail.com";

/**
 * Notify admin of a new quote request
 */
export async function sendNewQuoteNotification(data: {
  coupleName: string;
  email: string;
  phone: string;
  serviceType: string;
  weddingDate?: string;
  meetingDate?: string;
  meetingTime?: string;
  dashboardUrl: string;
}): Promise<boolean> {
  const serviceLabels: Record<string, string> = {
    mariage: "Mariage",
    evenement: "Événement",
    atelier: "Atelier",
  };
  const service = serviceLabels[data.serviceType] || data.serviceType;

  let details = `<strong>Type :</strong> ${service}<br/>`;
  details += `<strong>Contact :</strong> ${data.email} — ${data.phone}<br/>`;
  if (data.weddingDate) {
    details += `<strong>Date :</strong> ${data.weddingDate}<br/>`;
  }
  if (data.meetingDate) {
    details += `<strong>RDV souhaité :</strong> ${data.meetingDate}${data.meetingTime ? ` à ${data.meetingTime}` : ""}<br/>`;
  }

  const html = renderWelcome({
    logoUrl: LOGO_URL,
    title: "Nouvelle demande de devis",
    greeting: `Bonjour Laetitia,`,
    message:
      `Vous avez reçu une nouvelle demande de <strong>${data.coupleName}</strong>.<br/><br/>` +
      details,
    ctaText: "Voir la demande",
    ctaUrl: data.dashboardUrl,
    footerText: "Boticia — Notification admin",
  });

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande de ${data.coupleName} — Boticia`,
    html,
  });
}

/**
 * Notify dev team of new feedback
 */
export async function sendFeedbackNotification(data: {
  type: string;
  message: string;
  userEmail: string;
}): Promise<boolean> {
  const typeLabels: Record<string, string> = {
    bug: "Bug",
    suggestion: "Suggestion",
    question: "Question",
  };
  const typeLabel = typeLabels[data.type] || data.type;
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = renderWelcome({
    logoUrl: LOGO_URL,
    title: `Feedback — ${typeLabel}`,
    greeting: "Nouveau feedback reçu",
    message:
      `<strong>Type :</strong> ${typeLabel}<br/>` +
      `<strong>De :</strong> ${data.userEmail}<br/>` +
      `<strong>Date :</strong> ${date}<br/><br/>` +
      `<strong>Message :</strong><br/>${data.message.replace(/\n/g, "<br/>")}`,
    ctaText: "Voir le dashboard",
    ctaUrl: process.env.NUXT_PUBLIC_SITE_URL
      ? `${process.env.NUXT_PUBLIC_SITE_URL}/fr/dashboard`
      : "http://localhost:3001/fr/dashboard",
    footerText: "Boticia — Notification feedback",
  });

  return sendEmail({
    to: DEV_EMAIL,
    subject: `[Boticia Feedback] ${typeLabel} — de ${data.userEmail}`,
    html,
  });
}

/**
 * Notify dev team of new chat message from admin
 */
export async function sendChatNotification(data: {
  senderName: string;
  message: string;
  chatUrl: string;
}): Promise<boolean> {
  const html = renderWelcome({
    logoUrl: LOGO_URL,
    title: "Nouveau message",
    greeting: `${data.senderName} vous a écrit :`,
    message: `<em>"${data.message.replace(/\n/g, "<br/>")}"</em>`,
    ctaText: "Répondre dans le chat",
    ctaUrl: data.chatUrl,
    footerText: "Boticia — Chat support",
  });

  return sendEmail({
    to: DEV_EMAIL,
    subject: `[Boticia Chat] Message de ${data.senderName}`,
    html,
  });
}

/**
 * Send magic link invitation to client
 */
export async function sendMagicLinkEmail(
  clientEmail: string,
  coupleName: string,
  magicLink: string
): Promise<boolean> {
  const html = renderWelcome({
    logoUrl: LOGO_URL,
    title: "Votre espace projet Boticia",
    greeting: `Bonjour ${coupleName},`,
    message:
      "Votre espace projet est maintenant disponible. " +
      "Vous y trouverez votre moodboard, vos propositions et le suivi de votre projet floral.<br/><br/>" +
      "Cliquez sur le bouton ci-dessous pour accéder à votre espace. Ce lien est personnel et sécurisé.",
    ctaText: "Accéder à mon espace",
    ctaUrl: magicLink,
    footerText: "Boticia — Espace client",
  });

  return sendEmail({
    to: clientEmail,
    subject: `Accédez à votre espace projet — Boticia`,
    html,
  });
}
