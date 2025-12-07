
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabaseToolsService } from '../../services/supabaseDataService';
import { AdminLayout } from '../../components/AdminLayout';
import { Edit2, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import { Tool } from '../../types';

export const ToolsManager: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await supabaseToolsService.getAll();
      setTools(data);
    } catch (error) {
      console.error('Error loading tools:', error);
      alert('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    
    try {
      setDeleting(id);
      await supabaseToolsService.delete(id);
      setTools(tools.filter(t => t.id !== id));
      alert('Tool deleted successfully');
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Failed to delete tool');
    } finally {
      setDeleting(null);
    }
  };

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Tools</h1>
          <p className="text-slate-500 dark:text-slate-400">Add, edit, or remove tools from the directory.</p>
        </div>
        <Link 
          to="/admin/tools/new" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Tool
        </Link>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-teal-500 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
            <p className="text-slate-500 mt-2">Loading tools...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-navy-900/50 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Pricing</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No tools found
                    </td>
                  </tr>
                ) : (
                  filteredTools.map(tool => (
                    <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-navy-700/50">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tool.name}</td>
                      <td className="px-6 py-4">{tool.category}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-xs">{tool.pricing}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/admin/tools/edit/${tool.id}`}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(tool.id)}
                            disabled={deleting === tool.id}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {deleting === tool.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
