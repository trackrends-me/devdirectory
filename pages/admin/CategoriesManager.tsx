
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { CategoryService } from '../../services/dataService';
import { CategoryGroup, Category } from '../../types';
import { Plus, Trash2, FolderPlus, Tag, Edit2 } from 'lucide-react';

export const CategoriesManager: React.FC = () => {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  
  const [groupForm, setGroupForm] = useState('');
  const [editingGroupSlug, setEditingGroupSlug] = useState<string | null>(null);

  const [selectedGroupSlug, setSelectedGroupSlug] = useState('');
  const [catForm, setCatForm] = useState({ name: '', description: '', icon: 'Box' });
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  useEffect(() => {
    setGroups(CategoryService.getGroups());
  }, []);

  const saveGroups = (updatedGroups: CategoryGroup[]) => {
    setGroups(updatedGroups);
    CategoryService.saveGroups(updatedGroups);
  };

  const handleGroupSubmit = () => {
    if (!groupForm.trim()) return;

    if (editingGroupSlug) {
        const updatedGroups = groups.map(g => g.slug === editingGroupSlug ? { ...g, name: groupForm } : g);
        saveGroups(updatedGroups);
        setEditingGroupSlug(null);
    } else {
        const slug = groupForm.toLowerCase().replace(/\s+/g, '-');
        const newGroupObj: CategoryGroup = {
            name: groupForm,
            slug,
            categories: []
        };
        saveGroups([...groups, newGroupObj]);
    }
    setGroupForm('');
  };

  const startEditGroup = (group: CategoryGroup) => {
      setGroupForm(group.name);
      setEditingGroupSlug(group.slug);
  };

  const handleDeleteGroup = (slug: string) => {
    if (confirm('Delete this group and all its categories?')) {
      saveGroups(groups.filter(g => g.slug !== slug));
      if (selectedGroupSlug === slug) setSelectedGroupSlug('');
    }
  };

  const handleCategorySubmit = () => {
    if (!selectedGroupSlug || !catForm.name.trim()) return;
    
    const updatedGroups = groups.map(group => {
      if (group.slug === selectedGroupSlug) {
        
        if (editingCatId) {
            const updatedCats = group.categories.map(c => 
                c.id === editingCatId ? { ...c, ...catForm, slug: catForm.name.toLowerCase().replace(/\s+/g, '-') } : c
            );
            return { ...group, categories: updatedCats };
        } else {
            const catSlug = catForm.name.toLowerCase().replace(/\s+/g, '-');
            const newCatObj: Category = {
                id: `cat-${Date.now()}`,
                name: catForm.name,
                description: catForm.description,
                icon: catForm.icon,
                slug: catSlug,
                toolCount: 0
            };
            return { ...group, categories: [...group.categories, newCatObj] };
        }
      }
      return group;
    });

    saveGroups(updatedGroups);
    setCatForm({ name: '', description: '', icon: 'Box' });
    setEditingCatId(null);
  };

  const startEditCategory = (cat: Category) => {
      setCatForm({ name: cat.name, description: cat.description, icon: cat.icon });
      setEditingCatId(cat.id);
  };

  const handleDeleteCategory = (groupSlug: string, catId: string) => {
    if (confirm('Delete this category?')) {
      const updatedGroups = groups.map(group => {
        if (group.slug === groupSlug) {
          return { ...group, categories: group.categories.filter(c => c.id !== catId) };
        }
        return group;
      });
      saveGroups(updatedGroups);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Manage Categories</h1>
      <p className="text-slate-500 mb-8">Create, edit and organize tool categories.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/10 h-fit">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary-500" /> Groups
          </h3>
          
          <div className="flex gap-2 mb-6">
            <input 
              value={groupForm}
              onChange={(e) => setGroupForm(e.target.value)}
              placeholder="Group Name"
              className="flex-1 p-2 rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900 text-sm"
            />
            {editingGroupSlug && (
                <button onClick={() => { setEditingGroupSlug(null); setGroupForm(''); }} className="bg-slate-200 px-2 rounded hover:bg-slate-300">X</button>
            )}
            <button onClick={handleGroupSubmit} className="bg-primary-600 text-white p-2 rounded hover:bg-primary-700">
              {editingGroupSlug ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-2">
            {groups.map(group => (
              <div 
                key={group.slug}
                onClick={() => { setSelectedGroupSlug(group.slug); setCatForm({ name: '', description: '', icon: 'Box' }); setEditingCatId(null); }}
                className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
                  selectedGroupSlug === group.slug 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-slate-200 dark:border-white/5 hover:border-primary-300'
                }`}
              >
                <span className="font-medium text-slate-700 dark:text-slate-200">{group.name}</span>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); startEditGroup(group); }}
                        className="text-slate-400 hover:text-blue-500 p-1"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.slug); }}
                        className="text-slate-400 hover:text-red-500 p-1"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/10">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary-500" /> 
            {selectedGroupSlug ? `Categories in "${groups.find(g => g.slug === selectedGroupSlug)?.name}"` : 'Select a Group'}
          </h3>

          {selectedGroupSlug ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 dark:bg-navy-900 p-4 rounded-xl border border-slate-200 dark:border-white/5 relative">
                {editingCatId && (
                    <div className="absolute top-2 right-2">
                        <button onClick={() => { setEditingCatId(null); setCatForm({ name: '', description: '', icon: 'Box' }); }} className="text-xs text-red-500 hover:underline">Cancel Edit</button>
                    </div>
                )}
                <input 
                  value={catForm.name}
                  onChange={(e) => setCatForm({...catForm, name: e.target.value})}
                  placeholder="Category Name"
                  className="p-2 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 text-sm"
                />
                <input 
                  value={catForm.description}
                  onChange={(e) => setCatForm({...catForm, description: e.target.value})}
                  placeholder="Short Description"
                  className="p-2 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 text-sm"
                />
                <button onClick={handleCategorySubmit} className="bg-primary-600 text-white p-2 rounded hover:bg-primary-700 font-bold text-sm">
                  {editingCatId ? 'Update Category' : 'Add Category'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.find(g => g.slug === selectedGroupSlug)?.categories.map(cat => (
                  <div key={cat.id} className="p-4 rounded-xl border border-slate-200 dark:border-white/5 flex justify-between items-start hover:shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => startEditCategory(cat)}
                            className="text-slate-400 hover:text-blue-500 p-1"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDeleteCategory(selectedGroupSlug, cat.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              Select a group on the left to manage its categories.
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
