type SearchBarProps = {
    value: string;
    onChange: (query: string) => void;
  };
  
  export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
      <div className="mb-6 mt-30 flex justify-center gap-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar filmes..."
          className="w-full max-w-md px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none"
        />
      </div>
    );
  }
  