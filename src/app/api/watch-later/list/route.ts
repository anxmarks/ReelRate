import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const list = await prisma.watchLater.findMany({
    where: { userId: user?.id },
  });

  const movies = await Promise.all(
    list.map(async (item) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${item.movieTmdbId}?language=pt-BR&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        if (!res.ok) return null;
        return await res.json();
      } catch (error) {
        console.error("Erro ao buscar filme do TMDB:", error);
        return null;
      }
    })
  );
 
  const validMovies = movies.filter((movie) => movie !== null);

  return NextResponse.json(validMovies);
}
