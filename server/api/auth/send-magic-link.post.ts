/**
 * POST /api/auth/send-magic-link
 * Admin — Send magic link invitation to client
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { generateMagicLink } from "~/server/utils/supabase";
import { sendMagicLinkEmail } from "~/server/utils/email";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);
  const { email, coupleName } = body as { email: string; coupleName?: string };

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  try {
    const siteUrl =
      process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const redirectTo = `${siteUrl}/fr/mon-projet`;

    const { link, error } = await generateMagicLink(
      email,
      redirectTo
    );

    if (error || !link) {
      throw createError({
        statusCode: 500,
        message: error || "Failed to generate magic link",
      });
    }

    // Send email with the magic link
    const name = coupleName || email.split("@")[0];
    const emailSent = await sendMagicLinkEmail(email, name, link);

    if (!emailSent) {
      console.error("Magic link generated but email failed to send");
    }

    return {
      success: true,
      emailSent,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error("Error sending magic link:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to send magic link",
    });
  }
});
