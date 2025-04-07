"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import axios from "axios";
import { Pencil } from "lucide-react";
import WatchLaterCard from "@/components/WatchLaterCard";

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
  const [userReviews, setUserReviews] = useState<(Review & { movie: Movie | null })[]>([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const avatarOptions = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
  ];

  const modalRef = useRef<HTMLDivElement>(null);

  const handleAvatarChange = async () => {
    if (!selectedAvatar || !session?.user?.email) return;

    await axios.put("/api/user/avatar", { avatar: selectedAvatar });
    setShowModal(false);
    router.refresh();
  };

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await axios.get(`/api/user/avatar?email=${session.user.email}`);
        const avatar = res.data.avatar;
        if (avatar) setSelectedAvatar(avatar);
      } catch (error) {
        console.error("Erro ao buscar avatar:", error);
      }
    };

    fetchUserAvatar();
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchReviews = async () => {
      if (!session?.user?.email) return;

      const res = await axios.get(`/api/reviews?userEmail=${session.user.email}`);
      const reviews: Review[] = res.data;

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
          } catch {
            return { ...review, movie: null };
          }
        })
      );

      setUserReviews(reviewsWithMovies);
    };

    const fetchWatchLater = async () => {
      try {
        const res = await axios.get("/api/watch-later/list");
        setWatchLaterMovies(res.data);
      } catch (err) {
        console.error("Erro ao buscar filmes para assistir mais tarde:", err);
      }
    };

    fetchReviews();
    fetchWatchLater();
  }, [session, status, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  if (status === "loading") {
    return <p className="text-center text-gray-300">Carregando...</p>;
  }

  const userImage = selectedAvatar || "/avatars/default-profile.png";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#2d3250] text-white px-4 py-10 mt-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="bg-[#424769] rounded-2xl p-8 shadow-xl border border-[#676f9d]/30 flex flex-col items-center relative">
            <div className="relative">
              <img
                src={userImage}
                alt="User Avatar"
                className="w-28 h-28 rounded-full border-4 border-[#f9b17a] shadow-md"
              />
              <button
                onClick={() => setShowModal(true)}
                className="absolute bottom-2 right-2 bg-[#f9b17a] text-black p-1 rounded-full hover:bg-orange-400"
                title="Editar avatar"
              >
                <Pencil size={18} />
              </button>
            </div>
            <h1 className="mt-4 text-3xl font-bold">{session?.user?.name}</h1>
            <p className="text-[#a1a5c0]">{session?.user?.email}</p>

            <div className="mt-6 flex gap-10 text-center text-sm text-[#c1c3d1]">
              <div>
                <span className="block text-2xl font-bold text-white">{userReviews.length}</span>
                Avaliados
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{watchLaterMovies.length}</span>
                Para assistir
              </div>
            </div>
          </div>

          {/* Filmes Avaliados */}
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

          {/* Assistir Mais Tarde */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#f9b17a]">Assistir mais tarde</h2>
            {watchLaterMovies.length === 0 ? (
              <p className="text-gray-400">Nenhum filme salvo para assistir depois.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {watchLaterMovies.map((movie) => (
                  <WatchLaterCard key={movie.id} movieId={movie.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-[#2d3250] p-6 rounded-xl shadow-lg border border-[#676f9d] w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-center mb-4 text-white">Escolha um novo avatar</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {avatarOptions.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Avatar"
                  className={`w-16 h-16 rounded-full cursor-pointer border-4 ${selectedAvatar === avatar ? "border-[#f9b17a]" : "border-transparent"}`}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
              >
                Fechar
              </button>
              <button
                onClick={handleAvatarChange}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
