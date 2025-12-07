
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPostById, addBlogPost, updateBlogPost } from '../../services/dataService';
import { AdminLayout } from '../../components/AdminLayout';
import { BlogPost } from '../../types';
import { Save, ArrowLeft, Search, Globe, Image as ImageIcon } from 'lucide-react';

export const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: '',
    content: '',
    excerpt: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '5 min',
    coverImage: '',
    author: 'Admin',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      const post = getBlogPostById(id);
      if (post) setFormData(post);
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug from title if not manually edited
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({
        ...prev,
        title,
        slug: isEditing ? prev.slug : slug,
        seoTitle: isEditing ? prev.seoTitle : title
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData: BlogPost = {
      ...formData as BlogPost,
      id: isEditing ? id! : `bp-${Date.now()}`
    };

    if (isEditing) {
      updateBlogPost(postData);
    } else {
      addBlogPost(postData);
    }
    navigate('/admin/blog');
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/admin/blog')} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
             </button>
             <div>
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                 {isEditing ? `Edit Post` : 'New Blog Post'}
               </h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Content and SEO configuration.</p>
             </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
          >
            <Save className="w-4 h-4" /> {isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Info */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Post Title</label>
                        <input 
                            name="title" required value={formData.title} onChange={handleTitleChange}
                            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-lg font-medium dark:text-white"
                            placeholder="e.g. The Future of React"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Slug (URL)</label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 dark:bg-white/5 border border-r-0 border-slate-200 dark:border-white/10 px-3 py-2 rounded-l-lg text-sm text-slate-500">/blog/</span>
                            <input 
                                name="slug" required value={formData.slug} onChange={handleChange}
                                className="flex-1 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-r-lg px-4 py-2 dark:text-white text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Markdown Editor */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col h-[600px]">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content (Markdown)</label>
                    <textarea 
                        name="content" required value={formData.content} onChange={handleChange}
                        className="flex-1 w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg p-4 font-mono text-sm dark:text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                        placeholder="# Start writing..."
                    />
                </div>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
                
                {/* SEO Settings */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
                        <Search className="w-4 h-4 text-teal-500" /> SEO Settings
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SEO Title</label>
                            <input 
                                name="seoTitle" value={formData.seoTitle} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white"
                                placeholder="Title tag for search engines"
                            />
                            <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.seoTitle?.length || 0}/60 chars</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Description</label>
                            <textarea 
                                name="seoDescription" rows={3} value={formData.seoDescription} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white resize-none"
                                placeholder="Summary for search results..."
                            />
                            <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.seoDescription?.length || 0}/160 chars</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Keywords</label>
                            <input 
                                name="seoKeywords" value={formData.seoKeywords} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white"
                                placeholder="comma, separated, keys"
                            />
                        </div>
                    </div>

                    {/* Google Preview */}
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-navy-950 rounded-lg border border-slate-200 dark:border-white/5">
                        <p className="text-xs font-bold text-slate-400 mb-2">Search Preview</p>
                        <div className="font-sans">
                            <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg leading-tight truncate hover:underline cursor-pointer">
                                {formData.seoTitle || formData.title || 'Post Title'}
                            </div>
                            <div className="text-[#006621] dark:text-[#bdc1c6] text-xs my-0.5">
                                devdirectory.net › blog › {formData.slug || 'post-slug'}
                            </div>
                            <div className="text-[#545454] dark:text-[#d0d0d0] text-sm leading-snug line-clamp-2">
                                {formData.seoDescription || formData.excerpt || 'No description provided.'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meta Data */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2 border-b border-slate-100 dark:border-white/5 pb-2">
                        <Globe className="w-4 h-4 text-teal-500" /> Metadata
                    </h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select 
                            name="category" value={formData.category} onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white"
                        >
                            <option value="">Select Category</option>
                            <option value="Architecture">Architecture</option>
                            <option value="AI Tools">AI Tools</option>
                            <option value="Opinion">Opinion</option>
                            <option value="Tutorial">Tutorial</option>
                            <option value="News">News</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Author</label>
                            <input 
                                name="author" value={formData.author} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Read Time</label>
                            <input 
                                name="readTime" value={formData.readTime} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cover Image URL</label>
                        <div className="flex gap-2">
                            <input 
                                name="coverImage" value={formData.coverImage} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white"
                                placeholder="https://..."
                            />
                            <div className="w-10 h-10 shrink-0 bg-slate-100 dark:bg-navy-950 rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center">
                                {formData.coverImage ? (
                                    <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Excerpt</label>
                        <textarea 
                            name="excerpt" rows={3} value={formData.excerpt} onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm dark:text-white resize-none"
                            placeholder="Short summary for blog cards..."
                        />
                    </div>
                </div>

            </div>
        </div>
      </div>
    </AdminLayout>
  );
};
