
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, List, ChevronRight } from 'lucide-react';
import { getLearningPathById } from '../services/dataService';
import { LearningPath } from '../types';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const LearningDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [path, setPath] = useState<LearningPath | undefined>();
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (id) {
      const p = getLearningPathById(id);
      setPath(p);
      setLoading(false);
    }
  }, [id]);

  // Extract TOC from markdown content
  useEffect(() => {
    if (path?.markdown) {
      const headings: TOCItem[] = [];
      const lines = path.markdown.split('\n');
      
      lines.forEach(line => {
        // Match ## and ### only
        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          // Simple ID generation matching the index.html logic
          const id = text.toLowerCase().replace(/[^\w]+/g, '-');
          headings.push({ id, text, level });
        }
      });
      
      setToc(headings);
    }
  }, [path]);

  // Scroll spy for active TOC item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -35% 0px' }
    );

    const headings = document.querySelectorAll('h2, h3');
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [path, toc]); // Re-run when content loads

  if (loading) return null;

  if (!path) {
    return <div className="p-20 text-center text-slate-500">Learning Path not found</div>;
  }

  // Safe markdown rendering
  const getMarkdown = () => {
    const content = path.markdown || `
## Coming Soon
We are working on this roadmap. Please check back later.
    `;
    
    // @ts-ignore
    if (window.marked) {
      // @ts-ignore
      return { __html: window.marked.parse(content) };
    }
    return { __html: '<p>Loading markdown parser...</p>' };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* Hero Header */}
      <div className={`bg-gradient-to-br ${path.color} text-white pt-28 pb-24 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/learning" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Learning Paths
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {/* Dynamic Resource Count */}
                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> {toc.length}+ Resources
                </span>
                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-wide">
                  Curated Roadmap
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{path.title}</h1>
              <p className="text-white/80 text-lg max-w-2xl">Master {path.title} with this comprehensive, step-by-step guide.</p>
            </div>
            
            {/* Removed Progress Placeholder */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sticky Sidebar (TOC) - Moved to LEFT */}
          <aside className="lg:w-80 shrink-0 space-y-8 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-slate-200 dark:border-white/5 p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                  <List className="w-4 h-4 text-teal-500" />
                  <span>On this page</span>
                </div>
                
                {toc.length > 0 ? (
                  <nav className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-1">
                      {toc.map((item, idx) => (
                        <li key={`${item.id}-${idx}`}>
                          <a 
                            href={`#${item.id}`}
                            className={`block text-sm py-1.5 transition-colors border-l-2 pl-4 ${
                              activeId === item.id 
                                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-500/10 rounded-r' 
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                            } ${item.level === 3 ? 'ml-2 text-xs' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                              setActiveId(item.id);
                            }}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : (
                  <p className="text-sm text-slate-400 italic">No sections detected.</p>
                )}
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white text-center shadow-lg">
                <h3 className="font-bold text-lg mb-2">Want to contribute?</h3>
                <p className="text-indigo-100 text-sm mb-4">Suggest improvements to this roadmap on GitHub.</p>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white w-full py-2 rounded-lg text-sm font-bold transition-colors">
                  Edit on GitHub
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content - Moved to RIGHT */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            <div className="bg-white dark:bg-navy-900 rounded-xl shadow-xl border border-slate-200 dark:border-white/5 overflow-hidden">
              <div className="p-8 md:p-12">
                <div 
                  className="markdown-body text-slate-700 dark:text-slate-300"
                  dangerouslySetInnerHTML={getMarkdown()} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
