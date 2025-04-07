
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { rating, comment, movieTmdbId } = await req.json();

  if (!rating || !movieTmdbId || typeof comment !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      movieTmdbId,
      userId: user.id,
    },
  });

  return NextResponse.json(review);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieTmdbId = parseInt(searchParams.get("movieTmdbId") || "");

  if (!movieTmdbId) {
    return NextResponse.json({ error: "ID do filme inválido." }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { movieTmdbId },
    include: {
      user: {
        select: {
          nome: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
