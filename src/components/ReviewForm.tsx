"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Star } from "lucide-react";

type ReviewFormProps = {
  movieTmdbId: number;
  onReviewSubmitted: () => void;
};

export default function ReviewForm({ movieTmdbId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar se o usuário já tem uma review para este filme
  useEffect(() => {
    const checkUserReview = async () => {
      if (!session?.user?.email) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await axios.get(`/api/reviews/check?movieTmdbId=${movieTmdbId}`);
        setHasReview(response.data.hasReview);
      } catch (error) {
        console.error("Erro ao verificar review:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkUserReview();
  }, [movieTmdbId, session?.user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || hasReview) return;

    try {
      setLoading(true);
      await axios.post("/api/reviews", {
        movieTmdbId,
        rating,
        comment,
      });
      setRating(0);
      setComment("");
      setHasReview(true);
      onReviewSubmitted();
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return <div className="mt-6 text-gray-400">Carregando...</div>;
  }

  if (hasReview) {
    return (
      <div className="mt-6 bg-[#424769] p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-white mb-2">Você já avaliou este filme</h3>
        <p className="text-gray-300">Cada usuário pode enviar apenas uma avaliação por filme.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-[#424769] p-6 rounded-xl shadow-md space-y-4">
      <h3 className="text-xl font-bold text-white">Deixe sua avaliação</h3>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition ${
              rating >= star ? "fill-[#f9b17a] stroke-[#f9b17a]" : "stroke-white"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <textarea
        placeholder="Escreva seu comentário..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="w-full p-3 rounded-lg bg-[#2d3250] text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#f9b17a] resize-none"
        required
      />

      <button
        type="submit"
        disabled={loading || rating === 0 || comment.trim() === ""}
        className="bg-[#f9b17a] text-[#2d3250] font-semibold px-5 py-2 rounded-xl hover:bg-[#f6a25e] transition disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}