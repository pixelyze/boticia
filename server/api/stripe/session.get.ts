import Stripe from "stripe";

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY missing");
    }
    stripe = new Stripe(stripeSecretKey);
  }
  return stripe;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const sessionId = query.session_id as string;

    if (!sessionId) {
      throw createError({
        statusCode: 400,
        message: "session_id is required",
      });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    return {
      amount_total: session.amount_total,
      customer_email: session.customer_details?.email || session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);

    if (error instanceof Stripe.errors.StripeError) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message,
      });
    }

    throw createError({
      statusCode: 500,
      message: "Error retrieving session",
    });
  }
});
