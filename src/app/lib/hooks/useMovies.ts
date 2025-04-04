import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const fetchMovies = async () => {
  const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`);
  return res.data.results;
};

export function useMovies() {
  return useQuery({ queryKey: ["movies"], queryFn: fetchMovies });
}
