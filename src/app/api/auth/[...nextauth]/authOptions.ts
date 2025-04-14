import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.senha))) {
          return { id: user.id.toString(), name: user.nome, email: user.email };
        }

        console.log("Usuário não encontrado ou senha incorreta.");
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
    updateAge: 24 * 60 * 60,   // Atualiza a sessão a cada 24 horas
  },
  callbacks: {
    async signIn({ user }) {
      try {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          const defaultPassword = await bcrypt.hash("default_password", 10);
          existingUser = await prisma.user.create({
            data: {
              nome: user.name,
              email: user.email ?? "",
              senha: defaultPassword,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };

      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email! },
      });

      if (existingUser) {
        session.user.id = existingUser.id.toString();
      }

      return session;
    },
  },
};
