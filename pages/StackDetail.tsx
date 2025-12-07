
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTechStackBySlug, getToolsByIds } from '../services/dataService';
import { TechStack, Tool } from '../types';
import { ToolCard } from '../components/ui/Cards';
import { Layers, ArrowLeft, Calendar, Share2, Check } from 'lucide-react';

export const StackDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [stack, setStack] = useState<TechStack | undefined>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      setStack(getTechStackBySlug(slug));
    }
  }, [slug]);

  if (!stack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Stack Not Found</h2>
          <Link to="/" className="text-teal-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      {/* Hero */}
      <div className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 pt-28 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/categories" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-2 rounded-lg">
                <Layers className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">Curated Tech Stack</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 max-w-4xl leading-tight">
            {stack.name}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-8">
            {stack.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Updated: {stack.lastUpdated}</span>
            </div>
            <button onClick={handleShare} className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link Copied' : 'Share Stack'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-16">
          {stack.sections.map((section, idx) => {
            const sectionTools = getToolsByIds(section.toolIds);
            
            return (
              <section key={idx} className="scroll-mt-24">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{section.title}</h2>
                    {section.description && (
                      <p className="text-slate-600 dark:text-slate-400">{section.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-12">
                  {sectionTools.length > 0 ? sectionTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  )) : (
                     <p className="text-slate-400 italic">Tools loading...</p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
