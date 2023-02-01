import { useState } from "react";

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const usePagination = ({ totalPages, onPageChange }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  return {
    currentPage,
    handlePrevClick,
    handleNextClick,
  };
};