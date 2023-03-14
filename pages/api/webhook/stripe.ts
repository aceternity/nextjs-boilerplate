import StripeWebhook from '@lib/payments/stripe/webhook';
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

export default async function handleStripeWebhook(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const stripeInstace = StripeWebhook.getInstance(process.env.STRIPE_SECRET_KEY as string);
  try {
    const event = stripeInstace.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    await stripeInstace.handleEvent(event);
    res.status(200).send('OK');
  } catch(e: any) {
    res.status(400).send(`Webhook Error: ${e?.message || e}`);
  }
}
