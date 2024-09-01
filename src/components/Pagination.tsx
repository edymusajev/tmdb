import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = [];
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="First page"
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            number === currentPage
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="Last page"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}
