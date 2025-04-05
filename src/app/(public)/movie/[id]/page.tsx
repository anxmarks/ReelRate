import axios from "axios";

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
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-xl shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-yellow-400 font-semibold mb-4">Nota: {movie.vote_average}</p>
          <p className="text-gray-300">{movie.overview}</p>
          <p className="text-sm text-gray-500 mt-4">Data de lançamento: {movie.release_date}</p>
        </div>
      </div>
    </div>
  );
}
