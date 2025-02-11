import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import Google from "next-auth/providers/google";

const authObject = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     // Logged in users are authenticated, otherwise redirect to login page
  //     return !!auth;
  //   },
  // },
});

export const { handlers, auth, signOut, signIn } = authObject;