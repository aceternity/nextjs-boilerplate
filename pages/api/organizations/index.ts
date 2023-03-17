import type { NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { Prisma, Role, Subscription } from '@prisma/client';
import { createPaginator, PaginatedNextApiRequest, PaginatedResult } from '@lib/pagination';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';

export interface OrganizationData {
  id: number;
  name: string | null;
  subscription: Subscription;
  _count: {
    invitations: number;
    members: number;
  }
}

export type OrganizationsData = PaginatedResult<OrganizationData>;
const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

const paginate = createPaginator({ perPage: 20 });

handler.get(async (
  req: PaginatedNextApiRequest & NextApiRequestWithSession,
  res: NextApiResponse<OrganizationsData>
) => {
  const { query } = req;
  const { page } = query;

  const result = await paginate<OrganizationData, Prisma.OrganizationFindManyArgs>(
    prisma.organization,
    {
      select: {
        id: true,
        name: true,
        subscription: true,
        _count: {
          select: {
            members: true,
            invitations: true,
          }
        }
      },
    },
    { page: page }
  );

  res.status(200).json(result);
});

interface CreateOrganizationApiRequest extends NextApiRequestWithSession {
  body: {
    name: string;
  }
}

handler.post(async (
  req: CreateOrganizationApiRequest,
  res: NextApiResponse
) => {
  const userId = req.session?.user.id;
  try {
    const { name } = req.body;
    await prisma.organization.create({
      data: {
        name,
        users: {
          connect: { id: userId as string }
        },
        members: {
          create: {
            user: {
              connect: { id: userId as string }
            },
            role: 'org_admin',
          }
        }
      }
    });
    res.status(200).json({ name: "Organization created" });
  } catch(e: any) {
    res.status(500).json({ message: e.message || "Something went wrong" })
  }
});

export default handler;
