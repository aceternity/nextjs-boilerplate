import NextAuth, { Awaitable, NextAuthOptions, User as NextAuthUser } from "next-auth";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from 'next-auth/providers/twitter';
// import FacebookProvider from 'next-auth/providers/facebook';


import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@lib/prisma";
import { User } from "@prisma/client";

import HashUtil from "@utils/HashUtil";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  debug: false,
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {

    jwt: async (params) => {
      const { user, token } = params;
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async (params) => {
      const { session } = params;
      if (!session) return session;
      const user = await prisma.user.findUnique({ 
        where: {
          email: session.user.email as string
        },
        select: {
          role: true,
          id: true,
          name: true,
          memberInOrganizations: {
            select: {
              id: true,
              role: true,
            }
          }
        }
      });

      session.user.isOrganizationAdmin = user?.memberInOrganizations.findIndex((org) => org.role === 'org_admin') !== -1;

      // if member detail registered as OrganizationMember it will be true
      session.user.isOrganizationUser = user?.memberInOrganizations && user?.memberInOrganizations.length > 0;

      session.user.name = user?.name as string;
      session.user.role = user?.role as string;
      session.user.id = user?.id as string;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    // TwitterProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    // }),
    // FacebookProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    // }),
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: (credentials, _req): Awaitable<NextAuthUser | null> => {
        return new Promise(async (resolve, reject) => {
          if (!credentials?.username) {
            return reject(new Error('Username empty'))
          }

          const user: User | null = await prisma.user.findUnique({
            where: {
              email: credentials?.username
            }
          });

          if (!user) {
            return reject(new Error('Invalid credentials'))
          }

          const isValid = await HashUtil.compareHash(credentials.password, user.password as string);

          if (!isValid) {
            return reject(new Error('Invalid credentials'))
          }

          resolve({
            id: user.id,
            email: user.email,
            name: user.name
          });
        })
      }
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ]
};

export default NextAuth(nextAuthOptions);