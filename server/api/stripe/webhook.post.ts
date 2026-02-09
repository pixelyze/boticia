import Stripe from "stripe";
import { Resend } from "resend";

let stripe: Stripe | null = null;
let resend: Resend | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY missing");
    stripe = new Stripe(key);
  }
  return stripe;
}

function getResend(): Resend {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY missing");
    resend = new Resend(key);
  }
  return resend;
}

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const signature = getHeader(event, "stripe-signature");
  const config = useRuntimeConfig();

  if (!body || !signature) {
    throw createError({ statusCode: 400, message: "Missing body or signature" });
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = getStripe().webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed");
    throw createError({ statusCode: 400, message: "Invalid signature" });
  }

  // Handle the event
  switch (stripeEvent.type) {
    case "checkout.session.completed": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log("Payment successful:", session.id);

      // TODO: Fulfill the order
      // - Save to database
      // - Send confirmation email
      // - Update user status

      break;
    }
    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return { received: true };
});
