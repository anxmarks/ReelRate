type SearchBarProps = {
  value: string;
  onChange: (query: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-10 mt-20 flex justify-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="🔍 Pesquisar filmes..."
        className="w-full max-w-xl px-5 py-3 rounded-full bg-[#424769] text-white placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#f9b17a] transition-all duration-200 shadow-md"
      />
    </div>
  );
}
