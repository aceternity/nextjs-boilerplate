// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe';
import { StripeService } from '@lib/payments/stripe/service';

interface CheckoutApiRequest extends NextApiRequest {
  body: {
    priceId: string;
  }
}

export type CheckoutData = {
  session: Stripe.Checkout.Session
}

export default async function handler(
  req: CheckoutApiRequest,
  res: NextApiResponse<CheckoutData>
) {
  const { priceId } = req.body;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ],
    success_url: `${req.headers.origin}/pricing`,
    cancel_url: `${req.headers.origin}/pricing`,
  };

  const checkoutSession: Stripe.Checkout.Session = await StripeService
    .getInstance(process.env.STRIPE_SECRET_KEY as string)
    .checkout.sessions.create(params);

  res.status(200).json({ session: checkoutSession })
}
