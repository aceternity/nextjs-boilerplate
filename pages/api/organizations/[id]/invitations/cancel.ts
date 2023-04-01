import { NextApiResponse } from "next";
import nextConnect from "next-connect";

import prisma from "@lib/prisma";
import { OrganizationRole, Role } from "@prisma/client";

import { AuthMiddleWare, NextApiRequestWithSession } from "middlewares/auth";
import { OrganizationMiddleWare } from "middlewares/organization";

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));
handler.use(OrganizationMiddleWare([OrganizationRole.org_admin]));

interface NextApiRequestWithId extends NextApiRequestWithSession {
  query: Partial<{ [key: string]: string | string[] | undefined }> & { id: string };
  body: {
    invitationId: string;
  }
}
handler.post(async (req: NextApiRequestWithId, res: NextApiResponse) => {
  const { body } = req;
  const { invitationId } = body;

  await prisma.organizationMemberInvitation.delete({
    where: {
      id: invitationId,
    }
  })

  res.status(200);
})

export default handler;