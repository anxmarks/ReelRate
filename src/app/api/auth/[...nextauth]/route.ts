import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";

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

export const authOptions = {
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
  session: { strategy: "jwt" as const },
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      try {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const defaultPassword = await bcrypt.hash("default_password", 10); //gera uma senha aleatoria para o usuário do google
          existingUser = await prisma.user.create({
            data: {
              nome: user.name,
              email: user.email,
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
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as { id?: string; name?: string | null; email?: string | null; image?: string | null };
      
      let existingUser = await prisma.user.findUnique({
        where: { email: (token.user as { email: string }).email },
      });

      if (existingUser) {
        session.user.id = existingUser.id.toString();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };