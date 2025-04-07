"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function WatchLaterCard({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      setMovie(res.data);
    };

    fetchMovie();
  }, [movieId]);

  if (!movie) return null;

  return (
    <div className="bg-[#424769] rounded-xl overflow-hidden shadow-lg border border-[#676f9d]/20 hover:scale-105 transition">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{movie.title}</h3>
        <p className="text-gray-400 text-sm mt-2">{movie.overview?.slice(0, 100)}...</p>
      </div>
    </div>
  );
}
