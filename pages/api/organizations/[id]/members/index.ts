import type { NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { OrganizationRole, Prisma, Role } from '@prisma/client';
import { createPaginator, PaginatedNextApiRequest, PaginatedResult } from '@lib/pagination';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';

export interface OrganizationMemberData {
  id: number;
  role: OrganizationRole;
  user: {
    name: string;
    email: string;
  }
}

export type OrganizationMembersData = PaginatedResult<OrganizationMemberData>;
const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

const paginate = createPaginator({ perPage: 20 });

interface NextApiRequestWithId extends NextApiRequestWithSession {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
}

handler.get(async (
  req: NextApiRequestWithId & PaginatedNextApiRequest & NextApiRequestWithSession,
  res: NextApiResponse<OrganizationMembersData>
) => {
  const { query } = req;
  const { page, id } = query;
  const result = await paginate<OrganizationMemberData, Prisma.OrganizationMemberFindManyArgs>(
    prisma.organizationMember,
    {
      where: {
        organizationId: id,
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
      }
    },
    { page: page }
  );
  res.status(200).json(result);
});

export default handler;
