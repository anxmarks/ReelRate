import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMovies(page: number) {
  return useQuery({
    queryKey: ["movies", page],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR&page=${page}`
      );
      return res.data;
    },
  });
}
