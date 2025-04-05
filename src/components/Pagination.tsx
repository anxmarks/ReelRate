
type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  
  export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
      <div className="flex justify-center gap-4 mt-6 text-white">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">{currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    );
  }
  