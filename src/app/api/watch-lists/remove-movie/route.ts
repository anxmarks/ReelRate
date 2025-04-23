import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { listId, movieTmdbId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const list = await prisma.watchList.findFirst({
      where: { id: listId, userId: user?.id },
    });

    if (!list) {
      return NextResponse.json({ error: "Lista não encontrada" }, { status: 404 });
    }

    const updatedList = await prisma.watchList.update({
      where: { id: listId },
      data: {
        movieTmdbId: {
          set: list.movieTmdbId.filter(id => id !== movieTmdbId),
        },
      },
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("Erro ao remover filme:", error);
    return NextResponse.json(
      { error: "Erro ao remover filme" },
      { status: 500 }
    );
  }
}