"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import { Star, Edit, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import EditReviewModal from "./EditReviewModal";

type MovieReviewsProps = {
  movieTmdbId: number;
  onReviewSubmitted?: () => void;
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
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set());
  const { data: session, status } = useSession();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (onReviewSubmitted) onReviewSubmitted();
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
      try {
        await axios.delete(`/api/reviews?id=${reviewId}`);
        await handleReviewSubmitted();
      } catch (error) {
        console.error("Erro ao excluir review:", error);
      }
  };

  const handleUpdateReview = async (updatedData: { rating: number; comment: string }) => {
    if (!editingReview) return;

    try {
      await axios.put("/api/reviews", {
        id: editingReview.id,
        ...updatedData,
      });
      setIsModalOpen(false);
      await handleReviewSubmitted();
    } catch (error) {
      console.error("Erro ao atualizar review:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverage();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedReviewIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderReviewCard = (review: Review) => {
    const isExpanded = expandedReviewIds.has(review.id);
    const isLong = review.comment.length > 300;
    const isOwner = session?.user?.email === review.user.email;

    return (
      <div key={review.id} className="bg-[#424769] p-4 rounded-lg shadow-md relative">
        {isOwner && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => handleEditReview(review)}
              className="text-gray-300 hover:text-[#f9b17a] transition"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteReview(review.id)}
              className="text-gray-300 hover:text-red-500 transition"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-[#f9b17a] mb-2">
          <Star className="w-4 h-4 fill-[#f9b17a]" />
          <span>{review.rating}</span>
          <span className="text-sm text-gray-300">por {review.user.nome}</span>
        </div>
        <p
          className={clsx(
            "text-white break-words transition-all duration-300",
            !isExpanded && isLong && "line-clamp-4"
          )}
        >
          {review.comment}
        </p>
        {isLong && (
          <button
            onClick={() => toggleExpand(review.id)}
            className="text-sm text-blue-300 hover:underline mt-2"
          >
            {isExpanded ? "Ver menos" : "Ver mais"}
          </button>
        )}
      </div>
    );
  };

  const userEmail = session?.user?.email;
  const userReview = reviews.find((r) => r.user.email === userEmail);
  const otherReviews = reviews.filter((r) => r.user.email !== userEmail);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Nota dos usuários</h2>
        <div className="flex items-center gap-2 text-[#f9b17a] text-xl">
          <Star className="w-5 h-5 fill-[#f9b17a]" />
          {average !== null ? average : "Sem avaliações"}
        </div>
      </div>

      {status === "authenticated" && !userReview && (
        <ReviewForm movieTmdbId={movieTmdbId} onReviewSubmitted={handleReviewSubmitted} />
      )}

      <div className="mt-10 space-y-4">
        {userReview && renderReviewCard(userReview)}
        {otherReviews.map((review) => renderReviewCard(review))}
      </div>

      {isModalOpen && editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateReview}
        />
      )}
    </div>
  );
}