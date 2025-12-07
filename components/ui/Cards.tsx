
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, ExternalLink, ArrowRight, Github, Check, 
  Layout, Server, Layers, Package,
  Cloud, Globe, Terminal, Database,
  Bot, Cpu, Zap,
  Palette, Box, PenTool, Shapes,
  CheckSquare, Wrench, Clock, BookOpen, GitFork,
  Smartphone, Monitor, FileJson, Table, GitMerge,
  HardDrive, Archive, Eye, Mic, Settings, Users,
  Binary, Activity, Code2, Send, AlignLeft, FileCode,
  Wand2, Chrome, Regex, FileDiff, Copy, LayoutDashboard,
  User, Gift, TestTube, Ghost, Map, GraduationCap,
  Code, Network, Briefcase, Bookmark, Book, ThumbsUp,
  FileText, Image, Scissors, Rocket, CreditCard, Lock, DollarSign, Shield,
  TrendingUp, Tag, Share2, Download, Plus, Trash2, Search, X, MessageSquare, Anchor, Link as LinkIcon,
  Scale, HardDriveDownload
} from 'lucide-react';
import { Tool, Category, CloudProvider, SelfHostedTool } from '../../types';
import { UserService } from '../../services/userService';

// Icon Map
export const IconMap: Record<string, React.ElementType> = {
  Layout, Server, Layers, Package, Cloud, Globe, Terminal, Database, Bot, Cpu, Zap, Palette, Box, PenTool, Shapes, CheckSquare, Wrench, Clock, BookOpen, GitFork, Smartphone, Monitor, FileJson, Table, GitMerge, HardDrive, Archive, Eye, Mic, Settings, Users, Binary, Activity, Code2, Send, AlignLeft, FileCode, Wand2, Chrome, Regex, FileDiff, Copy, LayoutDashboard, User, Gift, TestTube, Ghost, Map, GraduationCap, Code, Network, Briefcase, Bookmark, Book, ThumbsUp, FileText, Image, Scissors, Rocket, CreditCard, Lock, DollarSign, Shield, MessageSquare, Anchor, Link: LinkIcon
};

const COMMON_LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'PHP', 'Ruby', 'C#', 'C++', 'Swift', 'Kotlin', 'Dart', 'Elixir', 'HTML', 'CSS', 'Node.js'];
const getSingularCategory = (category: string) => {
  if (category.endsWith('ies')) return category.replace(/ies$/, 'y');
  if (category.endsWith('s') && !category.endsWith('ss')) return category.slice(0, -1);
  return category;
};

export const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(UserService.isBookmarked(tool.id));
  }, [tool.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    UserService.toggleBookmark(tool.id);
    setIsBookmarked(!isBookmarked);
  };

  const language = tool.tags.find(t => COMMON_LANGUAGES.includes(t)) || tool.tags[0] || 'Web';
  const singularCategory = getSingularCategory(tool.category);

  return (
    <div className="group relative bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/5 rounded-2xl p-3 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex gap-3 items-center">
             <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-white/5 flex items-center justify-center p-1.5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
             </div>
             <div>
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-[15px] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{tool.name}</h3>
                    {tool.deal && (
                        <span className="flex h-1.5 w-1.5 relative" title="Active Deal">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                        </span>
                    )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{language}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className={tool.pricing === 'Free' ? 'text-green-600 dark:text-green-400' : ''}>{tool.pricing}</span>
                </div>
             </div>
        </div>
        <button onClick={toggleBookmark} className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isBookmarked ? 'opacity-100 text-primary-600 bg-primary-50 dark:bg-primary-500/10' : 'text-slate-300 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="relative h-[52px] mb-1">
        <div className="absolute inset-0 transition-opacity duration-300 ease-out group-hover:opacity-0 delay-75">
          <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">{tool.shortDescription}</p>
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-center">
            <div className="flex flex-wrap gap-1 mb-1.5">
                {tool.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-md font-medium border border-transparent dark:border-white/5">{tag}</span>
                ))}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-200 dark:border-white/10 pt-1.5">
                {tool.stars ? (
                    <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-current" /><span>{(tool.stars / 1000).toFixed(1)}k</span></div>
                ) : (
                      <div className="flex items-center gap-1"><Activity className="w-3 h-3 text-primary-500" /><span>Trending</span></div>
                )}
                <div className="flex items-center gap-1"><Scale className="w-3 h-3 text-slate-400" /><span>{tool.pricing === 'Open Source' ? 'MIT' : 'Prop.'}</span></div>
            </div>
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto relative z-10 bg-white dark:bg-navy-800">
           <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[65%] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <span className="truncate" title={singularCategory}>{singularCategory}</span>
           </div>
           <Link to={`/tool/${tool.id}`} className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 group/link">
              View <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform text-primary-600" />
           </Link>
      </div>
    </div>
  );
};

