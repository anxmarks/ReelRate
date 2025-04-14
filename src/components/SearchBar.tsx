import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (query: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mt-20 mb-10 flex justify-center px-4">
      <div className="relative w-full max-w-xl">
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#f9b17a]" size={20} />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar filmes..."
          className="w-full pl-12 pr-5 py-3 rounded-full bg-[#424769] text-white placeholder-[#cbd5e1] border border-[#f9b17a] focus:outline-none focus:ring-2 focus:ring-[#f9b17a] shadow-md transition-all duration-300"
        />
      </div>
    </div>
  );
}
