
import React, { useState, useEffect } from 'react';
import { getLearningPaths } from '../services/dataService';
import { LearningCard } from '../components/ui/Cards';
import { BookOpen } from 'lucide-react';
import { LearningPath } from '../types';

export const Learning: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    setPaths(getLearningPaths());
  }, []);

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-xs font-medium text-teal-600 dark:text-teal-400 mb-6">
          <BookOpen className="w-3 h-3" />
          <span>Curated Educational Resources</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Learning Paths</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Step-by-step roadmaps and guides to help you master new technologies. From frontend basics to advanced AI engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paths.map((path) => (
          <LearningCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
};
