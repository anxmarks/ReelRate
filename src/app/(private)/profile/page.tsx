"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import axios from "axios";

type Review = {
  id: string;
  rating: number;
  comment: string;
  movieTmdbId: number;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userReviews, setUserReviews] = useState<
    (Review & { movie: Movie | null })[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchReviews = async () => {
      if (!session?.user?.email) return;

      const res = await axios.get(`/api/reviews?userEmail=${session.user.email}`);
      const reviews: Review[] = res.data;

      console.log("Reviews vindas da API:", reviews);

      const reviewsWithMovies = await Promise.all(
        reviews.map(async (review) => {
          if (!review.movieTmdbId || isNaN(review.movieTmdbId)) {
            return { ...review, movie: null };
          }
      
          try {
            const movieRes = await axios.get(
              `https://api.themoviedb.org/3/movie/${review.movieTmdbId}?language=pt-BR&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            return { ...review, movie: movieRes.data };
          } catch (error) {
            console.error(`Erro ao buscar filme ID ${review.movieTmdbId}:`, error);
            return { ...review, movie: null };
          }
        })
      );
      
      setUserReviews(reviewsWithMovies);
    };

    fetchReviews();
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center text-gray-300">Carregando...</p>;
  }

  const userImage = session?.user?.image || "/default-profile.jpg";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#2d3250] text-white px-4 py-10 mt-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Perfil */}
          <div className="bg-[#424769] rounded-2xl p-8 shadow-xl border border-[#676f9d]/30 flex flex-col items-center">
            <img
              src={userImage}
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-4 border-[#f9b17a] shadow-md"
            />
            <h1 className="mt-4 text-3xl font-bold">{session?.user?.name}</h1>
            <p className="text-[#a1a5c0]">{session?.user?.email}</p>

            <div className="mt-6 flex gap-10 text-center text-sm text-[#c1c3d1]">
              <div>
                <span className="block text-2xl font-bold text-white">
                  {userReviews.length}
                </span>
                Avaliados
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">5</span>
                Favoritos
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Sair
            </button>
          </div>

          {/* Avaliações */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#f9b17a]">Filmes Avaliados</h2>
            {userReviews.length === 0 ? (
              <p className="text-gray-400">Você ainda não avaliou nenhum filme.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#424769] rounded-xl overflow-hidden shadow-lg border border-[#676f9d]/20 hover:scale-105 transition"
                  >
                    {review.movie?.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${review.movie.poster_path}`}
                        alt={review.movie.title}
                        className="w-full h-60 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{review.movie?.title}</h3>
                      <p className="text-[#f9b17a]">Nota: {review.rating} ⭐</p>
                      <p className="text-gray-300 mt-2 text-sm">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
