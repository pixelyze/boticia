/**
 * POST /api/auth/request-login
 * Public — Send a login link, but only to an address the site already knows.
 *
 * Replaces a direct signInWithOtp() from the browser, which created an
 * account for any address typed into the login form.
 *
 * The response is deliberately identical whether the address is known or
 * not : telling them apart would let anyone probe which addresses are
 * Boticia clients.
 */

import { getSupabase, generateMagicLink } from "~/server/utils/supabase";
import { getQuoteByClientEmail } from "~/server/utils/client-portal";
import { sendLoginLinkEmail } from "~/server/utils/email";
import { safeRedirectPath } from "~/utils/safeRedirect";

const LOCALES = ["fr", "en", "ja"];

/**
 * An address is known if it has an admin/client profile or a quote request.
 * Quote requests matter : a client who filled the form must be able to log
 * in on her own, without waiting for an invitation.
 */
async function isKnownEmail(email: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  if (data) return true;

  return (await getQuoteByClientEmail(email)) !== null;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, redirect, locale } = body as {
    email?: string;
    redirect?: string;
    locale?: string;
  };

  if (!email || typeof email !== "string") {
    throw createError({ statusCode: 400, message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const lang = LOCALES.includes(locale || "") ? locale : "fr";
  const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";

  const target = safeRedirectPath(redirect);
  const confirmUrl = `${baseUrl}/${lang}/confirm`;
  const redirectTo = target
    ? `${confirmUrl}?redirect=${encodeURIComponent(target)}`
    : confirmUrl;

  try {
    if (await isKnownEmail(normalizedEmail)) {
      const { link, error } = await generateMagicLink(
        normalizedEmail,
        redirectTo
      );

      if (link) {
        await sendLoginLinkEmail(normalizedEmail, link);
      } else {
        console.error("Login link generation failed:", error);
      }
    }
  } catch (err) {
    // Never surface the failure : the caller must not learn anything about
    // the address from the outcome.
    console.error("Error handling login request:", err);
  }

  return { success: true };
});
