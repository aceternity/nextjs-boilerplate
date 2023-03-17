import type { NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { Prisma, Role, User } from '@prisma/client';
import { createPaginator, PaginatedNextApiRequest, PaginatedResult } from '@lib/pagination';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';

export interface UserData {
  id: number;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
}

export type UsersData = PaginatedResult<UserData>;
const handler = nextConnect();
handler.use(AuthMiddleWare([Role.superadmin]));

const paginate = createPaginator({ perPage: 20 });

handler.get(async (
  req: PaginatedNextApiRequest & NextApiRequestWithSession,
  res: NextApiResponse<UsersData>
) => {
  const { query } = req;
  const { page } = query;
  const result = await paginate<UserData, Prisma.UserFindManyArgs>(
    prisma.user,
    {
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
      }
    },
    { page: page }
  );
  res.status(200).json(result);
});

export default handler;
