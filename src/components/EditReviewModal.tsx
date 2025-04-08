"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type EditReviewModalProps = {
  review: {
    id: string;
    rating: number;
    comment: string;
  };
  onClose: () => void;
  onSave: (data: { rating: number; comment: string }) => void;
};

export default function EditReviewModal({ review, onClose, onSave }: EditReviewModalProps) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ rating, comment });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#424769] rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Editar Avaliação</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Edite seu comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg bg-[#2d3250] text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#f9b17a] resize-none"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#f9b17a] text-[#2d3250] font-semibold px-4 py-2 rounded-lg hover:bg-[#f6a25e] transition disabled:opacity-50"
              disabled={isSubmitting || !comment.trim()}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}