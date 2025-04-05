import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSearchMovies(query: string, page: number) {
  return useQuery({
    queryKey: ["searchMovies", query, page],
    enabled: !!query,
    queryFn: async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR&query=${query}&page=${page}`
      );
      return res.data;
    },
  });
}
