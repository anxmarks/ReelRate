"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import MovieReviews from "@/components/MovieReviews";
import MovieRating from "@/components/MovieRating";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function MoviePage(props: MoviePageProps) {
  const [movie, setMovie] = useState<any>(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const { data: session, status } = useSession();

  const handleWatchLater = async () => {
    try {
      const res = await axios.post("/api/watch-later", { movieTmdbId: movie.id });
      if (res.status === 200) {
        setIsWatchLater((prev) => !prev);
      }
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
    }
  };

  useEffect(() => {
    const loadMovie = async () => {
      const params = await props.params;
      const { id } = params;

      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
      );
      setMovie(res.data);
    };

    loadMovie();
  }, [props.params]);

  useEffect(() => {
    const checkWatchLater = async () => {
      if (!movie?.id || status !== "authenticated") return;

      try {
        const res = await axios.post("/api/watch-later/check", {
          movieTmdbId: movie.id,
        });
        setIsWatchLater(res.data.exists);
      } catch (error) {
        console.error("Erro ao verificar estado do botão:", error);
      }
    };

    checkWatchLater();
  }, [movie?.id, status]);

  if (!movie) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#2d3250] text-white px-6 py-10 mt-10">
        <div className="max-w-5xl mx-auto bg-[#424769] rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-[300px] rounded-xl shadow-lg object-cover"
          />

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

              <MovieRating movieTmdbId={movie.id} shouldUpdate={shouldUpdate} />

              <p className="text-gray-200 leading-relaxed">{movie.overview}</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Data de lançamento: {movie.release_date}</span>
              </div>

              {status === "authenticated" && (
                <button
                  onClick={handleWatchLater}
                  className={`${isWatchLater ? "bg-red-500 hover:bg-red-600 cursor-pointer" : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                    } text-white px-4 py-2 rounded`}
                >
                  {isWatchLater ? "Remover da lista" : "Assistir mais tarde"}
                </button>

              )}
            </div>
          </div>
        </div>

        <MovieReviews
          movieTmdbId={movie.id}
          onReviewSubmitted={() => setShouldUpdate((prev) => !prev)}
        />
      </div>
      <Footer />
    </>
  );
}