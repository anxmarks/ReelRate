"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import MovieReviews from "@/components/MovieReviews";
import MovieRating from "@/components/MovieRating";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

type WatchList = {
  id: number;
  nome: string;
  movieTmdbId: number[];
  userId: number;
};

export default function MoviePage(props: MoviePageProps) {
  const [movie, setMovie] = useState<any>(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const { data: session, status } = useSession();
  const [showListOptions, setShowListOptions] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [watchLists, setWatchLists] = useState<WatchList[]>([]);
  const [tempListName, setTempListName] = useState("Assistir mais tarde");

  const handleAddToDefaultList = async () => {
    if (!movie?.id) return;

    if (watchLists.length > 0) {
      await handleAddToList(watchLists[0].id);
    } else {
      setShowListOptions(true);
    }
  };

  const isMovieInAnyList = watchLists.some(list =>
    list.movieTmdbId.includes(movie.id)
  );

  const handleAddToList = async (listId: number) => {
    try {
      const response = await fetch('/api/watch-lists/add-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, movieTmdbId: movie.id }),
      });
      if (!response.ok) throw new Error('Falha ao adicionar filme');
      const updatedList = await response.json();
      setWatchLists(watchLists.map(list =>
        list.id === updatedList.id ? updatedList : list
      ));
      setShowListOptions(false);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleCreateNewList = async () => {
    if (!tempListName.trim() || !movie?.id) return;

    try {
      const response = await axios.post('/api/watch-lists', {
        nome: tempListName,
        movieTmdbId: [movie.id]
      });

      setWatchLists([...watchLists, response.data]);
      setNewListName("");
      setShowListOptions(false);

      toast.success(`"${movie.title}" foi adicionado a "${tempListName}"!`, {
        position: "top-right",
        autoClose: 3000,
      });

      setTempListName("Assistir mais tarde");
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      toast.error('Erro ao criar lista');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.split-button-container')) {
        setShowListOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadMovie = async () => {
      const params = await props.params;
      const { id } = params;

      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
      );
      setMovie(res.data);
    };

    if (status === "authenticated") {
      const fetchWatchLists = async () => {
        try {
          const res = await axios.get('/api/watch-lists');
          setWatchLists(res.data);
        } catch (error) {
          console.error('Erro ao buscar listas:', error);
        }
      };
      fetchWatchLists();
    }

    loadMovie();
  }, [props.params]);

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
                <div className="relative inline-flex rounded-md shadow-sm split-button-container">
                  <button
                    onClick={handleAddToDefaultList}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-l-md cursor-pointer"
                  >
                    Adicionar na lista
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowListOptions(!showListOptions)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-2 rounded-r-md cursor-pointer border-l border-l-white/20"
                    >
                      ▼
                    </button>

                    {showListOptions && (
                      <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#424769] shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="py-1">
                          {/* Listas existentes */}
                          {watchLists.length > 0 && (
                            <div className="border-b border-[#676f9d] pb-2">
                              {watchLists.map((list) => (
                                <button
                                  key={list.id}
                                  onClick={() => handleAddToList(list.id)}
                                  className={`block w-full px-4 py-2 text-left text-sm ${list.movieTmdbId.includes(movie.id)
                                      ? "text-[#f9b17a] font-medium"
                                      : "text-white"
                                    } hover:bg-[#676f9d]`}
                                >
                                  {list.nome} {list.movieTmdbId.includes(movie.id) && "✓"}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Opção para criar nova lista (sempre visível) */}
                          <div className="px-4 py-2">
                            <p className="text-sm text-white mb-2">
                              {watchLists.length > 0 ? "Criar nova lista" : "Nenhuma lista criada"}
                            </p>
                            <input
                              type="text"
                              value={tempListName}
                              onChange={(e) => setTempListName(e.target.value)}
                              className="w-full px-2 py-1 text-sm text-black rounded"
                              onKeyDown={(e) => e.key === 'Enter' && handleCreateNewList()}
                              onFocus={(e) => e.target.select()}
                            />
                            <button
                              onClick={handleCreateNewList}
                              className="mt-2 w-full bg-orange-500 text-white px-2 py-1 text-sm rounded hover:bg-orange-600"
                            >
                              Criar lista
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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