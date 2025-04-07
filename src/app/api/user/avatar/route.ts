import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { avatar } = await req.json();

  if (!avatar) {
    return NextResponse.json({ error: "Avatar inválido" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { avatar },
  });

  return NextResponse.json({ message: "Avatar atualizado com sucesso" });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { avatar: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ avatar: user.avatar });
}
