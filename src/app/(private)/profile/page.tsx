"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  const userImage = session?.user?.image || "/default-profile.jpg";

  // Mock de dados
  const favoriteMovies = [
    { title: "Inception", poster: "/inception.jpg", rating: 5 },
    { title: "Interstellar", poster: "/interstellar.jpg", rating: 4.5 },
    { title: "The Batman", poster: "/batman.jpg", rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Seção do perfil */}
        <div className="bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <img
            src={userImage}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-yellow-500 shadow"
          />
          <h1 className="mt-4 text-3xl font-bold">{session?.user?.name}</h1>
          <p className="text-zinc-400">{session?.user?.email}</p>

          <div className="mt-4 flex gap-6 text-sm text-zinc-300">
            <div>
              <span className="block text-xl font-semibold text-white">12</span>
              Filmes avaliados
            </div>
            <div>
              <span className="block text-xl font-semibold text-white">5</span>
              Favoritos
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Sair
          </button>
        </div>

        {/* Lista de filmes avaliados */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Filmes Favoritos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteMovies.map((movie, i) => (
              <div
                key={i}
                className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-yellow-400">Nota: {movie.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
