"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import axios from "axios";
import { Pencil } from "lucide-react";
import WatchLaterCard from "@/components/WatchLaterCard";
import Link from "next/link";
import { toast } from "react-toastify";

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

type WatchList = {
  id: number;
  nome: string;
  movieTmdbId: number[];
  createdAt: string;
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false); // Controla a exibição do modal
  const [selectedListId, setSelectedListId] = useState<number | null>(null); // ID da lista selecionada para edição
  const [newListName, setNewListName] = useState<string>(""); // Novo nome da lista
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [userReviews, setUserReviews] = useState<(Review & { movie: Movie | null })[]>([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showReviewed, setShowReviewed] = useState(true);
  const [showWatchLater, setShowWatchLater] = useState(true);
  const [watchLists, setWatchLists] = useState<WatchList[]>([]);
  const [expandedListId, setExpandedListId] = useState<number | null>(null);

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

  const handleRemoveFromList = async (listId: number, movieTmdbId: number) => {
    try {
      const response = await axios.delete('/api/watch-lists/remove-movie', {
        data: { listId, movieTmdbId }
      });

      setWatchLists(watchLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            movieTmdbId: list.movieTmdbId.filter(id => id !== movieTmdbId)
          };
        }
        return list;
      }));

      toast.success(`Filme removido da lista!`);
    } catch (error) {
      console.error("Erro ao remover filme:", error);
      toast.error("Erro ao remover filme");
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      await axios.delete("/api/watch-lists", { data: { listId } });
      setWatchLists((prev) => prev.filter((list) => list.id !== listId));
      toast.success("Lista deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
      toast.error("Erro ao deletar lista");
    }
  };

  const handleEditList = async (listId: number, newName: string) => {
    try {
      const res = await axios.put("/api/watch-lists", { listId, nome: newName });
      setWatchLists((prev) =>
        prev.map((list) => (list.id === listId ? { ...list, nome: res.data.nome } : list))
      );
      toast.success("Lista editada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar lista:", error);
      toast.error("Erro ao editar lista");
    }
  };

  useEffect(() => {

    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchFollowerCount = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await axios.get("/api/user/followers/count");
        setFollowerCount(res.data.followerCount);
      } catch (error) {
        console.error("Erro ao buscar quantidade de seguidores:", error);
      }
    };
    fetchFollowerCount();

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

    const fetchWatchLists = async () => {
      try {
        const res = await axios.get("/api/watch-lists");
        setWatchLists(res.data);
      } catch (err) {
        console.error("Erro ao buscar listas:", err);
      }
    };

    fetchReviews();
    fetchWatchLater();
    fetchWatchLists();
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

  const toggleList = (listId: number) => {
    setExpandedListId(expandedListId === listId ? null : listId);
  };

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
                className="absolute bottom-2 right-2 bg-[#f9b17a] text-black p-1 rounded-full hover:bg-orange-400 cursor-pointer"
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
                <span className="block text-2xl font-bold text-white">{watchLists.length}</span>
                Listas
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{followerCount}</span>
                Seguidores
              </div>
            </div>
          </div>

          {/* Filmes Avaliados */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#f9b17a]">Filmes Avaliados</h2>
              <button onClick={() => setShowReviewed(!showReviewed)} className="text-[#f9b17a] transition-transform">
                <span className={`inline-block transform ${showReviewed ? "rotate-90" : "-rotate-90"}`}>▶</span>
              </button>
            </div>
            {showReviewed && (
              userReviews.length === 0 ? (
                <p className="text-gray-400">Você ainda não avaliou nenhum filme.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {userReviews.map((review) => (
                    <Link key={review.id} href={`/movie/${review.movie?.id}`} passHref>
                      <div className="bg-[#424769] rounded-xl overflow-hidden shadow-lg border border-[#676f9d]/20 hover:scale-105 transition cursor-pointer">
                        {review.movie?.poster_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${review.movie.poster_path}`}
                            alt={review.movie.title}
                            className="w-full h-100 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold">{review.movie?.title}</h3>
                          <p className="text-[#f9b17a]">Nota: {review.rating} ⭐</p>
                          <p className="text-gray-300 mt-2 text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Minhas listas */}
          {/* Minhas listas */}
          <div>
            <div className="flex items-center justify-between mb-4 mt-10">
              <h2 className="text-2xl font-bold text-[#f9b17a]">Minhas listas</h2>
              <button
                onClick={() => setShowWatchLater(!showWatchLater)}
                className="text-[#f9b17a] transition-transform"
              >
                <span className={`inline-block transform ${showWatchLater ? "rotate-90" : "-rotate-90"}`}>▶</span>
              </button>
            </div>

            {showWatchLater && (
              watchLists.length === 0 ? (
                <p className="text-gray-400">Nenhuma lista criada.</p>
              ) : (
                <div className="space-y-4">
                  {watchLists.map((list) => (
                    <div key={list.id} className="bg-[#424769] rounded-lg p-4">
                      {/* Header da lista */}
                      <div className="flex justify-between items-center">
                        <div
                          onClick={() => toggleList(list.id)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <h3 className="font-medium text-lg text-[#f9b17a]">{list.nome}</h3>
                          <span className={`transition-transform ${expandedListId === list.id ? "rotate-90" : ""}`}>
                            ▶
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {/* Botão de editar lista */}
                          <button
                            onClick={() => {
                              setSelectedListId(list.id);
                              setNewListName(list.nome);
                              setShowEditModal(true);
                            }}
                            className="flex items-center cursor-pointer gap-1 text-blue-500 hover:text-blue-400"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                          {/* Botão de deletar lista */}
                          <button
                            onClick={() => handleDeleteList(list.id)}
                            className="flex cursor-pointer items-center gap-1 text-red-500 hover:text-red-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M4 7h16M10 3h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                              />
                            </svg>
                            Deletar
                          </button>
                        </div>
                      </div>

                      {/* Conteúdo da lista (expandido) */}
                      {expandedListId === list.id && (
                        <div className="mt-4">
                          {list.movieTmdbId.length === 0 ? (
                            <p className="text-gray-400 ml-4">Nenhum filme nesta lista.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 ml-4">
                              {list.movieTmdbId.map((movieId) => (
                                <div key={movieId} className="relative group">
                                  <Link href={`/movie/${movieId}`} passHref>
                                    <WatchLaterCard movieId={movieId} />
                                  </Link>
                                  {/* Botão de remover filme da lista */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveFromList(list.id, movieId);
                                    }}
                                    className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remover da lista"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Modal de edição de lista */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
              <div className="bg-[#2d3250] p-6 rounded-xl shadow-lg border border-[#676f9d] w-[90%] max-w-md">
                <h2 className="text-xl font-bold text-center mb-4 text-white">Editar Lista</h2>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f9b17a]"
                  placeholder="Digite o novo nome da lista"
                />
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (selectedListId !== null) {
                        handleEditList(selectedListId, newListName);
                      }
                      setShowEditModal(false);
                    }}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
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
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={handleAvatarChange}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
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
