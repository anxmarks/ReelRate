type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const generatePagination = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  let l: number = 0;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6 text-white">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50"
      >
        ⬅
      </button>

      {/* Páginas */}
      {pages.map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg transition-all ${
              page === currentPage
                ? "bg-[#f9b17a] text-black font-semibold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-3 py-2 text-zinc-400 select-none">
            ...
          </span>
        )
      )}

      {/* Próxima */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50"
      >
        ➡
      </button>
    </div>
  );
}
