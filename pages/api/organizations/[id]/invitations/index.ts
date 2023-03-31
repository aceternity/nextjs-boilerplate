import type { NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { OrganizationInvitationStatus, OrganizationRole, Prisma, Role } from '@prisma/client';
import { createPaginator, PaginatedNextApiRequest, PaginatedResult } from '@lib/pagination';
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { 
  OrganizationMemberInviteFormValues 
} from '@components/forms/OrganizationMemberInviteForm/OrganizationMemberInviteForm';
import jwt from 'jsonwebtoken';
import mail from '@lib/email';
import OrganizationInviteTeamMemberEmail from '@lib/email/templates/OrganisationInviteTeamMember';
import { render } from '@react-email/render';

export interface OrganizationInvitationMemberData {
  id: number;
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


export interface TokenPayload {
  email: string;
  organizationId: string;
}
interface SendInivitationApiRequest extends NextApiRequestWithSession {
  body: OrganizationMemberInviteFormValues;
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
}

handler.post(async(
  req:  SendInivitationApiRequest,
  res: NextApiResponse
) => {
  const { body, query } = req;
  const { id } = query;

  const tokenPayload: TokenPayload = {
    email: body.email,
    organizationId: id,
  };

  const isInvitationAlreadySent = await prisma.organizationMemberInvitation.findUnique({
    where: {
      email_organizationId: {
        email: body.email,
        organizationId: id,
      }
    }
  });

  if (isInvitationAlreadySent) {
    return res.status(400).json({ message: 'invitation already sent'  });
  }

  const now = new Date();
  const expiresInMs = 60 * 60 * 1000; // 1 hour in milliseconds
  const expiresAt = new Date(now.getTime() + expiresInMs);

  const token = jwt.sign(tokenPayload, process.env.SECRET!, { expiresIn: '1h' });

  await prisma.organizationMemberInvitation.create({
    data: {
      email: body.email,
      organization: { connect: { id: id } },
      token: token,
      expiresAt: expiresAt,
    }
  });

  const preparedUrl = `${process.env.NEXTAUTH_URL}/invitation?token=${token}`;

  await mail.sendEmail({
    to: body.email,
    subject: 'Organization Invitaion',
    body: render(OrganizationInviteTeamMemberEmail({ url: preparedUrl })),
  });

  res.status(200).json({ message: 'invitation sent'  });
})


export default handler;
