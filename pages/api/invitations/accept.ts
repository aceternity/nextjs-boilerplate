import { Role } from "@prisma/client";
import { AuthMiddleWare, NextApiRequestWithSession } from "middlewares/auth";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import prisma from "@lib/prisma";
import { TokenPayload } from "../organizations/[id]/invitations/index";

const handler = nextConnect();
handler.use(AuthMiddleWare([Role.customer, Role.superadmin]));

handler.post(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
  const { token } = req.body;
  const { session } = req;

  const userId = session?.user.id;

  try {
    const { email, organizationId } = jwt.verify(token, process.env.SECRET!) as TokenPayload;
    // Find the invitation in the database by email and organizationId
    const invitation = await prisma.organizationMemberInvitation.findUnique({
      where: {
        email_organizationId: {
          email: email,
          organizationId: organizationId,
        },
      },
    });

    // Check if the invitation has expired
    const now = new Date();
    if (invitation && invitation.expiresAt && invitation.expiresAt.getTime() <= now.getTime()) {
      // The invitation has expired, delete it from the database
      await prisma.organizationMemberInvitation.delete({
        where: { id: invitation.id },
      });

      return res.status(400).json({ message: 'The invitation has expired' });
    }

    // ... continue with accepting the invitation if it's valid ...
    await prisma.organizationMember.create({
      data: {
        role: invitation?.role,
        organization: {
          connect: { id: organizationId }
        },
        user: {
          connect: { id: userId as string }
        }
      }
    });

    if (invitation) {
      await prisma.organizationMemberInvitation.delete({
        where: { id: invitation.id },
      });
    }


    return res.status(200).json({ message: 'Accepted', data: { organizationId } });

  } catch (error) {

    if (error instanceof TokenExpiredError) {
      const tokenData = jwt.decode(token)  as TokenPayload;

      try {
        await prisma.organizationMemberInvitation.delete({
          where: { 
            email_organizationId: {
              email: tokenData.email,
              organizationId: tokenData.organizationId
            }
          },
        });
        return res.status(400).json({ message: 'The invitation has expired' });
      } catch(err) {
        return res.status(400).json({ message: 'Invalid token' });
      }
    }

    return res.status(400).json({ message: 'Invalid token' });
  }
});

export default handler;
