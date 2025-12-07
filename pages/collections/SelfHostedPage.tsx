
import React, { useState, useEffect } from 'react';
import { SelfHostedService } from '../../services/dataService';
import { ModernSelfHostedCard } from '../../components/ui/Cards';
import { Server, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SelfHostedPage: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    setTools(SelfHostedService.get());
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back Home
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-900 text-white rounded-xl">
            <Server className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Self-Hosted Alternatives</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map(tool => (
          <ModernSelfHostedCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};
