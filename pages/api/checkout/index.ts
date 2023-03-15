// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import Stripe from 'stripe';
import { StripeService } from '@lib/payments/stripe/service';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Role } from '@prisma/client';

interface CheckoutApiRequest extends NextApiRequestWithSession {
  body: {
    priceId: string;
  }
}

export type CheckoutData = {
  session: Stripe.Checkout.Session
}

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer]));

handler.post(async (
  req: CheckoutApiRequest,
  res: NextApiResponse<CheckoutData>
) => {
  const user = req.session?.user;
  const { priceId } = req.body;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    client_reference_id: user?.id.toString() || undefined,
    customer_email: user?.email || undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ],
    subscription_data: {
      metadata: {
        userId: user?.id || null,
        email: user?.email || null,
      }
    },
    success_url: `${req.headers.origin}/pricing`,
    cancel_url: `${req.headers.origin}/pricing`,
  };

  const checkoutSession: Stripe.Checkout.Session = await StripeService
    .getInstance(process.env.STRIPE_SECRET_KEY as string)
    .checkout.sessions.create(params);

  res.status(200).json({ session: checkoutSession })
});

export default handler;