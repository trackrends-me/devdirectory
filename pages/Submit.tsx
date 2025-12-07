import React, { useState } from 'react';
import { CATEGORY_GROUPS } from '../services/dataService';
import { Check, ChevronRight, Upload, AlertCircle } from 'lucide-react';

export const Submit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    category: '',
    description: '',
    pricing: 'Free',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Submission Received!</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
          Thanks for suggesting <strong>{formData.name}</strong>. Our team will review it shortly. You'll receive an email at {formData.email} once approved.
        </p>
        <button 
          onClick={() => {setSubmitted(false); setStep(1); setFormData({name:'', website:'', category:'', description:'', pricing:'Free', email:''})}}
          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
        >
          Submit another tool
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Submit a Tool</h1>
          <p className="text-slate-500 dark:text-slate-400">Help us build the most comprehensive developer directory.</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-white/10 -z-10"></div>
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex flex-col items-center bg-slate-50 dark:bg-navy-900 px-4 z-10 transition-colors duration-300`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s ? 'bg-teal-500 text-white dark:text-navy-900' : 'bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 text-slate-500'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              <span className={`text-xs mt-2 ${step >= s ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-600'}`}>
                {s === 1 ? 'Details' : s === 2 ? 'Content' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800/30 border border-slate-200 dark:border-white/5 rounded-2xl p-8 md:p-12 shadow-xl dark:shadow-2xl transition-colors duration-300">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tool Name</label>
                  <input 
                    required name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    placeholder="e.g. Next.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Website URL</label>
                  <input 
                    required name="website" type="url" value={formData.website} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select 
                  required name="category" value={formData.category} onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none appearance-none"
                >
                  <option value="">Select a category...</option>
                  {CATEGORY_GROUPS.flatMap(g => g.categories).map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-6 flex justify-end">
                <button type="button" onClick={() => setStep(2)} className="bg-teal-500 hover:bg-teal-600 text-white dark:text-navy-900 font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Short Description</label>
                <textarea 
                  required name="description" value={formData.description} onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                  placeholder="Describe the tool in 2-3 sentences..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pricing Model</label>
                   <div className="flex flex-col gap-2">
                     {['Free', 'Paid', 'Freemium', 'Open Source'].map(p => (
                       <label key={p} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                         formData.pricing === p ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-400' : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                       }`}>
                         <input 
                            type="radio" name="pricing" value={p} 
                            checked={formData.pricing === p} 
                            onChange={handleChange}
                            className="hidden"
                          />
                         <span className="text-sm font-medium">{p}</span>
                         {formData.pricing === p && <Check className="w-4 h-4 ml-auto" />}
                       </label>
                     ))}
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Logo / Screenshot</label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl h-40 flex flex-col items-center justify-center text-slate-500 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs">Drag & drop or click to upload</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium px-4">Back</button>
                <button type="button" onClick={() => setStep(3)} className="bg-teal-500 hover:bg-teal-600 text-white dark:text-navy-900 font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Review <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-fade-in">
               <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-xl flex gap-3 text-blue-700 dark:text-blue-200 text-sm">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p>Please provide your email so we can notify you about the status of your submission.</p>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Email</label>
                  <input 
                    required name="email" type="email" value={formData.email} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    placeholder="you@company.com"
                  />
               </div>

               <div className="bg-slate-50 dark:bg-navy-950 rounded-xl p-6 border border-slate-200 dark:border-white/5">
                 <h3 className="text-slate-900 dark:text-white font-bold mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Summary</h3>
                 <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                   <div>
                     <dt className="text-slate-500">Name</dt>
                     <dd className="text-slate-900 dark:text-white font-medium">{formData.name}</dd>
                   </div>
                   <div>
                     <dt className="text-slate-500">Website</dt>
                     <dd className="text-slate-900 dark:text-white font-medium truncate">{formData.website}</dd>
                   </div>
                   <div>
                     <dt className="text-slate-500">Category</dt>
                     <dd className="text-slate-900 dark:text-white font-medium">{formData.category}</dd>
                   </div>
                   <div>
                     <dt className="text-slate-500">Pricing</dt>
                     <dd className="text-slate-900 dark:text-white font-medium">{formData.pricing}</dd>
                   </div>
                 </dl>
               </div>

               <div className="pt-6 flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium px-4">Back</button>
                <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white dark:text-navy-900 font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Submit Tool
                </button>
              </div>
             </div>
          )}
        </form>
      </div>
    </div>
  );
};