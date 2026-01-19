import type { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "./db.js";
import { registrations } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Webhook] Error processing event: ${error.message}`);
    res.status(500).send(`Webhook processing error: ${error.message}`);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const registrationId = session.metadata?.registrationId;

  if (!registrationId) {
    console.error("[Webhook] No registrationId in session metadata");
    return;
  }

  console.log(`[Webhook] Checkout completed for registration ${registrationId}`);

  // Update registration with payment information
  await db
    .update(registrations)
    .set({
      paymentStatus: "paid",
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    })
    .where(eq(registrations.id, parseInt(registrationId)));

  console.log(`[Webhook] Updated registration ${registrationId} to paid status`);

  // TODO: Send confirmation email to participant
  // This will be implemented in Phase 4
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Webhook] Payment succeeded: ${paymentIntent.id}`);

  // Find registration by payment intent ID
  const [registration] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.stripePaymentIntentId, paymentIntent.id));

  if (registration) {
    await db
      .update(registrations)
      .set({
        paymentStatus: "paid",
        paidAt: new Date(),
      })
      .where(eq(registrations.id, registration.id));

    console.log(`[Webhook] Confirmed payment for registration ${registration.id}`);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Webhook] Payment failed: ${paymentIntent.id}`);

  // Find registration by payment intent ID
  const [registration] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.stripePaymentIntentId, paymentIntent.id));

  if (registration) {
    await db
      .update(registrations)
      .set({
        paymentStatus: "unpaid",
      })
      .where(eq(registrations.id, registration.id));

    console.log(`[Webhook] Marked registration ${registration.id} as unpaid due to payment failure`);
  }
}
