import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { movieTmdbId } = await req.json();

  if (!session?.user?.email || !movieTmdbId)
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user)
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  const existing = await prisma.watchLater.findFirst({
    where: { userId: user.id, movieTmdbId },
  });

  if (existing) {
    await prisma.watchLater.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: "Removido da lista" });
  } else {
    await prisma.watchLater.create({ data: { userId: user.id, movieTmdbId } });
    return NextResponse.json({ message: "Adicionado à lista" });
  }
}
