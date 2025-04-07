"use client";

import { useEffect, useState } from "react";
import { Review } from "@prisma/client";
import ReviewForm from "./ReviewForm";
import { useSession } from "next-auth/react";

type User = {
  id: number;
  email: string;
  nome: string | null;
};

type FullReview = Review & {
  user: User;
};

export default function MovieReviews({ movieTmdbId }: { movieTmdbId: number }) {
  const [reviews, setReviews] = useState<FullReview[]>([]);
  const { data: session } = useSession();

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?movieTmdbId=${movieTmdbId}`);
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-[#f9b17a]">Avaliações dos usuários</h2>

      {session && (
        <ReviewForm
          movieTmdbId={movieTmdbId}
          onReviewSubmitted={fetchReviews}
        />
      )}

      <div className="space-y-6 mt-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#424769] rounded-xl p-4 border border-zinc-700 shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{review.user.nome || review.user.email}</h3>
                <span className="text-[#f9b17a] font-medium">Nota: {review.rating}</span>
              </div>
              <p className="text-gray-200">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhuma avaliação ainda.</p>
        )}
      </div>
    </div>
  );
}
