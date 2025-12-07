import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { CATEGORY_GROUPS } from '../services/dataService';
import { CategoryCard } from '../components/ui/Cards';
import { usePagination } from '../hooks/usePagination';
import { PaginationControls } from '../components/PaginationControls';

export const AllCategories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredGroups = CATEGORY_GROUPS.map(group => ({
    ...group,
    categories: group.categories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.categories.length > 0 || searchTerm === '');

  // Flatten categories for pagination
  const allCategories = filteredGroups.flatMap(group => 
    group.categories.map(cat => ({ ...cat, groupName: group.name, groupSlug: group.slug }))
  );

  // Scroll to top when page content changes significantly
  useEffect(() => {
    // Only scroll if search term changed (not on initial mount)
    if (searchTerm) {
      window.scrollTo(0, 0);
    }
  }, [filteredGroups]);

  // Pagination setup
  const { paginatedData, state: paginationState, goToPage, nextPage, prevPage, setPageSize } = usePagination(allCategories, 80);

  // Reset pagination when search term changes
  useEffect(() => {
    goToPage(1);
  }, [searchTerm, goToPage]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handlePrev = () => {
    prevPage();
  };

  const handleNext = () => {
    nextPage();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Browse by Category</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm">Explore our organized collection of developer tools across various ecosystems.</p>
          </div>
        </div>
      </div>

      {/* Search Bar - Below Hero */}
      <div className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 px-6 py-4">
        <div className="container mx-auto">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 pl-10 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 py-12">
        <div className="container mx-auto px-6">
          {allCategories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {paginatedData.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>

              {/* Pagination Controls */}
              <PaginationControls 
                currentPage={paginationState.currentPage}
                totalPages={paginationState.totalPages}
                totalItems={paginationState.totalItems}
                pageSize={paginationState.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">No categories found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
