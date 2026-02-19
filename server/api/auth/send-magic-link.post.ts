/**
 * POST /api/auth/send-magic-link
 * Admin — Send magic link invitation to client
 */

import { requireAdmin } from "~/server/utils/serverAuth";
import { generateMagicLink } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);
  const { email } = body as { email: string };

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  try {
    const siteUrl =
      process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectTo = `${siteUrl}/confirm`;

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

    // TODO: Send email via Resend with the magic link
    // For now, the magic link is generated and logged
    console.log(
      `Magic link for ${email}: ${link}`
    );

    return {
      success: true,
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
