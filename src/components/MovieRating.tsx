"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

type Props = {
  movieTmdbId: number;
  shouldUpdate?: boolean;
};

export default function MovieRating({ movieTmdbId, shouldUpdate }: Props) {
  const [average, setAverage] = useState<number | null>(null);

  const fetchAverage = async () => {
    const res = await axios.get(`/api/ratings?movieTmdbId=${movieTmdbId}`);
    setAverage(res.data.average);
  };

  useEffect(() => {
    fetchAverage();
  }, [shouldUpdate]);

  return (
    <div className="flex items-center gap-2 text-[#f9b17a] font-semibold text-lg mb-4">
      <Star className="w-5 h-5 fill-[#f9b17a]" />
      {average !== null ? average : "Sem avaliações"}
    </div>
  );
}
