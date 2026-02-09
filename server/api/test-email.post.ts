import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY missing");
    }
    resend = new Resend(resendApiKey);
  }
  return resend;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const testEmail = body?.email;

    if (!testEmail) {
      throw createError({
        statusCode: 400,
        message: "Email is required",
      });
    }

    // Use your verified domain in production
    const fromEmail = "My App <noreply@yourdomain.com>";

    const result = await getResend().emails.send({
      from: fromEmail,
      to: [testEmail],
      subject: "Test email - My App",
      html: `
        <h1>Test email</h1>
        <p>If you received this email, Resend is working correctly.</p>
        <p>Date: ${new Date().toISOString()}</p>
      `,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      emailId: result.data?.id,
      message: "Test email sent successfully",
    };
  } catch (error) {
    console.error("Error sending test email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
