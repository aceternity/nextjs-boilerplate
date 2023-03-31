import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { User } from "@prisma/client";
import mail from "@lib/email";
import { render } from "@react-email/render";
import ResetPasswordEmail from "@lib/email/templates/ResetPassword";

interface ForgotApiRequest extends NextApiRequest {
  body: {
    email: string;
  };
}

const handler = nc();

handler.post(async (req: ForgotApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const existingUser: User | null = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).slice(2);
    const expirationTime = new Date(Date.now() + 24 * 3600 * 1000); // Token expires in 24 hours
    await prisma.passwordResetToken.create({
      data: {
        token,
        expires: expirationTime,
        user: { connect: { id: existingUser.id } },
      },
    });

    const resetPasswordLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    await mail.sendEmail({
      to: email,
      subject: 'Reset Password Request',
      body: render(ResetPasswordEmail({ resetPasswordLink })),
    });

    res.status(200).json({ name: "Password reset link sent to your mail" });
  } catch(e: any) {
    res.status(500).json({ message: e.message || "Something went wrong" })
  }
});

export default handler;