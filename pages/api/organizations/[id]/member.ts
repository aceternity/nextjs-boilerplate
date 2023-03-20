import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { OrganizationRole, Role } from '@prisma/client';
import prisma from '@lib/prisma';


const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

export type OrganizationMemberData = {
  data: {
    user: {
      name: string | null;
      email: string | null;
    } | null;
    id: string;
    role: OrganizationRole;
    createdAt: Date;
  } | null,
  message?: string;
}

interface OrganizationMemberApiRequest extends NextApiRequestWithSession {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
}

handler.get(async (
  req: OrganizationMemberApiRequest,
  res: NextApiResponse<OrganizationMemberData>,
) => {
  const organizationId = req.query.id;
  const userId = req.session?.user.id;

  const user = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: userId as string,
        organizationId: organizationId
      }
    },
    select: {
      id: true,
      role: true,
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      createdAt: true,
    }
  });

  res.status(200).json({ message: '', data: user })
});


export default handler;
