
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningPathById, updateLearningPath, addLearningPath } from '../../services/dataService';
import { AdminLayout } from '../../components/AdminLayout';
import { LearningPath } from '../../types';
import { LearningCard, IconMap } from '../../components/ui/Cards';
import { Save, ArrowLeft, Image as ImageIcon, Grid } from 'lucide-react';

const COLORS = [
  'from-pink-500 to-rose-500',
  'from-violet-600 to-indigo-600',
  'from-blue-600 to-cyan-600',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-green-500 to-emerald-600',
  'from-gray-600 to-gray-800',
  'from-yellow-500 to-orange-500',
  'from-red-600 to-red-800',
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-lime-500 to-green-500',
  'from-fuchsia-500 to-purple-600',
  'from-stone-500 to-stone-700',
  'from-indigo-400 to-blue-400',
  'from-sky-400 to-blue-500',
  'from-yellow-400 to-yellow-600',
  'from-blue-700 to-indigo-800',
  'from-orange-400 to-orange-600',
  'from-blue-500 to-blue-700',
  'from-orange-600 to-red-600',
  'from-cyan-400 to-cyan-600',
  'from-pink-600 to-rose-600',
  'from-slate-700 to-slate-900',
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
];

export const LearningEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<LearningPath>>({
    title: '',
    count: '0 Resources',
    color: COLORS[0],
    icon: 'Layout',
    markdown: ''
  });

  const [iconMode, setIconMode] = useState<'library' | 'custom'>('library');

  useEffect(() => {
    if (isEditing && id) {
      const p = getLearningPathById(id);
      if (p) {
        setFormData(p);
        if (p.icon && p.icon.startsWith('http')) {
          setIconMode('custom');
        }
      }
    }
  }, [id, isEditing]);

  const handleSave = () => {
    // Calculate resource count for the card display
    const resourceCount = formData.markdown ? (formData.markdown.match(/^(#{1,6})\s/gm) || []).length : 0;
    const countString = `${resourceCount} Resources`;

    const pathData: LearningPath = {
        id: isEditing ? id! : `lp-${Date.now()}`,
        title: formData.title || 'Untitled Path',
        count: countString,
        color: formData.color || COLORS[0],
        icon: formData.icon || 'Layout',
        markdown: formData.markdown || ''
    };

    if (isEditing) {
      updateLearningPath(pathData);
    } else {
      addLearningPath(pathData);
    }
    navigate('/admin/learning');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/admin/learning')} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
             </button>
             <div>
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                 {isEditing ? `Edit: ${formData.title}` : 'Create New Learning Path'}
               </h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Design the card and write course content.</p>
             </div>
          </div>
          <button 
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* LEFT COLUMN: Metadata Form */}
          <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Live Card Preview */}
            <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Preview</h3>
                <div className="max-w-sm mx-auto">
                    <LearningCard path={{...formData, id: 'preview', count: 'Preview Resources'}} />
                </div>
            </div>

            {/* 1. Basic Info */}
            <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
               <h3 className="font-bold text-slate-900 dark:text-white mb-2">Card Details</h3>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                  <input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="e.g. React Mastery"
                  />
               </div>
            </div>

            {/* 2. Icon Selection */}
            <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Icon</h3>
                    <div className="flex bg-slate-100 dark:bg-navy-950 p-1 rounded-lg">
                        <button 
                          onClick={() => setIconMode('library')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${iconMode === 'library' ? 'bg-white dark:bg-navy-800 shadow text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Grid className="w-3 h-3 inline mr-1" /> Library
                        </button>
                        <button 
                           onClick={() => setIconMode('custom')}
                           className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${iconMode === 'custom' ? 'bg-white dark:bg-navy-800 shadow text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <ImageIcon className="w-3 h-3 inline mr-1" /> Custom URL
                        </button>
                    </div>
                </div>

                {iconMode === 'library' ? (
                    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {Object.keys(IconMap).map(iconKey => {
                            // @ts-ignore
                            const Icon = IconMap[iconKey];
                            return (
                                <button
                                key={iconKey}
                                onClick={() => setFormData({...formData, icon: iconKey})}
                                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                                    formData.icon === iconKey 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
                                }`}
                                title={iconKey}
                                >
                                <Icon className="w-5 h-5" />
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                        <input 
                            value={formData.icon?.startsWith('http') ? formData.icon : ''}
                            onChange={(e) => setFormData({...formData, icon: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 text-xs"
                            placeholder="https://example.com/logo.png"
                        />
                        <p className="text-[10px] text-slate-400 mt-2">Paste a direct link to a PNG/JPG/SVG image.</p>
                    </div>
                )}
            </div>

            {/* 3. Color Picker */}
            <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Gradient Color</h3>
                <div className="grid grid-cols-4 gap-2">
                    {COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setFormData({...formData, color: c})}
                          className={`w-full aspect-square rounded-lg bg-gradient-to-br ${c} transition-transform hover:scale-105 ${formData.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : 'opacity-80 hover:opacity-100'}`}
                        />
                    ))}
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Markdown Editor & Preview */}
          <div className="xl:col-span-2 flex flex-col h-full min-h-0">
             <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Editor */}
                <div className="flex-1 flex flex-col h-full">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Markdown Content</label>
                    <textarea 
                    value={formData.markdown}
                    onChange={(e) => setFormData({...formData, markdown: e.target.value})}
                    className="flex-1 w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl p-4 font-mono text-sm text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none resize-none"
                    placeholder="# Course Introduction\n\nStart writing here..."
                    />
                </div>

                {/* Preview */}
                <div className="flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden hidden lg:flex">
                    <div className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 px-4 py-2 text-xs font-bold text-slate-500 uppercase">
                        Live Preview
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* @ts-ignore */}
                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(formData.markdown || '') : 'Loading preview...' }} />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
