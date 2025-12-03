import React from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate visible page numbers (like 1,2,3,...,30)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-center md:justify-between py-3 flex-wrap gap-5">
      {/* Info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{totalItems}</span> Files
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-1">
        {/* Prev */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          <BsArrowLeftShort />
          <span>Prev</span>
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-1 text-sm">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(Number(page))}
              className={`px-3 py-1 text-sm border rounded-md cursor-pointer ${
                currentPage === page
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Next</span>
          <BsArrowRightShort />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
