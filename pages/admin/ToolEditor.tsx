
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToolById, CategoryService } from '../../services/dataService';
import { supabaseToolsService } from '../../services/supabaseDataService';
import { validateLicenseWithAI, normalizeLicense } from '../../services/licenseValidationService';
import { AdminLayout } from '../../components/AdminLayout';
import { Tool, CategoryGroup } from '../../types';
import { Save, Github, Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react';

export const ToolEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const groups = CategoryService.getGroups();

  // GitHub Fetch State
  const [githubUrl, setGithubUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [validatingLicense, setValidatingLicense] = useState(false);
  const [licenseValidation, setLicenseValidation] = useState<any>(null);
  const [detectedLicense, setDetectedLicense] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Tool>>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    group: 'Tech & Development',
    tags: [],
    websiteUrl: '',
    githubUrl: '',
    pricing: 'Free',
    logo: 'https://via.placeholder.com/150',
    featured: false,
    stars: 0,
    alternativeTo: '',
    starsWeekly: 0,
    deal: '',
    dealUrl: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadTool(id);
    }
  }, [id, isEditing]);

  const loadTool = async (toolId: string) => {
    try {
      const tool = await supabaseToolsService.getById(toolId);
      if (tool) setFormData(tool);
    } catch (error) {
      console.error('Error loading tool:', error);
      alert('Failed to load tool');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag)
    });
  };

  // --- GITHUB FETCH LOGIC WITH LICENSE VALIDATION ---
  const fetchGithubData = async () => {
    if (!githubUrl.includes('github.com')) {
      alert('Please enter a valid GitHub URL');
      return;
    }

    setFetching(true);
    setLicenseValidation(null);
    try {
      // Extract owner/repo
      const path = githubUrl.replace('https://github.com/', '').replace(/\/$/, '');
      const response = await fetch(`https://api.github.com/repos/${path}`);
      
      if (!response.ok) throw new Error('Repo not found');
      
      const data = await response.json();

      // Determine Pricing
      let pricing = 'Free';
      const detectedLicenseKey = data.license?.name || data.license?.key;
      setDetectedLicense(detectedLicenseKey || null);
      
      if (data.license && ['mit', 'apache-2.0', 'gpl-3.0', 'bsd-3-clause'].includes(data.license.key)) {
        pricing = 'Open Source';
      }

      // Smart Category Guessing based on keywords
      let guessedCategory = '';
      let alternatives = '';
      const keywords = (data.description + ' ' + (data.topics || []).join(' ')).toLowerCase();

      if (keywords.includes('react') || keywords.includes('vue') || keywords.includes('angular')) {
        guessedCategory = 'Frontend Frameworks';
        alternatives = 'React, Vue, Angular';
      } else if (keywords.includes('database') || keywords.includes('sql') || keywords.includes('nosql')) {
        guessedCategory = 'Database Systems';
        alternatives = 'PostgreSQL, MongoDB';
      } else if (keywords.includes('api') && keywords.includes('client')) {
        guessedCategory = 'API Clients';
        alternatives = 'Postman';
      } else if (keywords.includes('css') || keywords.includes('ui kit')) {
        guessedCategory = 'UI Kits';
        alternatives = 'Tailwind CSS, Bootstrap';
      }

      // Logo Priority: Owner Avatar -> Organization Avatar -> Placeholder
      const logoUrl = data.owner?.avatar_url || data.organization?.avatar_url || `https://ui-avatars.com/api/?name=${data.name}&background=random&color=fff&size=128`;

      setFormData(prev => ({
        ...prev,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        description: data.description, // Use full description for both initially
        shortDescription: data.description?.slice(0, 150) || '',
        websiteUrl: data.homepage || data.html_url,
        githubUrl: data.html_url,
        stars: data.stargazers_count,
        pricing: pricing as any,
        tags: [data.language, ...(data.topics || []).slice(0, 4)].filter(Boolean),
        category: guessedCategory,
        alternativeTo: alternatives,
        logo: logoUrl,
        license: detectedLicenseKey || undefined
      }));

      // Validate license with AI
      if (detectedLicenseKey) {
        await validateLicenseInfo(data.name, detectedLicenseKey, data.description);
      }

    } catch (error) {
      console.error(error);
      alert('Failed to fetch GitHub data. Check URL or API rate limits.');
    } finally {
      setFetching(false);
    }
  };

  const validateLicenseInfo = async (toolName: string, license: string, description: string) => {
    setValidatingLicense(true);
    try {
      const result = await validateLicenseWithAI(toolName, license, description);
      setLicenseValidation(result);
      
      // Auto-correct if high confidence and correction needed
      if (result.needsCorrection && result.correctedLicense && result.confidence > 70) {
        setFormData(prev => ({
          ...prev,
          license: result.correctedLicense || undefined
        }));
      }
    } catch (error) {
      console.error('License validation failed:', error);
    } finally {
      setValidatingLicense(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Auto-assign group based on category
      let assignedGroup = formData.group;
      for (const group of groups) {
        if (group.categories.some(c => c.name === formData.category)) {
          assignedGroup = group.name;
          break;
        }
      }

      const toolData: Tool = {
        ...formData as Tool,
        group: assignedGroup!,
        id: isEditing ? id! : Date.now().toString(),
        stars: Number(formData.stars),
        starsWeekly: Number(formData.starsWeekly)
      };

      if (isEditing) {
        await supabaseToolsService.update(toolData);
      } else {
        await supabaseToolsService.add(toolData);
      }
      alert(isEditing ? 'Tool updated successfully!' : 'Tool added successfully!');
      navigate('/admin/tools');
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Failed to save tool. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          {isEditing ? 'Edit Tool' : 'Add New Tool'}
        </h1>

        {/* GITHUB IMPORT SECTION */}
        {!isEditing && (
          <div className="bg-slate-900 text-white p-6 rounded-xl mb-8 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Github className="w-5 h-5" /> Import from GitHub
            </h3>
            <div className="flex gap-3">
              <input 
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
              />
              <button 
                onClick={fetchGithubData}
                disabled={fetching}
                className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Fetch Data
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Auto-fills description, stars, tags, pricing, category, license, AND logo.</p>
            
            {/* License Validation Alert */}
            {licenseValidation && (
              <div className={`mt-4 p-3 rounded-lg border ${
                licenseValidation.needsCorrection 
                  ? 'bg-amber-500/10 border-amber-500/30' 
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-start gap-2">
                  {licenseValidation.needsCorrection ? (
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 text-xs">
                    <p className={licenseValidation.needsCorrection ? 'text-amber-200' : 'text-green-200'}>
                      <strong>{licenseValidation.needsCorrection ? 'License Issue Detected' : 'License Verified'}</strong>
                    </p>
                    <p className="text-slate-300 mt-1">
                      {licenseValidation.reason}
                    </p>
                    {licenseValidation.correctedLicense && (
                      <p className="text-slate-300 mt-1">
                        Detected: <strong>{licenseValidation.detectedLicense}</strong> → Corrected: <strong>{licenseValidation.correctedLicense}</strong> (Confidence: {licenseValidation.confidence}%)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {validatingLicense && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Validating license...
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 p-8 rounded-xl border border-slate-200 dark:border-white/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input 
                name="name" required value={formData.name} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Website URL</label>
              <input 
                name="websiteUrl" required value={formData.websiteUrl} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select 
                name="category" required value={formData.category} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              >
                <option value="">Select Category</option>
                {groups.flatMap(g => g.categories).map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pricing</label>
              <select 
                name="pricing" value={formData.pricing} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
                <option value="Freemium">Freemium</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Short Description (Card)</label>
            <input 
              name="shortDescription" required value={formData.shortDescription} onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Description</label>
            <textarea 
              name="description" required value={formData.description} onChange={handleChange} rows={5}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Alternative To (Optional)</label>
              <input 
                name="alternativeTo" value={formData.alternativeTo || ''} onChange={handleChange}
                placeholder="e.g. Heroku, Vercel (comma separated)"
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Weekly Stars (Trending)</label>
              <input 
                name="starsWeekly" type="number" value={formData.starsWeekly || 0} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deal Text (e.g. 20% OFF)</label>
              <input 
                name="deal" value={formData.deal || ''} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deal URL</label>
              <input 
                name="dealUrl" value={formData.dealUrl || ''} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Logo URL</label>
              <input 
                name="logo" value={formData.logo} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">GitHub URL (Optional)</label>
              <input 
                name="githubUrl" value={formData.githubUrl} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">License (Optional)</label>
            <input 
              name="license" value={formData.license || ''} onChange={handleChange}
              placeholder="e.g. MIT, Apache-2.0, BSD-3-Clause"
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Auto-detected from GitHub. Can be manually corrected.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 dark:text-white"
                placeholder="Add a tag..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button type="button" onClick={handleAddTag} className="bg-slate-200 dark:bg-navy-700 px-4 py-2 rounded-lg font-bold">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary-900">&times;</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
             <input 
               type="checkbox" 
               name="featured" 
               checked={formData.featured}
               onChange={handleChange}
               className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
             />
             <label className="text-slate-700 dark:text-slate-300 font-bold">Featured Tool?</label>
          </div>

          <div className="flex justify-end pt-6">
            <button type="submit" disabled={submitting} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-colors">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {submitting ? 'Saving...' : 'Save Tool'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
