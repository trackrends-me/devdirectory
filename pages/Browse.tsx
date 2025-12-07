import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, Layers, Box } from 'lucide-react';
import { getTools, CATEGORY_GROUPS } from '../services/dataService';
import { supabaseToolsService } from '../services/supabaseDataService';
import { ToolCard } from '../components/ui/Cards';
import { Tool } from '../types';
import { Sidebar } from '../components/Sidebar';
import { usePagination } from '../hooks/usePagination';
import { PaginationControls } from '../components/PaginationControls';

export const Browse: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data State
  const [allTools, setAllTools] = useState<Tool[]>([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [minStars, setMinStars] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // UI States
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [activeCategoryData, setActiveCategoryData] = useState<{name: string, description: string, count: number} | null>(null);

  // Load Data
  useEffect(() => {
    const loadTools = async () => {
      try {
        const supabaseTools = await supabaseToolsService.getAll();
        setTools(supabaseTools.length > 0 ? supabaseTools : getTools());
      } catch (error) {
        console.error('Error loading tools from Supabase:', error);
        setTools(getTools());
      }
    };
    loadTools();
  }, []);

  const setTools = (data: Tool[]) => {
    setAllTools(data);
  };

  // Handle URL params and scroll to top
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    const group = params.get('group');
    const q = params.get('q');
    const tag = params.get('tag');

    if (group) {
        setSelectedGroup(group);
        if (!cat) setSelectedCategory('all');
    }
    if (cat) {
        // Find group for this category to open correct section
        const parentGroup = CATEGORY_GROUPS.find(g => g.categories.some(c => c.slug === cat));
        if (parentGroup) setSelectedGroup(parentGroup.slug);
        setSelectedCategory(cat);
    } else if (!group) {
        // Default
        setSelectedGroup('all');
        setSelectedCategory('all');
    }

    if (q) setSearchTerm(q);
    if (tag) setSelectedTags(prev => [...prev, tag]);

    // Scroll to top when URL changes
    window.scrollTo(0, 0);
  }, [location.search]);

  // Update Hero Header Data based on selection
  useEffect(() => {
    if (selectedCategory !== 'all') {
        const cat = CATEGORY_GROUPS.flatMap(g => g.categories).find(c => c.slug === selectedCategory);
        if (cat) {
            const categoryToolCount = allTools.filter(t => t.category === cat.name).length;
            setActiveCategoryData({ 
                name: cat.name, 
                description: cat.description,
                count: categoryToolCount || cat.toolCount
            });
        }
    } else if (selectedGroup !== 'all') {
        const group = CATEGORY_GROUPS.find(g => g.slug === selectedGroup);
        if (group) {
            const categoryNames = group.categories.map(c => c.name);
            const groupToolCount = allTools.filter(t => categoryNames.includes(t.category)).length;
            setActiveCategoryData({ 
                name: group.name, 
                description: `Explore all curated tools in the ${group.name} ecosystem.`,
                count: groupToolCount || group.categories.reduce((acc, c) => acc + c.toolCount, 0)
            });
        }
    } else {
        // All Tools View
        setActiveCategoryData({
            name: "Browse Tools",
            description: "Discover the best developer resources from our curated collection.",
            count: allTools.length
        });
    }
  }, [selectedCategory, selectedGroup, allTools]);

  // Main Filtering Logic
  useEffect(() => {
    let result = allTools;

    if (searchTerm) {
      const lowerQ = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(lowerQ) ||
        t.description.toLowerCase().includes(lowerQ) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQ))
      );
    }

    if (selectedGroup !== 'all') {
      const group = CATEGORY_GROUPS.find(g => g.slug === selectedGroup);
      if (group) {
        if (selectedCategory === 'all') {
             const catNames = group.categories.map(c => c.name);
             result = result.filter(t => catNames.includes(t.category));
        }
      }
    }

    if (selectedCategory !== 'all') {
        const categoryName = CATEGORY_GROUPS.flatMap(g => g.categories).find(c => c.slug === selectedCategory)?.name;
        if (categoryName) {
            result = result.filter(t => t.category === categoryName);
        }
    }

    if (selectedPricing !== 'all') {
      result = result.filter(t => t.pricing === selectedPricing);
    }

    if (minStars > 0) {
      result = result.filter(t => (t.stars || 0) >= minStars);
    }

    if (selectedTags.length > 0) {
      result = result.filter(t => 
        selectedTags.some(tag => t.tags.includes(tag))
      );
    }

    setFilteredTools(result);
  }, [allTools, searchTerm, selectedGroup, selectedCategory, selectedPricing, minStars, selectedTags]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGroup('all');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setMinStars(0);
    setSelectedTags([]);
    navigate('/browse');
  };

  const handleGroupSelect = (slug: string) => {
    // Reset all filters when selecting 'All Categories'
    if (slug === 'all') {
        clearAllFilters();
    } else {
        navigate(`/browse?group=${slug}`);
    }
  };

  const handleCategorySelect = (slug: string) => {
    navigate(`/browse?cat=${slug}`);
  };

  // Pagination
  const { paginatedData, state: paginationState, goToPage, nextPage, prevPage, setPageSize } = usePagination(filteredTools, 60);

  // Reset pagination when filters change
  useEffect(() => {
    goToPage(1);
  }, [searchTerm, selectedGroup, selectedCategory, selectedPricing, minStars, selectedTags, goToPage]);

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-navy-950">
      
      {/* SIDEBAR */}
      <Sidebar 
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        selectedGroup={selectedGroup}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
        minStars={minStars}
        onSelectGroup={handleGroupSelect}
        onSelectCategory={handleCategorySelect}
        onSelectPricing={setSelectedPricing}
        onSelectStars={setMinStars}
        totalToolsCount={allTools.length}
        onClearAllFilters={clearAllFilters}
      />

      {/* === MAIN CONTENT === */}
      <div className="flex-1 w-full min-w-0">
        
        {/* Dynamic Hero Header */}
        <div className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 px-8 py-5">
            <div className="max-w-5xl">
                <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Layers className="w-4 h-4" /> 
                    {selectedGroup !== 'all' ? CATEGORY_GROUPS.find(g => g.slug === selectedGroup)?.name : 'Directory'}
                </div>
                <div className="flex items-baseline gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {activeCategoryData?.name || 'Browse Tools'}
                    </h1>
                    <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-white/5">
                        {activeCategoryData?.count || 0} Tools
                    </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                    {activeCategoryData?.description}
                </p>
            </div>
        </div>

        <div className="p-6 md:p-8">
            {/* Search & Filter Section - Below Hero */}
            <div className="mb-8 space-y-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Filter list by name, tag..." 
                        className="w-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors shadow-sm text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Mobile Filter Button */}
                <button 
                  className="md:hidden w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white font-bold"
                  onClick={() => setIsMobileFiltersOpen(true)}
                >
                  <Filter className="w-5 h-5" /> Filter Tools
                </button>
            </div>

            {/* Results Grid - Paginated */}
            {filteredTools.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedData.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
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
                <div className="text-center py-24 bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-white/5 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Box className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                        Try adjusting your filters or search term to find what you're looking for.
                    </p>
                    <button 
                        onClick={clearAllFilters}
                        className="px-6 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-lg font-medium transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
