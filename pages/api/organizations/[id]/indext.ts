import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Role } from '@prisma/client';


const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

handler.get(async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => {

  res.status(200).json({ success: 'build something here' })
});


export default handler;
