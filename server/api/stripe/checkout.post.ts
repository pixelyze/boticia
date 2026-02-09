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
    const body = await readBody(event);
    const { email, name, priceId, metadata } = body;

    if (!email) {
      throw createError({
        statusCode: 400,
        message: "Email is required",
      });
    }

    const config = useRuntimeConfig();

    // Create Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId, // Use a Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.public.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.siteUrl}/`,
      metadata: {
        customer_name: name || "",
        customer_email: email,
        ...metadata,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    throw createError({
      statusCode: 500,
      message: "Error creating checkout session",
    });
  }
});
