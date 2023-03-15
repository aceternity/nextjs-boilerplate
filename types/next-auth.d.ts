import { Role } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      	role: string
        id: string | number
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string | number;
  }
}