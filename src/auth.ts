import NextAuth, { Session, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import Google from "next-auth/providers/google";

const authObject = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  callbacks: {
    session: ({
      session,
      user,
    }: {
      session: {
        userId?: string;
        sessionToken: string;
      } & Session;
      user: { id: string } & User;
    }) => {
      return {
        expires: session.expires,
        userId: user.id,
        sessionToken: session.sessionToken,
        user
      };
    },
  },
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     // Logged in users are authenticated, otherwise redirect to login page
  //     return !!auth;
  //   },
  // },
});

export const { handlers, auth, signOut, signIn } = authObject;
