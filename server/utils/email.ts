/**
 * Email utility — sends via SMTP (Inbucket) in dev, Resend in production
 */

import { Resend } from "resend";
import { createTransport } from "nodemailer";
import { renderWelcome } from "~/server/emails/compiled";
import type { WelcomeData } from "~/server/emails/compiled";
import { getConfigByKey } from "~/server/utils/cms";

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3020";
const DEFAULT_LOGO_URL = `${SITE_URL}/logo-boticia.png`;

/**
 * The logo chosen in Personnalisation, as an absolute URL (mail clients
 * can't resolve relative paths). Falls back to the default logo.
 */
async function getEmailLogoUrl(): Promise<string> {
  const config = await getConfigByKey("site_logo");
  const url = (config?.value as { url?: string } | null)?.url;
  if (!url) return DEFAULT_LOGO_URL;
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return DEFAULT_LOGO_URL;
}

/**
 * Shared client email layout, with the site logo, an optional note and an
 * optional button (left out when there is no ctaText).
 */
async function renderClientEmail(
  data: Omit<WelcomeData, "logoUrl" | "note" | "ctaText" | "ctaUrl"> & {
    note?: string;
    ctaText?: string;
    ctaUrl?: string;
  }
): Promise<string> {
  const html = renderWelcome({
    ...data,
    logoUrl: await getEmailLogoUrl(),
    note: data.note ?? "",
    ctaText: data.ctaText ?? "",
    ctaUrl: data.ctaUrl ?? "",
  });
  return data.ctaText
    ? html
    : html.replace(/<!-- cta-start -->[\s\S]*?<!-- cta-end -->/, "");
}

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

// ── Emails clientes : dans la langue du formulaire (fr, en, ja) ────────
type ClientLocale = "fr" | "en" | "ja";

const clientLocale = (locale?: string): ClientLocale =>
  locale === "en" || locale === "ja" ? locale : "fr";

