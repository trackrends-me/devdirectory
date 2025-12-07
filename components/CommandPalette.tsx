import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Home, Layers, Zap, Moon, Sun, Monitor, Code } from 'lucide-react';
import { getTools } from '../services/dataService';
import { Tool } from '../types';

interface CommandPaletteProps {
  onClose: () => void;
  isOpen: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, isOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const allTools = getTools();
      const filtered = allTools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleTheme = () => {
    const current = localStorage.getItem('theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4">
      <div className="bg-white dark:bg-navy-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-white/5">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            autoFocus
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-slate-500">ESC</div>
        </div>

        <div className="py-2">
          {query.length === 0 && (
            <>
              <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Navigation</div>
              <CommandItem icon={Home} label="Go to Home" onClick={() => handleNavigate('/')} />
              <CommandItem icon={Search} label="Browse Tools" onClick={() => handleNavigate('/browse')} />
              <CommandItem icon={Layers} label="Categories" onClick={() => handleNavigate('/categories')} />
              <CommandItem icon={Code} label="Stack Builder" onClick={() => handleNavigate('/stack-builder')} />
              
              <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase mt-2">System</div>
              <CommandItem icon={Sun} label="Toggle Theme" onClick={toggleTheme} />
            </>
          )}

          {results.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Tools</div>
              {results.map(tool => (
                <button 
                  key={tool.id}
                  onClick={() => handleNavigate(`/tool/${tool.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 text-left transition-colors"
                >
                  <img src={tool.logo} className="w-6 h-6 rounded" alt="" />
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{tool.name}</div>
                    <div className="text-xs text-slate-500">{tool.category}</div>
                  </div>
                </button>
              ))}
            </>
          )}
          
          {query.length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              No results found.
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-navy-950 px-4 py-2 text-xs text-slate-500 flex justify-between">
          <span>Search 5,000+ tools</span>
          <span><span className="font-bold">ProTip:</span> Use arrows to navigate</span>
        </div>
      </div>
    </div>
  );
};

const CommandItem = ({ icon: Icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors text-sm font-medium">
    <Icon className="w-4 h-4" />
    {label}
  </button>
);