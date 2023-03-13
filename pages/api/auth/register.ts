import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import HashUtil from "@utils/HashUtil";
import { User } from "@prisma/client";

interface RegisterApiRequest extends NextApiRequest {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

const handler = nc();

handler.post(async (req: RegisterApiRequest, res: NextApiResponse) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const existingUser: User | null = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Account already exist" });
    }

    const passwordHash: string = await HashUtil.createHash(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      }
    });

    res.status(200).json({ name: "Account created" });
  } catch(e: any) {
    res.status(500).json({ message: e.message || "Something went wrong" })
  }
});

export default handler;