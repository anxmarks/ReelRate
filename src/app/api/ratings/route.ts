import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieTmdbId = parseInt(searchParams.get("movieTmdbId") || "");

  if (!movieTmdbId) {
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
}
