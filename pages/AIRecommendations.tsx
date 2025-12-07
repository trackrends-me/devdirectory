import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles, ArrowLeft, Search, Filter, ExternalLink, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { getTools } from '../services/dataService';

// Interface for the AI response
interface AIRecommendation {
  name: string;
  description: string; // Added description
  category: string;
  reason: string;
  tags: string[];
  pricing: string;
  websiteUrl?: string; 
  logo?: string; 
}

export const AIRecommendations: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!process.env.API_KEY) {
            throw new Error("API Key is missing. Please check your environment configuration.");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Define the schema for structured JSON output
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a Senior Solutions Architect. The user wants to build: "${query}". 
          Recommend a complete, modern tech stack (6-9 tools) for this specific use case. 
          Focus on popular, production-ready tools (e.g., Next.js, Supabase, Tailwind, Stripe, etc.).
          Provide a specific reason why this tool fits the user's specific request.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the tool (e.g., Next.js)" },
                  description: { type: Type.STRING, description: "A short, punchy description of what the tool is (e.g. 'The React Framework for the Web')." },
                  category: { type: Type.STRING, description: "Category (e.g., Framework, Database)" },
                  reason: { type: Type.STRING, description: "Specific reason why this fits the user's project request." },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 short tags" },
                  pricing: { type: Type.STRING, description: "Free, Freemium, Paid, or Open Source" }
                },
                required: ["name", "description", "category", "reason", "tags", "pricing"]
              }
            }
          }
        });

        if (response.text) {
          // Sanitize response: Remove markdown code blocks if present
          let cleanText = response.text.trim();
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
          
          try {
            const aiData = JSON.parse(cleanText) as AIRecommendation[];
            
            // Enrich AI data with local data (logos, urls) if available
            const localTools = getTools();
            
            const enrichedData = aiData.map(item => {
                // Fuzzy match logic to find tool in local DB
                const match = localTools.find(t => t.name.toLowerCase() === item.name.toLowerCase()) || 
                            localTools.find(t => t.name.toLowerCase().includes(item.name.toLowerCase()));
                
                return {
                ...item,
                // Use local description if available for better quality, otherwise use AI's
                description: match?.shortDescription || item.description,
                logo: match?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff&size=128`,
                websiteUrl: match?.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(item.name + ' tool')}`
                };
            });

            setRecommendations(enrichedData);
          } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Raw Text:", response.text);
            throw new Error("Failed to process AI response. The model returned an invalid format.");
          }
        } else {
            throw new Error("No response received from AI.");
        }
      } catch (err: any) {
        console.error("AI Error:", err);
        setError(err.message || "Unable to generate recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [query]);

  const filteredRecs = filter === 'All' 
    ? recommendations 
    : recommendations.filter(r => r.pricing === filter || r.tags.includes(filter));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pb-20">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 pt-28 pb-10">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-500" />
             </div>
             <span className="text-sm font-bold tracking-wider uppercase text-indigo-500">AI Recommendations</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Recommended Stack
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Based on your request <span className="font-bold text-slate-900 dark:text-white">"{query}"</span>, here are the best tools for the job.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar Area */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-white/5 p-2 mb-10 shadow-sm flex flex-col md:flex-row items-center gap-4">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                value={query} 
                disabled 
                className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-600 dark:text-slate-300 outline-none cursor-not-allowed opacity-70"
              />
           </div>
           <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
           <div className="flex items-center gap-2 px-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {['All', 'Open Source', 'Free', 'Freemium', 'Paid'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    filter === f 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400' 
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 h-64 animate-pulse">
                <div className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl mb-4 w-full"></div>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-slate-200 dark:bg-white/10 rounded-xl"></div>
                   <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
                   </div>
                </div>
                <div className="space-y-2 mt-6">
                   <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full"></div>
                   <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
             <div className="inline-flex bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8" />
             </div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Generation Failed</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">{error}</p>
             <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                Try a different search
             </Link>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && filteredRecs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecs.map((tool, idx) => (
              <div key={idx} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full group">
                
                {/* AI Reason Box (Top, highlighted like screenshot) */}
                <div className="bg-gradient-to-r from-orange-50 to-indigo-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-3 mb-6 border border-indigo-100 dark:border-indigo-500/20">
                   <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-snug">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">AI Suggestion:</span> {tool.reason}
                      </p>
                   </div>
                </div>

                {/* Tool Header */}
                <div className="flex items-start justify-between mb-3">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-navy-950 border border-slate-100 dark:border-white/10 p-2 flex items-center justify-center shadow-sm shrink-0">
                         <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                         <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{tool.name}</h3>
                            <CheckCircle className="w-4 h-4 text-teal-500" />
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mt-0.5">
                            {tool.pricing === 'Open Source' ? (
                                <span className="text-slate-500 dark:text-slate-400">Open Source</span>
                            ) : (
                                <span>{tool.pricing}</span>
                            )}
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="truncate max-w-[100px]">{tool.category}</span>
                         </div>
                      </div>
                   </div>
                   {/* Star Badge if popular */}
                   <div className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span>Top</span>
                   </div>
                </div>

                {/* Description (Added) */}
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-2 leading-relaxed">
                    {tool.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                   {tool.tags.slice(0,3).map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        {tag}
                      </span>
                   ))}
                </div>

                {/* Footer Action */}
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                   Visit Website <ExternalLink className="w-3 h-3" />
                </a>

              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && filteredRecs.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                No recommendations found for this filter.
            </div>
        )}
      </div>
    </div>
  );
};