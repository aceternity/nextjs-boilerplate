import type { NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { Prisma, Product, ProductPrice, Role, User } from '@prisma/client';
import { createPaginator, PaginatedNextApiRequest, PaginatedResult } from '@lib/pagination';

export interface ProductData {
  id: string;
  name: string;
  active: boolean;
}

export type ProductsData = PaginatedResult<ProductData>;

const paginate = createPaginator({ perPage: 20 });

export default async function handler(
  req: PaginatedNextApiRequest,
  res: NextApiResponse<ProductsData>
) {
  const { query } = req;
  const { page } = query;
  const result = await paginate<ProductData, Prisma.ProductFindManyArgs>(
    prisma.product,
    {
      select: {
        id: true,
        name: true,
        active: true,
      }
    },
    { page: page }
  );
  res.status(200).json(result);
}
