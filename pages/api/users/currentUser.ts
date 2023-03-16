import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Role } from '@prisma/client';
import prisma from '@lib/prisma';
import { ProfileFormValues } from '@components/forms/ProfileForm/ProfileForm';

export type UserData = {
  name?: string | null | undefined;
}

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

handler.get(async (
  req: NextApiRequestWithSession,
  res: NextApiResponse<UserData>,
) => {
  const userId = req.session?.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string
    },
    select: {
      name: true,
    }
  });

  res.status(200).json({ ...user })
});

interface NextUpdateUserApiRequest extends NextApiRequestWithSession {
  body: ProfileFormValues
}

handler.patch(async (
  req: NextUpdateUserApiRequest,
  res: NextApiResponse<UserData>,
) => {
  const userId = req.session?.user.id;

  const { name } = req.body;
  const updated = await prisma.user.update({
    where: { id: userId as string },
    data: { name }
  });
  
  res.status(200).json({ name: updated.name });
})

export default handler;
