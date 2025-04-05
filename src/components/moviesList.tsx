"use client";

import { useEffect, useState, useCallback } from "react";
import { useMovies } from "@/app/lib/hooks/useMovies";
import { useSearchMovies } from "@/app/lib/hooks/useSearchMovies";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import debounce from "lodash.debounce";

export default function MoviesList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce handler para atrasar a atualização da query real
  const debounceQuery = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
      setPage(1); // Resetar para a primeira página ao buscar
    }, 500),
    []
  );

  useEffect(() => {
    debounceQuery(query);
  }, [query, debounceQuery]);

  const { data: moviesData, isLoading, error } = debouncedQuery
    ? useSearchMovies(debouncedQuery, page)
    : useMovies(page);

  return (
    <div className="bg-zinc-950 min-h-screen text-white p-6">
      <SearchBar value={query} onChange={setQuery} />

      {isLoading && <p className="text-center mt-10">Carregando filmes...</p>}
      {error && <p className="text-center text-red-500">Erro ao carregar filmes.</p>}

      {!isLoading && moviesData?.results?.length === 0 && (
        <p className="text-center mt-10 text-gray-400">Nenhum filme encontrado.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {moviesData?.results.map((movie: any) => (
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

      <Pagination
        currentPage={page}
        totalPages={moviesData?.total_pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
