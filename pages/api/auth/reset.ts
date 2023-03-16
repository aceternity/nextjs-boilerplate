import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import HashUtil from "@utils/HashUtil";

interface ResetPasswordApiRequest extends NextApiRequest {
  body: {
    password: string;
    token: string;
  };
}

const handler = nc();

handler.post(async (req: ResetPasswordApiRequest, res: NextApiResponse) => {
  const { password, token } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
   // Find the password reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: String(token) },
      include: { user: true },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const passwordHash: string = await HashUtil.createHash(password);
    await prisma.user.update({
      where: { id: resetToken.user.id },
      data: { password: passwordHash },
    });
  
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
  
    res.status(200).json({ success: true });

  } catch(e: any) {
    res.status(500).json({ message: e.message || "Something went wrong" })
  }
});

export default handler;