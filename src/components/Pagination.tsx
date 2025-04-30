type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const generatePagination = (
  currentPage: number,
  totalPages: number,
  blockSize: number = 10
) => {
  const currentBlock = Math.ceil(currentPage / blockSize);
  const startPage = (currentBlock - 1) * blockSize + 1;
  const endPage = Math.min(currentBlock * blockSize, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return {
    pages,
    hasPreviousBlock: startPage > 1,
    hasNextBlock: endPage < totalPages,
  };
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const blockSize = 10; // Número de páginas por bloco
  const { pages, hasPreviousBlock, hasNextBlock } = generatePagination(
    currentPage,
    totalPages,
    blockSize
  );

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6 text-white">
      {/* Botão para o bloco anterior */}
      {hasPreviousBlock && (
        <button
          onClick={() => onPageChange(pages[0] - 1)}
          className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all"
        >
          {"<<"}
        </button>
      )}

      {/* Botão para a página anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-all"
      >
        ⬅
      </button>

      {/* Páginas do bloco atual */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition-all ${
            page === currentPage
              ? "bg-[#f9b17a] text-black font-semibold"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Botão para a próxima página */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-all"
      >
        ➡
      </button>

      {/* Botão para o próximo bloco */}
      {hasNextBlock && (
        <button
          onClick={() => onPageChange(pages[pages.length - 1] + 1)}
          className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all"
        >
          {">>"}
        </button>
      )}
    </div>
  );
}