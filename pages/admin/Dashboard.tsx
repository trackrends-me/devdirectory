
import React from 'react';
import { getTools, CATEGORY_GROUPS } from '../../services/dataService';
import { Database, Layers, CheckCircle } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminDashboard: React.FC = () => {
  const tools = getTools();
  const totalCategories = CATEGORY_GROUPS.reduce((acc, group) => acc + group.categories.length, 0);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Database} 
          label="Total Tools" 
          value={tools.length} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Layers} 
          label="Categories" 
          value={totalCategories} 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Featured Tools" 
          value={tools.filter(t => t.featured).length} 
          color="bg-green-500" 
        />
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/5 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Additions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {tools.slice(-5).reverse().map(tool => (
                <tr key={tool.id}>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{tool.name}</td>
                  <td className="py-3">{tool.category}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                      Active
                    </span>
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

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);
