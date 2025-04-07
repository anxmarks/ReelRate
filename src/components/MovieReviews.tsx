"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import { Star } from "lucide-react";

type MovieReviewsProps = {
  movieTmdbId: number;
  onReviewSubmitted?: () => void; // <- prop opcional para notificar MoviePage
};

type Review = {
  id: string;
  comment: string;
  rating: number;
  user: {
    nome: string;
    email: string;
  };
};

export default function MovieReviews({ movieTmdbId, onReviewSubmitted }: MovieReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);

  const fetchReviews = async () => {
    const res = await axios.get(`/api/reviews?movieTmdbId=${movieTmdbId}`);
    setReviews(res.data);
  };

  const fetchAverage = async () => {
    const res = await axios.get(`/api/ratings?movieTmdbId=${movieTmdbId}`);
    setAverage(res.data.average);
  };

  const handleReviewSubmitted = async () => {
    await fetchReviews();
    await fetchAverage();

    if (onReviewSubmitted) {
      onReviewSubmitted(); // Notifica a página para atualizar a nota
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverage();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Nota dos usuários</h2>
        <div className="flex items-center gap-2 text-[#f9b17a] text-xl">
          <Star className="w-5 h-5 fill-[#f9b17a]" />
          {average !== null ? average : "Sem avaliações"}
        </div>
      </div>

      <ReviewForm movieTmdbId={movieTmdbId} onReviewSubmitted={handleReviewSubmitted} />

      <div className="mt-10 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#424769] p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-[#f9b17a] mb-2">
              <Star className="w-4 h-4 fill-[#f9b17a]" />
              <span>{review.rating}</span>
              <span className="text-sm text-gray-300">por {review.user.nome}</span>
            </div>
            <p className="text-white">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
