import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getMovieRating(movieTmdbId: number) {
  const reviews = await prisma.review.findMany({
    where: { movieTmdbId },
    select: { rating: true },
  });

  if (reviews.length === 0) return null;

  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = total / reviews.length;

  return Number(average.toFixed(1)); 
}
