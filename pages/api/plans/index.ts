import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'

export interface Price {
  active: boolean;
  priceId: string;
  currency: string;
  type: string;
  unitAmount: number;
  interval: string | null;
  interval_count: number | null;
}

export interface Plan {
  active: boolean;
  productId: string;
  name: string;
  defaultPriceId: string | null;
  description: string | null;
  prices: Price[];
  uniqueIdentifier: string;
}

export type PlansData = {
  data: {
    plans: Plan[];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlansData>
) {
  const plans: Plan[] = await prisma.product.findMany({
    where: {
      active: true,
    },
    select: {
      productId: true,
      name: true,
      active: true,
      defaultPriceId: true,
      description: true,
      uniqueIdentifier: true,
      prices: {
        where: {
          active: true,
        },
        select: {
          priceId: true,
          active: true,
          currency: true,
          interval: true,
          interval_count: true,
          type: true,
          unitAmount: true,
        }
      }
    }
  })
  res.status(200).json({ data: { plans: plans } })
}
