import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, LayoutGrid, 
  Plus, X, Star, DollarSign, Layers 
} from 'lucide-react';
import { CATEGORY_GROUPS } from '../services/dataService';
import { IconMap } from './ui/Cards';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGroup: string;
  selectedCategory: string;
  selectedPricing: string;
  minStars: number;
  onSelectGroup: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
  onSelectPricing: (pricing: string) => void;
  onSelectStars: (stars: number) => void;
  totalToolsCount: number;
  onClearAllFilters?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedGroup,
  selectedCategory,
  selectedPricing,
  minStars,
  onSelectGroup,
  onSelectCategory,
  onSelectPricing,
  onSelectStars,
  totalToolsCount,
  onClearAllFilters
}) => {
  // State for expanded accordion groups
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['filters', 'tech-development']);

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Helper for active state styles
  const getLinkStyles = (isActive: boolean) => `
    group flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px]
    ${isActive 
      ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-white border-primary-500' 
      : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
    }
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 flex flex-col transition-transform duration-300 ease-in-out border-r
        bg-white dark:bg-[#0A0F2A] border-slate-200 dark:border-[#1e293b]
        md:sticky md:top-16 md:h-[calc(100vh-64px)] md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden h-16 flex items-center px-6 border-b border-slate-200 dark:border-[#1e293b] shrink-0 bg-white dark:bg-[#0A0F2A]">
           <span className="font-bold text-slate-900 dark:text-white">Filters</span>
           <button onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-8">
          
          {/* Main Navigation Links */}
          <div className="px-2 space-y-1">
            <button
              onClick={() => { onClearAllFilters ? onClearAllFilters() : onSelectGroup('all'); }}
              className={getLinkStyles(selectedGroup === 'all' && selectedCategory === 'all')}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className={`w-4 h-4 ${selectedGroup === 'all' && selectedCategory === 'all' ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-500'}`} />
                <span>All Categories</span>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5">
                {totalToolsCount}
              </span>
            </button>
          </div>

          {/* Grouped Accordions */}
          <div className="px-2 space-y-4">
             {/* Section Label */}
             <div className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Ecosystems
             </div>
             
             {CATEGORY_GROUPS.map((group) => {
               const isExpanded = expandedGroups.includes(group.slug);
               const isActiveGroup = selectedGroup === group.slug;

               return (
                 <div key={group.slug} className="space-y-1">
                   {/* Group Header */}
                   <button
                     onClick={() => { toggleGroup(group.slug); onSelectGroup(group.slug); }}
                     className={`w-full flex items-center justify-between px-4 py-2 text-sm font-semibold transition-colors hover:text-slate-900 dark:hover:text-white group ${isActiveGroup ? 'text-slate-900 dark:text-white bg-primary-50 dark:bg-slate-800 border-l-4 border-primary-500' : 'text-slate-500 dark:text-slate-400 border-l-4 border-transparent'}`}
                   >
                     <span>{group.name}</span>
                     {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                   </button>

                   {/* Child Items */}
                   {isExpanded && (
                     <div className="space-y-0.5 animate-slide-up relative">
                       {/* Vertical Guide Line - Enhanced when child is active */}
                       <div className={`absolute left-[19px] top-0 bottom-0 w-px transition-colors duration-200 ${
                         group.categories.some(cat => selectedCategory === cat.slug)
                           ? 'bg-primary-400 dark:bg-primary-500/50'
                           : 'bg-slate-200 dark:bg-[#1e293b]'
                       }`}></div>

                       {group.categories.map((cat) => {
                         const isActive = selectedCategory === cat.slug;
                         // @ts-ignore
                         const Icon = IconMap[cat.icon] || Layers;
                         
                         return (
                           <button
                             key={cat.id}
                             onClick={() => { onSelectGroup(group.slug); onSelectCategory(cat.slug); }}
                             className={`
                               relative flex items-center justify-between w-full pl-10 pr-4 py-2 text-sm transition-all rounded-r-md overflow-visible
                               ${isActive 
                                 ? 'text-primary-600 dark:text-primary-400 font-medium' 
                                 : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}
                             `}
                           >
                             {/* Background highlight contained within bounds */}
                             {isActive && (
                               <div className="absolute left-[19px] top-0 bottom-0 right-0 bg-primary-50 dark:bg-primary-500/15 rounded-r-md z-0"></div>
                             )}
                             <div className="flex items-center gap-3 relative z-10">
                               <Icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                               <span>{cat.name}</span>
                             </div>
                             {isActive && <div className="w-1 h-1 rounded-full bg-primary-500 relative z-10"></div>}
                           </button>
                         );
                       })}
                     </div>
                   )}
                 </div>
               );
             })}
          </div>

          {/* Filters Section */}
          <div className="px-2 space-y-1 pt-4 border-t border-slate-200 dark:border-[#1e293b] mx-4">
             <button
               onClick={() => toggleGroup('filters')}
               className="w-full flex items-center justify-between px-0 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono hover:text-slate-900 dark:hover:text-white"
             >
               <span>Filters</span>
               {expandedGroups.includes('filters') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
             </button>

             {expandedGroups.includes('filters') && (
               <div className="space-y-6 pt-2">
                 {/* Pricing */}
                 <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 px-2">
                        <DollarSign className="w-3 h-3 text-primary-500" /> Pricing
                    </h4>
                    <div className="space-y-1">
                        {['all', 'Free', 'Open Source', 'Freemium', 'Paid'].map(p => (
                            <button
                                key={p}
                                onClick={() => onSelectPricing(p)}
                                className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${selectedPricing === p ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                {p === 'all' ? 'Any Price' : p}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Stars */}
                 <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 px-2">
                        <Star className="w-3 h-3 text-primary-500" /> Stars
                    </h4>
                    <div className="space-y-1">
                        {[0, 1000, 10000, 50000].map(s => (
                            <button
                                key={s}
                                onClick={() => onSelectStars(s)}
                                className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${minStars === s ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                {s === 0 ? 'Any Rating' : `${s/1000}k+ Stars`}
                            </button>
                        ))}
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* 3. Sticky Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0A0F2A] shrink-0">
          <a 
            href="#/submit"
            className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-primary-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Tool</span>
          </a>
        </div>
      </aside>
    </>
  );
};