"use client";

import { useEffect, useState, useCallback } from "react";
import { useFilteredMovies } from "@/app/lib/hooks/useFilteredMovies";
import { useMovieRatings } from "@/app/lib/hooks/useMovieRatings";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import debounce from "lodash.debounce";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import MovieFilters from "@/components/MovieFilters";

export default function MoviesList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState(0);

  const debounceQuery = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debounceQuery(query);
  }, [query, debounceQuery]);

  const { data: moviesData, isLoading, error } = useFilteredMovies({
    query: debouncedQuery,
    genre,
    year,
    page,
  });

  const movieIds = moviesData?.results.map((movie: any) => movie.id) || [];
  const ratings = useMovieRatings(movieIds);

  return (
    <div className="bg-[#2d3250] min-h-screen text-white px-6 py-10">
      <SearchBar value={query} onChange={setQuery} />

      <MovieFilters
        genre={genre}
        year={year}
        onGenreChange={(g) => {
          setGenre(g);
          setPage(1);
        }}
        onYearChange={(y) => {
          setYear(y);
          setPage(1);
        }}
      />

      {isLoading && (
        <div className="flex justify-center mt-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-12 h-12 border-4 border-t-[#f9b17a] border-transparent rounded-full"
          />
        </div>
      )}
      {error && <p className="text-center text-red-500">Erro ao carregar filmes.</p>}
      {!isLoading && moviesData?.results?.length === 0 && (
        <p className="text-center mt-10 text-[#676f9d]">Nenhum filme encontrado.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
        {moviesData?.results.map((movie: any, index: number) => {
          const rating = ratings[index];

          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/movie/${movie.id}`} className="block">
                <div className="relative bg-gradient-to-b from-[#424769] to-[#2d3250] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group/card h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f9b17a]/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10" />

                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/placeholder-movie.jpg"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />

                    {rating !== undefined && (
                      <div className="absolute top-2 right-2 bg-[#f9b17a]/90 text-[#2d3250] font-bold text-[12px] px-2 py-1 rounded-full flex items-center gap-1 z-10">
                        <Star className="w-3 h-3 fill-current" />
                        {rating?.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">
                      {movie.title}
                    </h3>

                    <div className="flex justify-between items-center">
                      {movie.release_date && (
                        <span className="text-[12px] text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      )}

                      {rating !== undefined && (
                        <div className="flex items-center text-[#f9b17a] text-xs gap-1">
                          <Star className="w-3 h-3 fill-[#f9b17a]" />
                          <span>{rating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10">
        <Pagination
          currentPage={page}
          totalPages={moviesData?.total_pages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
