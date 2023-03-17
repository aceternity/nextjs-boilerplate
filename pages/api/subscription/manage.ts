import type { NextApiResponse } from 'next'
import Stripe from 'stripe';
import { StripeService } from '@lib/payments/stripe/service';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Role } from '@prisma/client';
import prisma from '@lib/prisma';

export type ManageBillingData = {
  url?: string;
  message?: string;
}

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer]));

handler.get(async (
  req: NextApiRequestWithSession,
  res: NextApiResponse<ManageBillingData>
) => {
  const user = req.session?.user;

  const currentUser = await prisma.user.findUnique({
    where: { id: user?.id as string },
  })

  if (currentUser?.stripeCustomerId) {
    const session = await StripeService.getInstance(process.env.STRIPE_SECRET_KEY as string).billingPortal.sessions.create({
       customer: currentUser?.stripeCustomerId,
       return_url: process.env.NEXTAUTH_URL + '/account/billing',
     });
    return res.status(200).json({ url: session.url });
  }

  return res.status(400).json({ message: 'No billing associated this account' })
});

export default handler;