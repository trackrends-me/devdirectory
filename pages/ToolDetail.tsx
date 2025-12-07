import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTools, getToolsByCategory } from '../services/dataService';
import { ToolCard } from '../components/ui/Cards';
import { UserService } from '../services/userService';
import { ExternalLink, Github, Check, Share2, Tag, Edit, AlertCircle, Bookmark, TrendingUp } from 'lucide-react';

export const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tools = getTools();
  const tool = tools.find(t => t.id === id);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (tool) {
      setIsBookmarked(UserService.isBookmarked(tool.id));
    }
  }, [tool]);

  if (!tool) {
    return <div className="p-20 text-center text-slate-500">Tool not found</div>;
  }

  const toggleBookmark = () => {
    UserService.toggleBookmark(tool.id);
    setIsBookmarked(!isBookmarked);
  };

  // Logic for finding alternatives
  let alternatives = [];
  if (tool.alternativeTo) {
    const altNames = tool.alternativeTo.split(',').map(s => s.trim().toLowerCase());
    alternatives = tools.filter(t => altNames.includes(t.name.toLowerCase()));
  } 
  // If no explicit alternatives, fallback to same category
  if (alternatives.length === 0) {
    alternatives = getToolsByCategory(tool.category.toLowerCase().replace(/\s+/g, '-')).filter(t => t.id !== tool.id).slice(0, 3);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-navy-800/50 border-b border-slate-200 dark:border-white/5 pt-10 pb-16 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <Link to="/browse" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 inline-block text-sm">&larr; Back to Browse</Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src={tool.logo} alt={tool.name} className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10" />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{tool.name}</h1>
                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                  {tool.category}
                </span>
                {(tool.starsWeekly || 0) > 100 && (
                   <span className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-500/20">
                     <TrendingUp className="w-3 h-3" /> Trending
                   </span>
                )}
              </div>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-6">
                {tool.shortDescription}
              </p>
              
              {tool.deal && (
                <div className="mb-6 inline-block bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-1">
                    <Tag className="w-4 h-4" /> Exclusive Deal
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {tool.deal} {tool.dealUrl && <a href={tool.dealUrl} className="underline font-bold ml-1">Claim Offer &rarr;</a>}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mb-8">
                {tool.tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm bg-slate-100 dark:bg-navy-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-white/5">
                    <Tag className="w-3 h-3" /> {tag}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white dark:text-navy-900 font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
                >
                  Visit Website <ExternalLink className="w-4 h-4" />
                </a>
                {tool.githubUrl && (
                  <a 
                    href={tool.githubUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-medium rounded-xl flex items-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    <Github className="w-4 h-4" /> View Source
                  </a>
                )}
                <button 
                  onClick={toggleBookmark}
                  className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 font-medium ${isBookmarked ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 text-teal-600 dark:text-teal-400' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-navy-950 p-6 rounded-xl border border-slate-200 dark:border-white/5 min-w-[250px]">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">At a Glance</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pricing</span>
                  <span className="text-slate-900 dark:text-white font-medium">{tool.pricing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Popularity</span>
                  <span className="text-slate-900 dark:text-white font-medium flex items-center gap-1">
                    {tool.stars?.toLocaleString()} stars
                  </span>
                </div>
                {tool.alternativeTo && (
                  <div>
                     <span className="block text-slate-500 mb-1">Alternative to</span>
                     <span className="text-slate-900 dark:text-white font-medium">{tool.alternativeTo}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                 <button className="text-xs text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 transition-colors">
                    <Edit className="w-3 h-3" /> Suggest an edit
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs (Simulated) */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Overview</h2>
              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-300">
                <p>{tool.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-navy-800/30 p-4 rounded-lg border border-slate-200 dark:border-white/5 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-1"><Check className="w-3 h-3" /></div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm">High Performance</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Optimized for speed and efficiency.</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-navy-800/30 p-4 rounded-lg border border-slate-200 dark:border-white/5 flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-1"><Check className="w-3 h-3" /></div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm">Developer Experience</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Best-in-class tooling and docs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Similar Tools & Alternatives</h3>
            <div className="space-y-4">
              {alternatives.length > 0 ? alternatives.map(rt => (
                <ToolCard key={rt.id} tool={rt} />
              )) : (
                <p className="text-slate-500">No related tools found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};