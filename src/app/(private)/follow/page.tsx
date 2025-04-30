"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/Footer";

interface User {
  id: number;
  nome: string;
  email: string;
  avatar: string | null;
  isFollowing: boolean;
}

export default function FollowPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f2235] to-[#2d3250] flex items-center justify-center">
        <div className="text-white text-center py-20">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Carregando...
        </div>
      </div>
    );
  }

  const handleSearch = async () => {
    const res = await axios.get(`/api/user/search?query=${query}`);
    setUsers(res.data);
  };

  const handleFollow = async (id: number) => {
    await axios.post("/api/user/follow", { targetUserId: id });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isFollowing: true } : u))
    );
  };

  const handleUnfollow = async (id: number) => {
    await axios.delete("/api/user/follow", { data: { targetUserId: id } });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isFollowing: false } : u))
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#1f2235] to-[#2d3250] py-8 px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
              Conecte-se com outros
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Descubra novas pessoas para seguir e expanda sua rede de conexões.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou email"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <svg
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center shadow-lg hover:shadow-orange-500/30 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Buscar</span>
              <svg
                className="sm:ml-2 w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {users.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm sm:text-lg px-2">
                  Nenhum usuário encontrado. Tente uma busca diferente.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setUsers([]);
                  }}
                  className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 text-orange-400 hover:text-orange-300 font-medium transition text-sm sm:text-base"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-gray-600"
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="relative">
                      <Image
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.nome}&background=random`
                        }
                        alt="Avatar"
                        width={56}
                        height={56}
                        className="rounded-full object-cover w-10 h-10 sm:w-14 sm:h-14 border-2 border-orange-500/30"
                      />
                      {user.isFollowing && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <svg
                            className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm sm:text-lg truncate">
                        {user.nome}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      user.isFollowing
                        ? handleUnfollow(user.id)
                        : handleFollow(user.id)
                    }
                    className={`w-full sm:w-auto px-3 sm:px-5 py-2 sm:py-2.5 text-xs cursor-pointer sm:text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
                      user.isFollowing
                        ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500"
                        : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-orange-500/30"
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 12H6"
                          />
                        </svg>
                        <span>Deixar de seguir</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}