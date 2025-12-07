
import React, { useState, useEffect } from 'react';
import { GithubTrendingService } from '../../services/dataService';
import { GithubCard } from '../../components/ui/Cards';
import { Github, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GithubPage: React.FC = () => {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    setRepos(GithubTrendingService.get());
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back Home
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-900 text-white rounded-xl">
            <Github className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Trending Repositories</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {repos.map(repo => (
          <GithubCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};
