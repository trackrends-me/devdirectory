
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

export const AISearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate AI "Thinking" delay for effect before navigating
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/ai-recommendations?q=${encodeURIComponent(query)}`);
    }, 800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-30">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Magical Glow Effect: Blurred gradient background */}
        <div 
            className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-2xl blur-xl transition-opacity duration-500 ${
                isFocused ? 'opacity-40' : 'opacity-20 group-hover:opacity-30'
            }`}
        ></div>

        {/* Input Wrapper: Pill/Rounded-xl container */}
        <div className={`
            relative flex items-center bg-white dark:bg-navy-900 
            border transition-all duration-300 rounded-xl p-2 shadow-xl
            ${isFocused ? 'border-indigo-500/50 scale-[1.01]' : 'border-slate-200 dark:border-white/10'}
        `}>
          
          {/* Left Icon: Sparkles or Spinner */}
          <div className="pl-4 pr-3 text-slate-400">
            {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            ) : (
                <Sparkles className={`w-6 h-6 ${isFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
            )}
          </div>

          {/* Input Field: Borderless, transparent */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your project (e.g., 'I need a full stack for an e-commerce app')..."
            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 h-12"
            disabled={isLoading}
          />

          {/* Action Button: Ask AI */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ml-2
                ${isLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-white/5' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                }
            `}
          >
            {isLoading ? (
                <span className="flex items-center gap-2">Thinking...</span>
            ) : (
                <>
                    Ask AI <ArrowRight className="w-4 h-4" />
                </>
            )}
          </button>
        </div>
      </form>

      {/* Footer Text */}
      <div className="text-center mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-medium opacity-80">
        <Sparkles className="w-3 h-3" />
        <span>Powered by Gemini • AI Curated Results</span>
      </div>
    </div>
  );
};
