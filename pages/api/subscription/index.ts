import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Product, ProductPrice, Role, Subscription } from '@prisma/client';
import prisma from '@lib/prisma';

export type UserSubscription = {
  subscription: (Subscription & {
    product: Product;
    price: ProductPrice;
  }) | undefined | null;
}

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

handler.get(async (
  req: NextApiRequestWithSession,
  res: NextApiResponse<UserSubscription>,
) => {
  const userId = req.session?.user.id;

  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: userId as string,
    },
    include: {
      product: true,
      price: true
    }
  });

  res.status(200).json({ subscription })
});


export default handler;
