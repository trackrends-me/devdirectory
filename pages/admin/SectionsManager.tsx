
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  AISpotlightService, AIAgentsService, GithubTrendingService, CloudService, SelfHostedService 
} from '../../services/dataService';
import { Trash2, Plus, Zap, Github, Cloud, Server, Bot, Edit2 } from 'lucide-react';

type SectionType = 'ai' | 'agents' | 'github' | 'cloud' | 'selfhosted';

export const SectionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionType>('ai');
  const [data, setData] = useState<any[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
    resetForm();
  }, [activeTab]);

  const resetForm = () => {
      setFormData({});
      setEditingId(null);
  }

  const loadData = () => {
    switch (activeTab) {
      case 'ai': setData(AISpotlightService.get()); break;
      case 'agents': setData(AIAgentsService.get()); break;
      case 'github': setData(GithubTrendingService.get()); break;
      case 'cloud': setData(CloudService.get()); break;
      case 'selfhosted': setData(SelfHostedService.get()); break;
    }
  };

  const handleDelete = (id: string) => {
    if(!window.confirm('Delete item?')) return;
    switch (activeTab) {
      case 'ai': AISpotlightService.remove(id); break;
      case 'agents': AIAgentsService.remove(id); break;
      case 'github': GithubTrendingService.remove(id); break;
      case 'cloud': CloudService.remove(id); break;
      case 'selfhosted': SelfHostedService.remove(id); break;
    }
    loadData();
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id);
      const formClone = { ...item };
      if (Array.isArray(formClone.tags)) formClone.tags = formClone.tags.join(', ');
      if (Array.isArray(formClone.features)) formClone.features = formClone.features.join(', ');
      setFormData(formClone);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemToSave = { ...formData };
    if (!itemToSave.id) itemToSave.id = Date.now().toString();

    if (typeof itemToSave.tags === 'string') itemToSave.tags = itemToSave.tags.split(',').map((s:string) => s.trim());
    if (typeof itemToSave.features === 'string') itemToSave.features = itemToSave.features.split(',').map((s:string) => s.trim());

    const serviceMap = {
        'ai': AISpotlightService,
        'agents': AIAgentsService,
        'github': GithubTrendingService,
        'cloud': CloudService,
        'selfhosted': SelfHostedService
    };

    const service = serviceMap[activeTab];

    if (editingId) {
        service.update(itemToSave);
    } else {
        service.add(itemToSave);
    }

    loadData();
    resetForm();
  };

  const Tabs = [
    { id: 'ai', label: 'AI Spotlight', icon: Zap },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'github', label: 'GitHub Trending', icon: Github },
    { id: 'cloud', label: 'Cloud & Hosting', icon: Cloud },
    { id: 'selfhosted', label: 'Self-Hosted', icon: Server },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Homepage Sections</h1>
      <p className="text-slate-500 mb-8">Manage content for special homepage blocks.</p>

      <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-white/10 pb-1 overflow-x-auto">
        {Tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as SectionType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === t.id 
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white dark:bg-navy-800 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  {item.logo && <img src={item.logo} className="w-10 h-10 rounded-lg object-contain bg-slate-50" />}
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                   <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg">
                     <Edit2 className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                     <Trash2 className="w-4 h-4" />
                   </button>
               </div>
            </div>
          ))}
          {data.length === 0 && <p className="text-slate-400 text-center py-8">No items yet.</p>}
        </div>

        <div className="bg-slate-50 dark:bg-navy-900 p-6 rounded-xl border border-slate-200 dark:border-white/10 h-fit">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              {editingId ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSave} className="space-y-3">
            <input required placeholder="Name" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            <textarea required placeholder="Description" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            {(activeTab === 'ai' || activeTab === 'agents') && (
              <>
                 {activeTab === 'ai' && <input placeholder="Category (e.g. LLM)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />}
                 <input placeholder="Tags (comma sep)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} />
              </>
            )}
            
            {activeTab === 'github' && (
              <>
                <input placeholder="Stars (e.g. 45k)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.stars || ''} onChange={e => setFormData({...formData, stars: e.target.value})} />
                <input placeholder="Language" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.language || ''} onChange={e => setFormData({...formData, language: e.target.value})} />
              </>
            )}

            {activeTab === 'cloud' && (
              <>
                <input placeholder="Type (e.g. PaaS)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} />
                <input placeholder="Tier (e.g. Free Tier)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.tier || ''} onChange={e => setFormData({...formData, tier: e.target.value})} />
                <input placeholder="Features (comma sep)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.features || ''} onChange={e => setFormData({...formData, features: e.target.value})} />
              </>
            )}

            {activeTab === 'selfhosted' && (
              <input placeholder="Alternative To (e.g. Vercel)" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.alternativeTo || ''} onChange={e => setFormData({...formData, alternativeTo: e.target.value})} />
            )}

            <input placeholder="Logo URL" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} />
            <input placeholder="Website URL" className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/10" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} />

            <div className="flex gap-2">
                {editingId && (
                    <button type="button" onClick={resetForm} className="w-1/3 bg-slate-200 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-300">Cancel</button>
                )}
                <button type="submit" className="flex-1 bg-primary-600 text-white font-bold py-2 rounded-lg hover:bg-primary-700">
                    {editingId ? 'Update Item' : 'Add Item'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
