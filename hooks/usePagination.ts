import { useState, useMemo, useCallback } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationResult<T> {
  paginatedData: T[];
  state: PaginationState;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
}

export function usePagination<T>(
  data: T[],
  initialPageSize: number = 60
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Ensure current page doesn't exceed total pages
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, validCurrentPage, pageSize]);

  const goToPage = useCallback((page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(pageNum);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      goToPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (validCurrentPage > 1) {
      goToPage(validCurrentPage - 1);
    }
  }, [validCurrentPage, goToPage]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  return {
    paginatedData,
    state: {
      currentPage: validCurrentPage,
      pageSize,
      totalItems,
      totalPages: totalPages || 1,
    },
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
}
