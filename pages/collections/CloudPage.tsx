
import React, { useState, useEffect } from 'react';
import { CloudService } from '../../services/dataService';
import { ModernCloudCard } from '../../components/ui/Cards';
import { Cloud, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CloudPage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    setProviders(CloudService.get());
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back Home
      </Link>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Cloud & Hosting Directory</h1>
        <p className="text-slate-600 dark:text-slate-400">Discover the best platforms to deploy your next big idea.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {providers.map(p => (
          <ModernCloudCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
};
