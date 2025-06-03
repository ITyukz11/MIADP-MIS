import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

type CustomUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error(`Employee with email ${credentials.email} not found`);
          }

          if (!user.active) {
            throw new Error("Sorry, the admin deactivated your account. Please contact the MIADP PSO for reactivation.");
          }

          const passwordCorrect =
            user.email === "admin@gmail.com"
              ? credentials.password === user.password
              : await compare(credentials.password, user.password);

          if (!passwordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            region: user.region,
            component: user.component,
            unit: user.unit,
            position: user.position,
            expoPushToken: user.expoPushToken,
          };
        } catch (error: any) {
          console.error("Error authorizing user:", error);
          throw new Error(error.message || "An unexpected error occurred");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.region = user.region;
        token.component = user.component;
        token.unit = user.unit;
        token.position = user.position;
        token.verificationQuestion = user.verificationQuestion;
        token.verificationAnswer = user.verificationAnswer;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.region = token.region;
        session.user.component = token.component;
        session.user.unit = token.unit;
        session.user.position = token.position;
        session.user.verificationQuestion = token.verificationQuestion;
        session.user.verificationAnswer = token.verificationAnswer;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
};
