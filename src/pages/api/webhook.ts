import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

import { stripeEvents } from "~/server/db/schema";
import { stripe } from "../../server/stripe/client";
import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
} from "../../server/stripe/stripe-webhook-handlers";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
      // Handle the event
      switch (event.type) {
        case "invoice.paid":
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
          await handleInvoicePaid({
            event,
            stripe,
            db,
          });
          break;
        case "customer.subscription.created":
          // Used to provision services as they are added to a subscription.
          await handleSubscriptionCreatedOrUpdated({
            event,
            db,
          });
          break;
        case "customer.subscription.updated":
          // Used to provision services as they are updated.
          await handleSubscriptionCreatedOrUpdated({
            event,
            db,
          });
          break;
        case "invoice.payment_failed":
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic
          break;
        case "customer.subscription.deleted":
          // handle subscription cancelled automatically based
          // upon your subscription settings.
          await handleSubscriptionCanceled({
            event,
            db,
          });
          break;
        default:
        // Unexpected event type
      }

      // record the event in the database
      await db.insert(stripeEvents).values({
        ...event,
        created: new Date(event.created * 1000),
      });

      res.json({ received: true });
    } catch (err) {
      res.status(400).send(err);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
