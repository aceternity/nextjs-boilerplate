import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Product, ProductPrice, Role, Subscription } from '@prisma/client';
import prisma from '@lib/prisma';

export type OrganizationSubscription = {
  subscription: (Subscription & {
    product: Product;
    price: ProductPrice;
  }) | undefined | null;
  message?: string | undefined;
}

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

interface NextApiRequestWithId extends NextApiRequestWithSession {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
}

handler.get(async (
  req: NextApiRequestWithId,
  res: NextApiResponse<OrganizationSubscription>,
) => {
  const { id } = req.query;
  const userId = req.session?.user.id;

  const subscription = await prisma.subscription.findUnique({
    where: {
      organizationId: id,
    },
    include: {
      product: true,
      price: true,
    }
  });

  const authorizedUser = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: userId as string,
        organizationId: id,
      },
    },
  })

  if (!authorizedUser || authorizedUser.role !== 'org_admin') {
    res.status(400).json({ message: 'Bad request', subscription: null })
  }

  res.status(200).json({ subscription })
});


export default handler;
