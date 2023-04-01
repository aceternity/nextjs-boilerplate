import type { NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { OrganizationInvitationStatus, OrganizationRole, Prisma, Role } from '@prisma/client';
import { createPaginator, PaginatedNextApiRequest, PaginatedResult } from '@lib/pagination';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';

export interface OrganizationInvitationMemberData {
  id: string;
  role: OrganizationRole,
  email: string,
  status: OrganizationInvitationStatus,
  createdAt: true,
  updatedAt: true,
}

export type OrganizationInvitationsMembersData = PaginatedResult<OrganizationInvitationMemberData>;
const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

const paginate = createPaginator({ perPage: 20 });

interface NextApiRequestWithId extends NextApiRequestWithSession {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
}

handler.get(async (
  req: NextApiRequestWithId & PaginatedNextApiRequest & NextApiRequestWithSession,
  res: NextApiResponse<OrganizationInvitationsMembersData>
) => {
  const { query } = req;
  const { page, id } = query;
  const result = await paginate<OrganizationInvitationMemberData, Prisma.OrganizationMemberInvitationFindManyArgs>(
    prisma.organizationMemberInvitation,
    {
      where: {
        organizationId: id,
        status: {
          in: ['declined', 'pending']
        }
      },
      select: {
        id: true,
        role: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    },
    { page: page }
  );
  res.status(200).json(result);
});

export default handler;
