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

    return (
        <>
            <Header />
            <div className="min-h-screen mx-auto px-4 pt-30 pb-20 bg-[#2d3250]">
                <h1 className="text-3xl font-bold text-white mb-8">Todas as Avaliações</h1>

                <div className="space-y-6">
                    {reviews.map((review) => {
                        const isExpanded = expandedComments[review.id];
                        const commentTooLong = review.comment.length > 300;
                        const displayText = isExpanded ? review.comment : `${review.comment.substring(0, 300)}${review.comment.length > 300 ? "..." : ""}`;
                        const userAvatar = avatars[review.user.email];

                        return (
                            <div
                                key={review.id}
                                className="bg-[#424769] p-4 rounded-xl shadow-md flex gap-4 items-start"
                            >
                                {loadingAvatars ? (
                                    <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />
                                ) : userAvatar ? (
                                    <Image
                                        src={userAvatar}
                                        alt="Avatar"
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => {
                                            // Fallback para inicial se a imagem falhar ao carregar
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://ui-avatars.com/api/?name=${review.user.nome[0]}&background=random`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl uppercase">
                                        {review.user.nome[0]}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <div className="truncate">
                                            <h2 className="text-white font-semibold truncate">{review.user.nome}</h2>
                                            <p className="text-sm text-gray-300 truncate">
                                                {movies[review.movieTmdbId] || "Carregando..."}
                                            </p>
                                        </div>

                                        <div className="flex items-center text-[#f9b17a] gap-1 text-sm flex-shrink-0">
                                            <Star className="w-4 h-4 fill-[#f9b17a]" />
                                            {review.rating}
                                        </div>
                                    </div>

                                    <div className="text-white mt-2 whitespace-pre-wrap break-words">
                                        {displayText}
                                        {commentTooLong && (
                                            <button
                                                onClick={() => toggleComment(review.id)}
                                                className="text-sm text-[#f9b17a] ml-1 hover:underline focus:outline-none"
                                            >
                                                {isExpanded ? " ver menos" : " ver mais"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </>
    );
}