import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  try {
    const { listId, movieTmdbId } = await req.json();

    if (!listId || !movieTmdbId) {
      return NextResponse.json(
        { error: "ID da lista e ID do filme são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se a lista pertence ao usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const watchList = await prisma.watchList.findFirst({
      where: { id: listId, userId: user.id },
    });

    if (!watchList) {
      return NextResponse.json(
        { error: "Lista não encontrada ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Verifica se o filme já está na lista
    if (watchList.movieTmdbId.includes(movieTmdbId)) {
      return NextResponse.json(
        { error: "Filme já está na lista" },
        { status: 400 }
      );
    }

    // Atualiza a lista adicionando o novo filme
    const updatedList = await prisma.watchList.update({
      where: { id: listId },
      data: {
        movieTmdbId: {
          push: movieTmdbId, // Adiciona o novo ID ao array
        },
      },
    });

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    console.error("Erro ao adicionar filme à lista:", error);
    return NextResponse.json(
      { error: "Falha ao adicionar filme à lista" },
      { status: 500 }
    );
  }
}