const CLIENT_EMAIL = {
  fr: {
    greeting: (name: string) => `Bonjour ${name},`,
    footer: "À très bientôt,<br/>Laëtitia — Boticia",
    moodboard: {
      subject: "Votre moodboard floral est prêt — Boticia",
      title: "Votre moodboard est prêt !",
      message:
        "Votre moodboard floral est maintenant disponible dans votre espace client. " +
        "Ce livre floral a été conçu pour vous aider à mieux visualiser le résultat final de votre composition florale.",
      cta: "Voir mon moodboard",
    },
    proposal: {
      subject: "Votre devis floral est disponible — Boticia",
      title: "Votre devis floral est disponible",
      message:
        "Votre devis floral personnalisé est maintenant disponible dans votre espace client. " +
        "Prenez le temps de le consulter et n'hésitez pas à nous contacter pour toute question.",
      cta: "Consulter mon devis",
    },
    confirmation: {
      subject: "Votre demande de devis est bien reçue — Boticia",
      title: "Votre demande est bien reçue",
      services: { mariage: "mariage", evenement: "événement", atelier: "atelier" } as Record<string, string>,
      thanks: (service: string) =>
        `Merci pour votre demande de devis pour votre ${service}.`,
      meeting: (when: string) =>
        `Votre appel découverte est prévu le <strong>${when}</strong>. ` +
        "Laëtitia vous appellera à l'heure convenue.",
      at: (date: string, time: string) => `${date} à ${time}`,
      portal:
        "Votre espace client est déjà ouvert : vous pouvez y ajouter vos " +
        "photos d'inspiration à tout moment, puis y retrouver votre " +
        "moodboard et votre devis.",
      expiry: (url: string) =>
        "Le bouton ci-dessus vous connecte directement pendant une heure. " +
        `Ensuite, vous pourrez vous connecter à tout moment depuis ${url} ` +
        "avec cette adresse email.",
      cta: "Accéder à mon espace",
      dateLocale: "fr-FR",
    },
    invite: {
      subject: "Accédez à votre espace projet — Boticia",
      title: "Votre espace projet Boticia",
      message:
        "Votre espace projet est maintenant disponible. " +
        "Vous y trouverez votre moodboard, vos propositions et le suivi de votre projet floral.<br/><br/>" +
        "Cliquez sur le bouton ci-dessous pour accéder à votre espace. Ce lien est personnel et sécurisé.",
      cta: "Accéder à mon espace",
      footer: "À très bientôt,<br/>Laëtitia — Boticia",
    },
    login: {
      subject: "Votre code de connexion — Boticia",
      title: "Votre code de connexion",
      greeting: "Bonjour,",
      message:
        "Votre espace Boticia vous attend : votre projet floral, vos " +
        "inspirations et vos échanges avec Laëtitia, tout est réuni au même " +
        "endroit.",
      codeLabel: "Saisissez ce code sur la page de connexion :",
      footer: "Au plaisir de vous retrouver très vite,<br/>Laëtitia — Boticia",
      note:
        "Ce code reste valable 1 heure. Passé ce délai, demandez-en un " +
        "nouveau en un clic depuis la page de connexion.<br/><br/>" +
        "Vous n'avez rien demandé ? Rien à faire, vous pouvez simplement " +
        "ignorer ce message.",
    },
    loginAdmin: {
      title: "Votre code de connexion",
      greeting: "Bonjour Laëtitia,",
      message:
        "Votre tableau de bord Boticia vous attend : demandes de devis, " +
        "clientes, moodboards et galeries, tout est prêt.",
    },
  },
  en: {
    greeting: (name: string) => `Hello ${name},`,
    footer: "See you very soon,<br/>Laëtitia — Boticia",
    moodboard: {
      subject: "Your floral moodboard is ready — Boticia",
      title: "Your moodboard is ready!",
      message:
        "Your floral moodboard is now available in your client space. " +
        "This floral book was designed to help you picture the final result of your floral design.",
      cta: "See my moodboard",
    },
    proposal: {
      subject: "Your floral quote is available — Boticia",
      title: "Your floral quote is available",
      message:
        "Your personalised floral quote is now available in your client space. " +
        "Take your time to read it, and feel free to get in touch with any question.",
      cta: "View my quote",
    },
    confirmation: {
      subject: "We've received your quote request — Boticia",
      title: "Your request has been received",
      services: { mariage: "wedding", evenement: "event", atelier: "workshop" } as Record<string, string>,
      thanks: (service: string) =>
        `Thank you for your quote request for your ${service}.`,
      meeting: (when: string) =>
        `Your discovery call is scheduled for <strong>${when}</strong> (Paris time). ` +
        "Laëtitia will call you at the agreed time.",
      at: (date: string, time: string) => `${date} at ${time}`,
      portal:
        "Your client space is already open: you can add your inspiration " +
        "photos at any time, and later find your moodboard and your quote there.",
      expiry: (url: string) =>
        "The button above signs you in directly for one hour. " +
        `After that, you can sign in at any time from ${url} ` +
        "with this email address.",
      cta: "Go to my client space",
      dateLocale: "en-GB",
    },
    invite: {
      subject: "Access your project space — Boticia",
      title: "Your Boticia project space",
      message:
        "Your project space is now available. " +
        "You'll find your moodboard, your proposals and the progress of your floral project there.<br/><br/>" +
        "Click the button below to access your space. This link is personal and secure.",
      cta: "Go to my space",
      footer: "See you very soon,<br/>Laëtitia — Boticia",
    },
    login: {
      subject: "Your sign-in code — Boticia",
      title: "Your sign-in code",
      greeting: "Hello,",
      message:
        "Your Boticia space is waiting for you: your floral project, your " +
        "inspirations and your exchanges with Laëtitia, all in one place.",
      codeLabel: "Enter this code on the sign-in page:",
      footer: "Looking forward to seeing you soon,<br/>Laëtitia — Boticia",
      note:
        "This code stays valid for 1 hour. After that, request a new one " +
        "in one click from the sign-in page.<br/><br/>" +
        "Didn't ask for anything? No need to do anything, you can simply " +
        "ignore this message.",
    },
    loginAdmin: {
      title: "Your sign-in code",
      greeting: "Hello Laëtitia,",
      message:
        "Your Boticia dashboard is waiting for you: quote requests, " +
        "clients, moodboards and galleries, everything is ready.",
    },
  },
  ja: {
    greeting: (name: string) => `${name} 様`,
    footer: "近いうちにお会いできるのを楽しみにしております。<br/>Laëtitia — Boticia",
    moodboard: {
      subject: "フラワームードボードのご用意ができました — Boticia",
      title: "ムードボードのご用意ができました",
      message:
        "フラワームードボードをマイページでご覧いただけるようになりました。" +
        "仕上がりのイメージをつかんでいただけるようにお作りしたフラワーブックです。",
      cta: "ムードボードを見る",
    },
    proposal: {
      subject: "お見積書をご用意しました — Boticia",
      title: "お見積書をご用意しました",
      message:
        "お客様専用のお見積書をマイページでご覧いただけるようになりました。" +
        "ご不明な点がございましたら、お気軽にお問い合わせください。",
      cta: "お見積書を見る",
    },
    confirmation: {
      subject: "お見積りのご依頼を承りました — Boticia",
      title: "ご依頼を承りました",
      services: { mariage: "ウェディング", evenement: "イベント", atelier: "ワークショップ" } as Record<string, string>,
      thanks: (service: string) =>
        `${service}のお見積りのご依頼をいただき、ありがとうございます。`,
      meeting: (when: string) =>
        `ヒアリング通話は<strong>${when}</strong>（パリ時間）を予定しております。` +
        "ご指定の時間にLaëtitiaよりお電話いたします。",
      at: (date: string, time: string) => `${date} ${time}`,
      portal:
        "マイページはすでにご利用いただけます。インスピレーション写真をいつでも追加でき、" +
        "のちほどムードボードやお見積書もご確認いただけます。",
      expiry: (url: string) =>
        "上のボタンから1時間のあいだ直接ログインできます。" +
        `それ以降も ${url} からこのメールアドレスでいつでもログインいただけます。`,
      cta: "マイページへ",
      dateLocale: "ja-JP",
    },
    invite: {
      subject: "プロジェクトページのご案内 — Boticia",
      title: "Boticia プロジェクトページ",
      message:
        "プロジェクトページをご利用いただけるようになりました。" +
        "ムードボードやご提案、フラワープロジェクトの進行状況をご確認いただけます。<br/><br/>" +
        "下のボタンからアクセスしてください。このリンクはお客様専用です。",
      cta: "マイページへ",
      footer: "近いうちにお会いできるのを楽しみにしております。<br/>Laëtitia — Boticia",
    },
    login: {
      subject: "ログインコード — Boticia",
      title: "ログインコード",
      greeting: "こんにちは。",
      message:
        "Boticia マイページでお待ちしております。フラワープロジェクト、" +
        "インスピレーション、Laëtitiaとのやりとりをすべて一か所でご確認いただけます。",
      codeLabel: "ログインページで次のコードをご入力ください：",
      footer: "またお会いできるのを楽しみにしております。<br/>Laëtitia — Boticia",
      note:
        "このコードは1時間有効です。期限が過ぎた場合は、ログインページから" +
        "ワンクリックで新しいコードをお受け取りいただけます。<br/><br/>" +
        "お心当たりのない場合は、何もせずにこのメッセージを破棄してください。",
    },
    loginAdmin: {
      title: "ログインコード",
      greeting: "Laëtitia 様",
      message:
        "Boticia ダッシュボードの準備ができています。お見積りのご依頼、" +
        "お客様、ムードボード、ギャラリーをご確認いただけます。",
    },
  },
};

