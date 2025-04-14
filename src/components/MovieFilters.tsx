import { SlidersHorizontal, Calendar, Film } from "lucide-react";

type MovieFiltersProps = {
  genre: string;
  year: string;
  onGenreChange: (genre: string) => void;
  onYearChange: (year: string) => void;
};

export default function MovieFilters({
  genre,
  year,
  onGenreChange,
  onYearChange,
}: MovieFiltersProps) {
  return (
    <div className="bg-[#1e2235] border border-[#424769] rounded-2xl p-6 shadow-lg mt-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Gênero */}
        <div className="flex items-center gap-2">
          <Film className="text-[#f9b17a]" size={18} />
          <select
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="bg-[#2d3250] text-white rounded-lg px-4 py-2 shadow-inner border border-[#424769] focus:outline-none focus:ring-2 focus:ring-[#f9b17a]"
          >
            <option value="">Todos os Gêneros</option>
            <option value="28">Ação</option>
            <option value="35">Comédia</option>
            <option value="18">Drama</option>
            <option value="27">Terror</option>
            <option value="10749">Romance</option>
            <option value="878">Ficção Científica</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-[#f9b17a]" size={18} />
          <input
            type="number"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            placeholder="Ano"
            className="bg-[#2d3250] text-white rounded-lg px-4 py-2 w-50 border border-[#424769] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#f9b17a]"
          />
        </div>

       
       
      </div>
    </div>
  );
}
