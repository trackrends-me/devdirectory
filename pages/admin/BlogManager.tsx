
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, deleteBlogPost } from '../../services/dataService';
import { AdminLayout } from '../../components/AdminLayout';
import { Edit2, Trash2, Plus, Search, FileText } from 'lucide-react';
import { BlogPost } from '../../types';

export const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteBlogPost(id);
      setPosts(getBlogPosts()); // Refresh list
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Blog</h1>
          <p className="text-slate-500 dark:text-slate-400">Write, edit, and optimize your blog content.</p>
        </div>
        <Link 
          to="/admin/blog/new" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Write New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search posts..." 
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
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">SEO</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-navy-700/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-xs">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 dark:text-green-400 font-medium text-xs">Published</span>
                  </td>
                  <td className="px-6 py-4">
                    {post.seoTitle && post.seoDescription ? (
                        <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">Optimized</span>
                    ) : (
                        <span className="text-orange-500 text-xs">Missing Info</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/blog/edit/${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
