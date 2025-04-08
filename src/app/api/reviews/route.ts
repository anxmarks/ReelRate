
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

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

  const movieTmdbIdParam = searchParams.get("movieTmdbId");
  const userEmail = searchParams.get("userEmail");

  if (movieTmdbIdParam) {
    const movieTmdbId = parseInt(movieTmdbIdParam);

    if (isNaN(movieTmdbId)) {
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

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(reviews);
  }

  return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, rating, comment } = await req.json();

  if (!id || !rating || typeof comment !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  try {
    // Verifica se a review pertence ao usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const existingReview = await prisma.review.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review não encontrada ou não pertence ao usuário." }, { status: 403 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating, comment },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Erro ao atualizar review:", error);
    return NextResponse.json({ error: "Erro ao atualizar review." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");
  const id = idParam ? parseInt(idParam, 10) : NaN;

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID da review é inválido." }, { status: 400 });
  }

  try {
    // Verifica se a review pertence ao usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const existingReview = await prisma.review.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review não encontrada ou não pertence ao usuário." }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar review:", error);
    return NextResponse.json({ error: "Erro ao deletar review." }, { status: 500 });
  }
}