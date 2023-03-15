import type { NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { AuthMiddleWare, NextApiRequestWithSession } from 'middlewares/auth';
import { Role, User } from '@prisma/client';
import prisma from '@lib/prisma';
import { ChangePasswordFormValues } from '@components/forms/ChangePasswordForm/ChangePasswordForm';
import HashUtil from '@utils/HashUtil';

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

interface NextUpdateUserApiRequest extends NextApiRequestWithSession {
  body: ChangePasswordFormValues
}

handler.patch(async (
  req: NextUpdateUserApiRequest,
  res: NextApiResponse,
) => {
  const userId = req.session?.user.id;

  const { password, newPassword } = req.body;

  const user: User | null = await prisma.user.findUnique({
    where: {
      id: userId as string
    }
  });

  if (!user || !user.password) {
    res.status(400).json({ message: 'You signed up using a social account, Contact customer support if you need further assistance.' });
    return;
  }

  const isValid = await HashUtil.compareHash(password, user.password as string);

  if (!isValid) {
    res.status(400).json({ message: 'Wrong password' });
    return;
  }
  const passwordHash: string = await HashUtil.createHash(newPassword);

  const updated = await prisma.user.update({
    where: { id: userId as string },
    data: { password: passwordHash }
  });
  
  res.status(200).json({ message: 'password updated' });
})

export default handler;
