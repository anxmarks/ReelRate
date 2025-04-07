import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/app/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const movieTmdbId = searchParams.get("movieTmdbId");

  if (!movieTmdbId) {
    return NextResponse.json({ error: "ID do filme é obrigatório" }, { status: 400 });
  }

  try {
    const review = await prisma.review.findFirst({
      where: {
        movieTmdbId: Number(movieTmdbId),
        user: {
          email: session.user.email,
        },
      },
    });

    return NextResponse.json({ hasReview: !!review });
  } catch (error) {
    console.error("Erro ao verificar review:", error);
    return NextResponse.json(
      { error: "Erro ao verificar avaliação" },
      { status: 500 }
    );
  }
}