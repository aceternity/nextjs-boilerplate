import { Session } from 'next-auth'
import { NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { OrganizationRole } from '@prisma/client';
import { NextApiRequestWithSession } from './auth';
import prisma from '@lib/prisma';

export type NextApiOrganizationRequest = NextApiRequestWithSession & {
  session: Session;
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
};

const OrganizationMiddleWare = (roles: OrganizationRole[]) => {
  return async (req: NextApiOrganizationRequest, res: NextApiResponse, next: NextHandler) => {

    const { session, query } = req;

    if (!session) {
      return res.status(400).json({
        message: 'Unauthorized access',
      })
    }

    if (roles.length === 0) {
      next();
      return;
    }

    const { user } = session;

    const member = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id as string,
          organizationId: query.id,
        }
      }
    });

    if (!member) {
      return res.status(400).json({
        message: 'Unauthorized access',
      })
    }

    const { role } = member;
    if (roles.findIndex((_r) => _r === role) > -1) {
      next()
    } else {
      res.statusCode = 405
      return res.json({
        message: 'Bad request',
      })
    }
  }
}

export { OrganizationMiddleWare }
