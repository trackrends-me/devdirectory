
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Github, Bot } from 'lucide-react';
import { CATEGORY_GROUPS, getFeaturedTools, getLearningPaths, getBlogPosts, AISpotlightService, AIAgentsService, GithubTrendingService, CloudService, SelfHostedService } from '../services/dataService';
import { CategoryCard, ToolCard, GithubCard, ModernCloudCard, ModernSelfHostedCard, LearningCard, BlogCard } from '../components/ui/Cards';
import { AISearchBar } from '../components/AISearchBar';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const featuredTools = getFeaturedTools();
  const [learningPaths, setLearningPaths] = useState(getLearningPaths());
  const [blogPosts, setBlogPosts] = useState(getBlogPosts());
  
  const [aiTools, setAiTools] = useState<any[]>([]);
  const [aiAgents, setAiAgents] = useState<any[]>([]);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [cloudProviders, setCloudProviders] = useState<any[]>([]);
  const [selfHosted, setSelfHosted] = useState<any[]>([]);

  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["AI Tools", "Frameworks", "Open Source", "Databases", "APIs", "DevOps"];

  useEffect(() => {
    setLearningPaths(getLearningPaths());
    setBlogPosts(getBlogPosts());
    setAiTools(AISpotlightService.get());
    setAiAgents(AIAgentsService.get());
    setGithubRepos(GithubTrendingService.get());
    setCloudProviders(CloudService.get());
    setSelfHosted(SelfHostedService.get());
  }, []);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentWord) {
        const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
        return () => clearTimeout(pauseTimer);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        setDisplayText(
          isDeleting 
            ? currentWord.substring(0, displayText.length - 1) 
            : currentWord.substring(0, displayText.length + 1)
        );
      }
    }, typeSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
    "https://www.vectorlogo.zone/logos/docker/docker-icon.svg",
    "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg",
    "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg",
    "https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg",
    "https://www.vectorlogo.zone/logos/figma/figma-icon.svg"
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-slate-50 dark:bg-navy-950">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-white bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob mix-blend-multiply dark:mix-blend-normal"></div>
          <div className="absolute top-40 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-normal"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-primary-600 dark:text-primary-400 mb-8 animate-fade-in shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            v2.0 Now Live: 500+ New AI Tools Added
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Discover the best <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-400 dark:to-blue-500">{displayText}</span>
            <span className="animate-pulse text-primary-500">|</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The curated directory of 5,000+ tools, frameworks, and resources for modern developers. From AI models to UI kits.
          </p>
          <div className="max-w-2xl mx-auto mb-12 relative">
             <AISearchBar />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-navy-900 overflow-hidden">
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
             {[...logos, ...logos].map((logo, index) => {
               const isNextJs = logo.includes('Nextjs-logo');
               return <li key={index}><img src={logo} alt="Tech Logo" className={`${isNextJs ? 'h-5 md:h-6' : 'h-8 md:h-10'} opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 dark:invert`} /></li>;
             })}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50 dark:bg-navy-950">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Ecosystems</h2>
              <p className="text-slate-500 dark:text-slate-400">Jump into the most popular development areas.</p>
            </div>
            <Link to="/categories" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-bold flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORY_GROUPS[0].categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
             {CATEGORY_GROUPS[1].categories.slice(0, 4).map(cat => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-24 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Featured Tools of the Week</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Hand-picked resources that are trending in the community right now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, idx) => (
              <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
             <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Browse All 5,000+ Tools</Link>
          </div>
        </div>
      </section>

      {/* NEW: AI Agents Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-indigo-300 mb-4">
                     <Bot className="w-3 h-3" /> Autonomous Future
                  </div>
                  <h2 className="text-4xl font-bold mb-4">AI Agents</h2>
                  <p className="text-slate-400 text-lg">Powerful frameworks that chain LLMs to perform complex tasks autonomously.</p>
               </div>
               <Link to="/browse?cat=ai-agents" className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
                  Explore Agents <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {aiAgents.map((agent) => (
                  <div key={agent.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1 group">
                     <div className="flex items-start justify-between mb-6">
                        <div className="p-3 bg-white/10 rounded-xl">
                             <img src={agent.logo} alt={agent.name} className="w-8 h-8 object-contain" />
                        </div>
                        <a href={agent.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                        </a>
                     </div>
                     <h3 className="font-bold text-xl mb-2">{agent.name}</h3>
                     <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{agent.description}</p>
                     <div className="flex flex-wrap gap-2 mt-auto">
                        {agent.tags.map((tag: string) => (
                           <span key={tag} className="text-[11px] font-medium bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                             {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* AI Tools Spotlight */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-primary-300 mb-4"><Zap className="w-3 h-3" /> Trending Models</div>
                  <h2 className="text-4xl font-bold mb-4">AI Tools Spotlight</h2>
                  <p className="text-slate-400 text-lg">Latest LLMs, vector databases, and generative models.</p>
               </div>
               <Link to="/browse?group=ai-tools" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-colors flex items-center gap-2">Explore AI Directory <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {aiTools.map((tool) => (
                  <div key={tool.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all hover:-translate-y-1">
                     <div className="flex items-start justify-between mb-4">
                        <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg bg-white/10" />
                        <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">{tool.category}</span>
                     </div>
                     <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                     <p className="text-sm text-slate-400 mb-4 line-clamp-2">{tool.description}</p>
                     <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag: string) => <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300">{tag}</span>)}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* GitHub Trending */}
      <section className="py-20 bg-slate-50 dark:bg-navy-950">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <Github className="w-8 h-8 text-slate-900 dark:text-white" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trending on GitHub</h2>
                </div>
                <Link to="/collection/github" className="text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {githubRepos.map(repo => <GithubCard key={repo.id} repo={repo} />)}
            </div>
         </div>
      </section>

      {/* Cloud Providers */}
      <section className="py-20 bg-white dark:bg-navy-900">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
               <div>
                   <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Cloud & Hosting</h2>
                   <p className="text-slate-600 dark:text-slate-400">Deploy your apps with generous free tiers and developer-friendly platforms.</p>
               </div>
               <Link to="/collection/cloud" className="text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {cloudProviders.slice(0, 4).map(provider => <ModernCloudCard key={provider.id} provider={provider} />)}
            </div>
         </div>
      </section>

      {/* Self-Hosted */}
      <section className="py-20 bg-slate-50 dark:bg-navy-950">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Self-Hosted Alternatives</h2>
                  <p className="text-slate-500 dark:text-slate-400">Own your data with these open-source replacements.</p>
               </div>
               <Link to="/collection/self-hosted" className="text-primary-600 dark:text-primary-400 font-bold text-sm">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {selfHosted.map(tool => <ModernSelfHostedCard key={tool.id} tool={tool} />)}
            </div>
         </div>
      </section>

      {/* Learning & Blog */}
      <section className="py-20 bg-white dark:bg-navy-900">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
               <div className="text-left">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Learning Paths & Roadmaps</h2>
                  <p className="text-slate-600 dark:text-slate-400">Structured guides to help you master new skills.</p>
               </div>
               <Link to="/learning" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-bold flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {learningPaths.slice(0, 8).map(path => <LearningCard key={path.id} path={path} />)}
            </div>
         </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-navy-950">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">Latest from the Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {blogPosts.slice(0, 3).map(post => <BlogCard key={post.id} post={post} />)}
            </div>
         </div>
      </section>
    </div>
  );
};