/**
 * Notify client that moodboard is available
 */
export async function sendMoodboardNotification(
  clientEmail: string,
  coupleName: string,
  portalUrl: string,
  locale?: string
): Promise<boolean> {
  const tx = CLIENT_EMAIL[clientLocale(locale)];
  const html = await renderClientEmail({
    title: tx.moodboard.title,
    greeting: tx.greeting(escapeHtml(coupleName)),
    message: tx.moodboard.message,
    ctaText: tx.moodboard.cta,
    ctaUrl: portalUrl,
    footerText: tx.footer,
  });

  return sendEmail({
    to: clientEmail,
    subject: tx.moodboard.subject,
    html,
  });
}

/**
 * Notify client that quote/proposal is available
 */
export async function sendProposalNotification(
  clientEmail: string,
  coupleName: string,
  portalUrl: string,
  locale?: string
): Promise<boolean> {
  const tx = CLIENT_EMAIL[clientLocale(locale)];
  const html = await renderClientEmail({
    title: tx.proposal.title,
    greeting: tx.greeting(escapeHtml(coupleName)),
    message: tx.proposal.message,
    ctaText: tx.proposal.cta,
    ctaUrl: portalUrl,
    footerText: tx.footer,
  });

  return sendEmail({
    to: clientEmail,
    subject: tx.proposal.subject,
    html,
  });
}

