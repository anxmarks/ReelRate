"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/Footer";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center text-gray-300">Carregando...</p>;
  }

  const userImage = session?.user?.image || "/default-profile.jpg";

  const favoriteMovies = [
    { title: "Inception", poster: "/inception.jpg", rating: 5 },
    { title: "Interstellar", poster: "/interstellar.jpg", rating: 4.5 },
    { title: "The Batman", poster: "/batman.jpg", rating: 4 },
  ];

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
                <span className="block text-2xl font-bold text-white">12</span>
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

          {/* Favoritos */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#f9b17a]">Filmes Favoritos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favoriteMovies.map((movie, i) => (
                <div
                  key={i}
                  className="bg-[#424769] rounded-xl overflow-hidden shadow-lg border border-[#676f9d]/20 hover:scale-105 transition"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{movie.title}</h3>
                    <p className="text-[#f9b17a]">Nota: {movie.rating} ⭐</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
