import { useQueries } from "@tanstack/react-query";
import axios from "axios";

export const useMovieRatings = (movieIds: number[]) => {
  const queries = useQueries({
    queries: movieIds.map((id) => ({
      queryKey: ["movie-rating", id],
      queryFn: async () => {
        const res = await axios.get(`/api/ratings?movieTmdbId=${id}`);
        return res.data.average;
      },
      staleTime: 1000 * 60 * 5,
    })),
  });

  return queries.map((q) => q.data);
};
