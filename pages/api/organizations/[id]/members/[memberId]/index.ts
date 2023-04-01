import type { NextApiResponse } from 'next'
import { OrganizationRole, Role } from '@prisma/client';
import { PaginatedNextApiRequest } from '@lib/pagination';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { OrganizationMiddleWare } from 'middlewares/organization';
import prisma from '@lib/prisma';

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));
handler.use(OrganizationMiddleWare([OrganizationRole.org_admin]));

interface NextApiRequestWithId extends NextApiRequestWithSession {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string, memberId: string };
}

handler.delete(async (
  req: NextApiRequestWithId & PaginatedNextApiRequest & NextApiRequestWithSession,
  res: NextApiResponse
) => {
  const { query } = req;
  const { memberId } = query;

  await prisma.organizationMember.delete({
    where: {
      id: memberId
    }
  });
  return res.status(200).json({ message: 'removed' });
});

export default handler;
