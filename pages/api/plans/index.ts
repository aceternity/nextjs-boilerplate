import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client';
import { SUBSCRIPTION_PLAN } from '@lib/payments/constants';

function sortPlansByUnitAmount(plans: Plan[]): Plan[] {
  return plans.sort((a, b) => {
    const priceA = a.prices.find((price) => price.active);
    const priceB = b.prices.find((price) => price.active);
    if (!priceA || !priceB) {
      return 0;
    }
    return priceA.unitAmount - priceB.unitAmount;
  });
}
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

export interface PlansApiRequest extends NextApiRequest {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { isOrganization?: boolean };
}

export default async function handler(
  req: PlansApiRequest,
  res: NextApiResponse<PlansData>
) {

  const { isOrganization } = req.query;

  const where: Prisma.ProductWhereInput = {
    active: true,
  };

  if (isOrganization) {
    where.uniqueIdentifier = SUBSCRIPTION_PLAN.TEAMS;
  }

  const plans: Plan[] = await prisma.product.findMany({
    where,
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
    },
  })
  res.status(200).json({ data: { plans: sortPlansByUnitAmount(plans) } })
}