export const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const Icon = IconMap[category.icon] || Layers;
  return (
    <Link to={`/browse?cat=${category.slug}`} className="block group bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/5 hover:border-primary-500/30 rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate mr-2">{category.name}</h3>
          <span className="shrink-0 text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{category.toolCount}</span>
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">{category.description}</p>
      </div>
    </Link>
  );
};

export const GithubCard: React.FC<{ repo: any }> = ({ repo }) => (
  <a href={repo.url} target="_blank" rel="noreferrer" className="group block bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/5 rounded-xl p-4 hover:border-primary-500/50 transition-all hover:shadow-lg h-full flex flex-col">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
            <Github className="w-5 h-5 text-slate-900 dark:text-white" />
        </div>
        <div>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors text-sm">{repo.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                <span className="text-xs text-slate-500">{repo.language}</span>
            </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-full">
        <Star className="w-3 h-3 fill-current" />
        {repo.stars}
      </div>
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-1">{repo.description}</p>
    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
      <span className="flex items-center gap-1 hover:text-primary-600 cursor-pointer"><GitFork className="w-3 h-3" /> Fork Repo</span>
      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
    </div>
  </a>
);

export const ModernCloudCard: React.FC<{ provider: CloudProvider }> = ({ provider }) => (
  <a href={provider.url} target="_blank" rel="noreferrer" className="group block bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/5 rounded-xl p-5 hover:shadow-xl hover:shadow-primary-500/10 transition-all hover:-translate-y-1 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-2">
       <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
           provider.tier.includes('Free') 
           ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
           : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400'
       }`}>
           {provider.tier}
       </span>
    </div>
    
    <div className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-white/5 p-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <img src={provider.logo} alt={provider.name} className="w-full h-full object-contain" />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{provider.name}</h3>
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-4 uppercase tracking-wider">{provider.type}</p>
        
        {provider.features && (
            <div className="space-y-1 mb-4 flex-1">
                {provider.features.slice(0, 2).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Check className="w-3 h-3 text-primary-500" /> {feat}
                    </div>
                ))}
            </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
            <span>Visit Platform</span>
            <ExternalLink className="w-4 h-4" />
        </div>
    </div>
  </a>
);

export const ModernSelfHostedCard: React.FC<{ tool: SelfHostedTool }> = ({ tool }) => (
  <div className="group bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all hover:-translate-y-1">
    <div className="p-5 flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/5 flex items-center justify-center p-2 shrink-0">
            <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{tool.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">
                <span className="bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-500/20 font-medium whitespace-nowrap">
                    Vs. {tool.alternativeTo}
                </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {tool.description}
            </p>
        </div>
    </div>
    <div className="bg-slate-50 dark:bg-navy-950/50 px-5 py-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <HardDriveDownload className="w-3.5 h-3.5" /> Self-Hostable
        </div>
        <a href={tool.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline">
            Get Started <ArrowRight className="w-3 h-3" />
        </a>
    </div>
  </div>
);

export const LearningCard: React.FC<{ path: any }> = ({ path }) => {
  const isUrlIcon = path.icon && (path.icon.startsWith('http') || path.icon.startsWith('/'));
  const Icon = !isUrlIcon ? (IconMap[path.icon] || BookOpen) : null;
  let countLabel = path.count.replace(/Steps?/i, 'Resources');
  if (path.markdown) {
    const headings = (path.markdown.match(/^(#{1,6})\s/gm) || []).length;
    if (headings > 0) {
      countLabel = `${headings}+ Resources`;
    }
  }
  return (
    <Link to={`/learning/${path.id}`} className={`block group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${path.color} text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}>
      <div className="relative z-10">
        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 overflow-hidden border border-white/20">
          {isUrlIcon ? (<img src={path.icon} alt="" className="w-full h-full object-cover" />) : (<Icon className="w-4 h-4 text-white" />)}
        </div>
        <h3 className="text-base font-bold mb-0.5">{path.title}</h3>
        <p className="text-white/80 text-xs font-medium mb-3">{countLabel}</p>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90 bg-white/20 inline-flex px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/30 transition-colors">
           <span>Start Learning</span>
           <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      {!isUrlIcon && Icon && <Icon className="absolute -right-4 -bottom-4 w-16 h-16 text-white/10 rotate-12" />}
    </Link>
  );
};

export const BlogCard: React.FC<{ post: any }> = ({ post }) => (
  <article className="group cursor-pointer">
    <div className="aspect-video bg-slate-200 dark:bg-navy-800 rounded-xl mb-3 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/50 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 dark:text-white">{post.category}</span>
    </div>
    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h3>
    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</div>
      <span>•</span>
      <span>{post.date}</span>
    </div>
  </article>
);
