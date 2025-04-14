"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Star } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/Footer";

type Review = {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    movieTmdbId: number;
    user: {
        nome: string;
        email: string;
    };
};

type MovieData = {
    [key: number]: string;
};

type AvatarData = {
    [email: string]: string | null;
};

export default function AllReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [movies, setMovies] = useState<MovieData>({});
    const [avatars, setAvatars] = useState<AvatarData>({});
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const [loadingAvatars, setLoadingAvatars] = useState<boolean>(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get<Review[]>("/api/reviews/all");
                setReviews(res.data);

                const uniqueIds = Array.from(new Set(res.data.map((r: Review) => r.movieTmdbId)));
                const moviePromises = uniqueIds.map(async (id): Promise<{ id: number; title: string }> => {
                    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`);
                    const data = await res.json();
                    return { id: id as number, title: data.title };
                });

                const movieResults = await Promise.all(moviePromises);
                const movieMap: MovieData = {};
                movieResults.forEach(({ id, title }: { id: number; title: string }) => {
                    movieMap[id] = title;
                });

                setMovies(movieMap);

                const uniqueEmails = Array.from(new Set(res.data.map((r: Review) => r.user.email)));
                await fetchAvatars(uniqueEmails);
            } catch (error) {
                console.error("Erro ao carregar reviews:", error);
            }
        };

        const fetchAvatars = async (emails: string[]) => {
            try {
                setLoadingAvatars(true);
                const avatarMap: AvatarData = {};

                await Promise.all(
                    emails.map(async (email) => {
                        try {
                            const res = await axios.get(`/api/user/avatar/by-email?email=${email}`);
                            avatarMap[email] = res.data.avatar || null;
                        } catch (error) {
                            console.error(`Erro ao buscar avatar para ${email}:`, error);
                            avatarMap[email] = null;
                        }
                    })
                );

                setAvatars(avatarMap);
            } catch (error) {
                console.error("Erro ao buscar avatares:", error);
            } finally {
                setLoadingAvatars(false);
            }
        };

        fetchReviews();
    }, []);

    const toggleComment = (id: number) => {
        setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#2d3250] py-12 px-4 pt-30 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                            Avaliações da Comunidade
                        </h1>
                        <p className="text-lg text-gray-300">
                            Veja o que outros cinéfilos estão dizendo sobre seus filmes favoritos
                        </p>
                    </div>

                    <div className="space-y-6">
                        {reviews.map((review) => {
                            const isExpanded = expandedComments[review.id];
                            const commentTooLong = review.comment.length > 300;
                            const displayText = isExpanded ? review.comment : `${review.comment.substring(0, 300)}${review.comment.length > 300 ? "..." : ""}`;
                            const userAvatar = avatars[review.user.email];

                            return (
                                <div
                                    key={review.id}
                                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-amber-500/30 transition-all duration-300"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            {loadingAvatars ? (
                                                <div className="w-14 h-14 rounded-full bg-gray-700 animate-pulse" />
                                            ) : userAvatar ? (
                                                <Image
                                                    src={userAvatar}
                                                    alt="Avatar"
                                                    width={56}
                                                    height={56}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/50"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = `https://ui-avatars.com/api/?name=${review.user.nome[0]}&background=random`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl uppercase">
                                                    {review.user.nome[0]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">{review.user.nome}</h2>
                                                    <p className="text-sm text-amber-400 font-medium">
                                                        {movies[review.movieTmdbId] || "Carregando..."}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span className="ml-1 text-white font-semibold">
                                                            {review.rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(review.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="prose prose-invert max-w-none text-gray-300">
                                                    <p className="whitespace-pre-wrap break-words">
                                                        {displayText}
                                                    </p>
                                                    {commentTooLong && (
                                                        <button
                                                            onClick={() => toggleComment(review.id)}
                                                            className="text-amber-400 hover:text-amber-300 font-medium text-sm mt-1 focus:outline-none transition-colors"
                                                        >
                                                            {isExpanded ? "Mostrar menos" : "Mostrar mais"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}