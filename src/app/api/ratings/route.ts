import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieTmdbIdParam = searchParams.get("movieTmdbId");
    const movieTmdbId = movieTmdbIdParam ? parseInt(movieTmdbIdParam, 10) : null;

    if (!movieTmdbId || isNaN(movieTmdbId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { movieTmdbId },
      select: { rating: true },
    });

    if (reviews.length === 0) return NextResponse.json({ average: null });

    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total / reviews.length;

    return NextResponse.json({ average: Number(average.toFixed(1)) });
  } catch (error) {
    console.error("Erro em /api/ratings:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