export const ADMIN_EMAIL = "laetitia@boticia.fr";
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

  const html = await renderClientEmail({
    title: "Nouvelle demande de devis",
    greeting: `Bonjour Laetitia,`,
    message:
      `Vous avez reçu une nouvelle demande de <strong>${escapeHtml(data.coupleName)}</strong>.<br/><br/>` +
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

/** Texte saisi par une cliente, inséré dans un email HTML. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Confirm a quote request to the client, with a direct link to her
 * client space (where she can add inspiration photos later on).
 */
export async function sendQuoteConfirmationEmail(data: {
  email: string;
  coupleName: string;
  serviceType: string;
  meetingDate?: string;
  meetingTime?: string;
  portalUrl: string;
  loginUrl: string;
  locale?: string;
}): Promise<boolean> {
  const tx = CLIENT_EMAIL[clientLocale(data.locale)];
  const c = tx.confirmation;
  const service = c.services[data.serviceType] || data.serviceType;

  let meeting = "";
  if (data.meetingDate) {
    const date = new Date(`${data.meetingDate}T12:00:00`).toLocaleDateString(
      c.dateLocale,
      { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    );
    const when = data.meetingTime
      ? c.at(date, escapeHtml(data.meetingTime))
      : date;
    meeting = `${c.meeting(when)}<br/><br/>`;
  }

  const html = await renderClientEmail({
    title: c.title,
    greeting: tx.greeting(escapeHtml(data.coupleName)),
    message:
      `${c.thanks(service)}<br/><br/>` +
      meeting +
      c.portal,
    note: c.expiry(data.loginUrl),
    ctaText: c.cta,
    ctaUrl: data.portalUrl,
    footerText: tx.footer,
  });

  return sendEmail({
    to: data.email,
    subject: c.subject,
    html,
  });
}

/**
 * Notify admin that a client asked for changes on her quote
 */
export async function sendRevisionRequestNotification(data: {
  coupleName: string;
  comment: string;
  dashboardUrl: string;
}): Promise<boolean> {
  const name = escapeHtml(data.coupleName);
  const comment = data.comment.trim()
    ? `<br/><br/><strong>Son message :</strong><br/>` +
      escapeHtml(data.comment.trim()).replace(/\n/g, "<br/>")
    : "";

  const html = await renderClientEmail({
    title: "Nouveau message sur un devis",
    greeting: `Bonjour Laëtitia,`,
    message:
      `<strong>${name}</strong> vous a écrit au sujet de son devis.` +
      comment,
    ctaText: "Voir la fiche",
    ctaUrl: data.dashboardUrl,
    footerText: "Boticia — Notification admin",
  });

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `${data.coupleName} vous a écrit au sujet de son devis — Boticia`,
    html,
  });
}

/**
 * Prévient Laëtitia qu'une cliente a validé son devis. Ton chaleureux :
 * c'est l'aboutissement de son travail sur la proposition.
 */
export async function sendProposalAcceptedNotification(data: {
  coupleName: string;
  version?: number | null;
  dashboardUrl: string;
}): Promise<boolean> {
  const name = escapeHtml(data.coupleName);
  const version = data.version && data.version > 1 ? ` (V${data.version})` : "";

  const html = await renderClientEmail({
    title: "Un devis vient d'être validé",
    greeting: "Bonjour Laëtitia,",
    message:
      `Belle nouvelle : le devis de <strong>${name}</strong>${version} ` +
      "vient d'être validé !<br/><br/>" +
      "Toute l'attention que vous avez mise dans cette proposition a fait " +
      "mouche. Ce projet floral peut maintenant prendre vie : place à la " +
      "création, aux fleurs et à tout ce que vous savez faire de plus beau.<br/><br/>" +
      "Bravo, et belle préparation !",
    ctaText: "Voir la fiche",
    ctaUrl: data.dashboardUrl,
    footerText: "Boticia — Notification admin",
  });

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Bonne nouvelle : le devis de ${data.coupleName} est validé — Boticia`,
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

  const html = await renderClientEmail({
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
  const html = await renderClientEmail({
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
  magicLink: string,
  locale?: string
): Promise<boolean> {
  const tx = CLIENT_EMAIL[clientLocale(locale)];
  const html = await renderClientEmail({
    title: tx.invite.title,
    greeting: tx.greeting(escapeHtml(coupleName)),
    message: tx.invite.message,
    ctaText: tx.invite.cta,
    ctaUrl: magicLink,
    footerText: tx.invite.footer,
  });

  return sendEmail({
    to: clientEmail,
    subject: tx.invite.subject,
    html,
  });
}

/**
 * The 6-digit code, large and spaced on a cream background (the site's
 * cream-light), so it reads at a glance on a phone. Digits only.
 */
function renderLoginCode(code: string): string {
  const digits = code.replace(/\D/g, "");
  return (
    '<div style="text-align:center;margin:20px 0 4px;">' +
    '<span style="display:inline-block;background:#f4f2ee;' +
    "border-radius:12px;padding:16px 20px 16px 28px;" +
    // Police sans empattement : les chiffres de Georgia descendent sous la
    // ligne (3, 5, 9…), illisible pour un code. Chiffres alignés et égaux.
    "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;" +
    "font-size:32px;font-weight:600;font-variant-numeric:lining-nums " +
    'tabular-nums;letter-spacing:8px;color:#1a1a1a;">' +
    `${digits}</span></div>`
  );
}

/**
 * Send a sign-in code, on demand from the login page.
 *
 * Clients and the admin get their own wording. It stays reassuring : no
 * security warning, the "not you?" line sits in the small note.
 */
export async function sendLoginLinkEmail(
  email: string,
  code: string,
  locale?: string,
  admin = false
): Promise<boolean> {
  const tx = CLIENT_EMAIL[clientLocale(locale)];
  const text = admin ? tx.loginAdmin : tx.login;
  const html = await renderClientEmail({
    title: text.title,
    greeting: text.greeting,
    // Le code seul, sans bouton ni lien : la connexion se fait en le
    // saisissant sur la page de connexion.
    message:
      `${text.message}<br/><br/>${tx.login.codeLabel}` +
      renderLoginCode(code),
    note: tx.login.note,
    // Signature chaleureuse pour les clientes ; Laëtitia ne reçoit pas un
    // mot signé de son propre nom.
    footerText: admin ? "Boticia" : tx.login.footer,
  });

  return sendEmail({
    to: email,
    subject: tx.login.subject,
    html,
  });
}
