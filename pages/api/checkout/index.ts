import type { NextApiResponse } from 'next'
import Stripe from 'stripe';
import { StripeService } from '@lib/payments/stripe/service';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Role } from '@prisma/client';
import prisma from '@lib/prisma';
import { OrganizationFormValues } from '@components/forms/OrganizationForm/OrganizationForm';

export type CheckoutBody = {
  priceId: string | undefined;
  organization: OrganizationFormValues | undefined;
}

interface CheckoutApiRequest extends NextApiRequestWithSession {
  body: CheckoutBody;
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
  const { priceId, organization } = req.body;

  const currentUser = await prisma.user.findUnique({
    where: { id: user?.id as string }
  })

  let createdOrganization = null;
  if (organization) {
    createdOrganization = await prisma.organization.create({ 
      data: {
        name: organization?.name,
        status: 'inactive'
      }
    });
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    client_reference_id: user?.id.toString() || undefined,
    customer_email: currentUser?.stripeCustomerId ? undefined : user?.email as string,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ],
    customer: currentUser?.stripeCustomerId || undefined,
    subscription_data: {
      metadata: {
        userId: user?.id || null,
        email: user?.email || null,
        organizationId: createdOrganization ? createdOrganization.id : null
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