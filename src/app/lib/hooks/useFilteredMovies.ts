import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface FilterOptions {
  query: string;
  genre: string;
  year: string;
  page: number;
}

const fetchFilteredMovies = async ({ query, genre, year, page }: FilterOptions) => {
  const params: any = {
    api_key: API_KEY,
    language: "pt-BR",
    page,
    include_adult: false,
    adult: false,
  };

  let endpoint = "";

  if (query) {
    endpoint = `${BASE_URL}/search/movie`;
    params.query = query;
  } else {
    endpoint = `${BASE_URL}/discover/movie`;
    if (genre) params.with_genres = genre;
    if (year) params.primary_release_year = year;
    params.sort_by = "popularity.desc";
  }

  const response = await axios.get(endpoint, { params });

  const filteredResults = response.data.results.filter((movie: any) => !movie.adult);

  return { ...response.data, results: filteredResults };
};

export const useFilteredMovies = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ["filteredMovies", filters],
    queryFn: () => fetchFilteredMovies(filters),
  });
};
