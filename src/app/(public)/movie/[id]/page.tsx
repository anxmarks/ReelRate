import Footer from "@/components/Footer";
import Header from "@/components/header";
import axios from "axios";
import { CalendarDays, Star } from "lucide-react";
import MovieReviews from "@/components/MovieReviews";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage(props: MoviePageProps) {
  const params = await props.params;
  const { id } = params;

  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
  );
  const movie = res.data;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#2d3250] text-white px-6 py-10 mt-10">
        <div className="max-w-5xl mx-auto bg-[#424769] rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-[300px] rounded-xl shadow-lg object-cover"
          />

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

              <div className="flex items-center gap-2 text-[#f9b17a] font-semibold text-lg mb-4">
                <Star className="w-5 h-5 fill-[#f9b17a]" />
                {movie.vote_average}
              </div>

              <p className="text-gray-200 leading-relaxed">{movie.overview}</p>
            </div>

            <div className="flex items-center gap-2 mt-6 text-gray-400 text-sm">
              <CalendarDays className="w-4 h-4" />
              <span>Data de lançamento: {movie.release_date}</span>
            </div>
          </div>
        </div>

        <MovieReviews movieTmdbId={parseInt(id)} />
      </div>
      <Footer />
    </>
  );
}
