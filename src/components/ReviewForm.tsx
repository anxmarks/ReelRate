"use client";

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      await axios.post("/api/reviews", {
        movieTmdbId,
        rating,
        comment,
      });
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } finally {
      setLoading(false);
    }
  };

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
