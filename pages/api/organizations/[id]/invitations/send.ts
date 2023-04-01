import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import jwt from 'jsonwebtoken';
import { render } from "@react-email/render";
import { OrganizationRole, Role } from "@prisma/client";

import { AuthMiddleWare, NextApiRequestWithSession } from "middlewares/auth";
import prisma from "@lib/prisma";
import { OrganizationMemberInviteFormValues } from "@components/forms/OrganizationMemberInviteForm/OrganizationMemberInviteForm";
import mail from "@lib/email";
import OrganizationInviteTeamMemberEmail from "@lib/email/templates/OrganisationInviteTeamMember";
import { OrganizationMiddleWare } from "middlewares/organization";

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));
handler.use(OrganizationMiddleWare([OrganizationRole.org_admin]));

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
  const { email } = body;

  const trimmedEmail = email.trim();
  const tokenPayload: TokenPayload = {
    email: trimmedEmail,
    organizationId: id,
  };

  const isEmailAlreadyMember = await prisma.organizationMember.findMany({
    where: {
      organizationId: id,
      user: {
        email: trimmedEmail,
      }
    }
  });

  if (isEmailAlreadyMember.length > 0) {
    return res.status(400).json({ message: 'This user already a member in the organization!'  });
  }

  const isInvitationAlreadySent = await prisma.organizationMemberInvitation.findUnique({
    where: {
      email_organizationId: {
        email: trimmedEmail,
        organizationId: id,
      }
    }
  });

  if (isInvitationAlreadySent) {
    return res.status(400).json({ message: 'Invitation already sent'  });
  }

  const now = new Date();
  const expiresInMs = 60 * 60 * 1000; // 1 hour in milliseconds
  const expiresAt = new Date(now.getTime() + expiresInMs);

  const token = jwt.sign(tokenPayload, process.env.SECRET!, { expiresIn: '1h' });

  await prisma.organizationMemberInvitation.create({
    data: {
      email: trimmedEmail,
      organization: { connect: { id: id } },
      token: token,
      expiresAt: expiresAt,
    }
  });

  const preparedUrl = `${process.env.NEXTAUTH_URL}/invitation?token=${token}`;

  await mail.sendEmail({
    to: trimmedEmail,
    subject: 'Organization Invitaion',
    body: render(OrganizationInviteTeamMemberEmail({ url: preparedUrl })),
  });

  console.log(preparedUrl);
  res.status(200).json({ message: 'invitation sent'  });
});

export default handler;
