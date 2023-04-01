import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { OrganizationRole, Role } from '@prisma/client';
import { OrganizationMiddleWare } from 'middlewares/organization';


const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));
handler.use(OrganizationMiddleWare([OrganizationRole.org_admin, OrganizationRole.org_user]));

handler.get(async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {

  res.status(200).json({ success: 'build something here' })
});


export default handler;
