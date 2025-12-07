
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLearningPaths, deleteLearningPath } from '../../services/dataService';
import { AdminLayout } from '../../components/AdminLayout';
import { Edit2, Search, Trash2, Plus, BookOpen } from 'lucide-react';
import { LearningPath } from '../../types';

export const LearningManager: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPaths(getLearningPaths());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this learning path?')) {
        deleteLearningPath(id);
        setPaths(getLearningPaths()); // Refresh
    }
  }

  const filteredPaths = paths.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Learning Paths</h1>
          <p className="text-slate-500 dark:text-slate-400">Create, edit, and remove learning roadmaps.</p>
        </div>
        <Link 
          to="/admin/learning/new" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Path
        </Link>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search paths..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-teal-500 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-navy-900/50 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Resources</th>
                <th className="px-6 py-4 font-semibold">Content Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredPaths.map(path => {
                // Dynamic resource calculation
                const headings = path.markdown ? (path.markdown.match(/^(#{1,6})\s/gm) || []).length : 0;
                
                return (
                    <tr key={path.id} className="hover:bg-slate-50 dark:hover:bg-navy-700/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                        <div className={`w-8 h-8 rounded bg-gradient-to-br ${path.color}`}></div>
                        {path.title}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                             <BookOpen className="w-3 h-3 text-slate-400" />
                             {headings > 0 ? `${headings}+ Resources` : '0 Resources'}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        {path.markdown && path.markdown.length > 20 ? (
                        <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">Has Content</span>
                        ) : (
                        <span className="bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-1 rounded text-xs">Empty</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Link 
                            to={`/admin/learning/edit/${path.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                            >
                            <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => handleDelete(path.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
