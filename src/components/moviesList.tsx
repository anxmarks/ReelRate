"use client";

import { useMovies } from "@/app/lib/hooks/useMovies";
import Link from "next/link";

export default function MoviesList() {
  const { data: movies, isLoading, error } = useMovies();

  if (isLoading) return <p className="text-center mt-10">Carregando filmes...</p>;
  if (error) return <p className="text-center text-red-500">Erro ao carregar filmes.</p>;

  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 bg-zinc-950 text-white min-h-screen">
      {movies.map((movie: any) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <div className="bg-zinc-900 p-3 rounded-xl shadow hover:scale-105 transition cursor-pointer">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-72 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold text-sm">{movie.title}</h3>
            <p className="text-yellow-400 text-xs">Nota: {movie.vote_average}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
