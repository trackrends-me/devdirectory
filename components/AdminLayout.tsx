
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { LayoutDashboard, Database, LogOut, ArrowLeft, BookOpen, FileText, LayoutTemplate, Tag } from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
        location.pathname.startsWith(to)
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-navy-800 border-r border-slate-200 dark:border-white/5 fixed h-full hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-white/5">
          <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
             <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center text-white">A</div>
             Admin Panel
          </Link>
        </div>
        
        <nav className="p-4 flex-1">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/tools" icon={Database} label="Manage Tools" />
          <NavItem to="/admin/categories" icon={Tag} label="Manage Categories" />
          <NavItem to="/admin/sections" icon={LayoutTemplate} label="Homepage Sections" />
          <NavItem to="/admin/learning" icon={BookOpen} label="Manage Learning" />
          <NavItem to="/admin/blog" icon={FileText} label="Manage Blog" />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
};
