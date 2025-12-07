import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Twitter, Sun, Moon, Lock, Search } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { HeaderAISearch } from './HeaderAISearch';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-200 selection:bg-primary-500/30 transition-colors duration-300">
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      
      {/* Unified Header - Increased z-index to 100 */}
      <header className="fixed top-0 w-full z-[100] bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                D
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors hidden sm:block">
                Dev<span className="text-primary-600">Directory</span>
                </span>
            </Link>

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
                <NavLink to="/categories">Categories</NavLink>
                <NavLink to="/browse">Browse Tools</NavLink>
                <NavLink to="/stack/modern-react-2025">Featured Stack</NavLink>
                <NavLink to="/stack-builder">Builder</NavLink>
                <NavLink to="/learning">Learning</NavLink>
            </nav>

            {/* Center: AI Search */}
            <HeaderAISearch />

            {/* Right: Utilities */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={() => setIsCommandOpen(true)}
                    className="p-2 sm:p-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/5"
                    title="Search (⌘K)"
                >
                    <Search className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

                <button
                    onClick={toggleTheme}
                    className="p-2 sm:p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <Link 
                    to="/admin/login"
                    className="hidden sm:block p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                    title="Admin Login"
                >
                    <Lock className="w-4 h-4" />
                </Link>

                {/* Mobile Menu Toggle */}
                <button 
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/10 shadow-2xl animate-fade-in z-10">
            <div className="flex flex-col p-6 gap-4">
              <MobileNavLink to="/categories">Categories</MobileNavLink>
              <MobileNavLink to="/browse">Browse Tools</MobileNavLink>
              <MobileNavLink to="/stack/modern-react-2025">Featured Stack</MobileNavLink>
              <MobileNavLink to="/stack-builder">Stack Builder</MobileNavLink>
              <MobileNavLink to="/learning">Learning</MobileNavLink>
              <MobileNavLink to="/admin/login">Admin Login</MobileNavLink>
              <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
              <MobileNavLink to="/submit">Submit a Tool</MobileNavLink>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-white/5 pt-16 pb-8 mt-20 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">D</div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">DevDirectory</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The most comprehensive directory for developers. Curated tools, frameworks, and resources to help you build better software.
              </p>
              <div className="flex gap-4">
                <SocialIcon Icon={Github} />
                <SocialIcon Icon={Twitter} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Discover</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/stack/modern-react-2025" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Featured Stacks</Link></li>
                <li><Link to="/stack-builder" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Stack Builder</Link></li>
                <li><Link to="/browse?cat=frameworks" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Frameworks</Link></li>
                <li><Link to="/browse?filter=deal" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Deals & Discounts</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/learning" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Learning Paths</Link></li>
                <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link to="/submit" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Submit Tool</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Newsletter</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Get the latest tools delivered to your inbox weekly.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 w-full"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white dark:text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} DevDirectory.net. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-all px-3 py-1 rounded-full ${
        isActive 
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10' 
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link 
    to={to} 
    className="block text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

const SocialIcon: React.FC<{ Icon: any }> = ({ Icon }) => (
  <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary-600 hover:text-white dark:hover:text-white transition-all">
    <Icon className="w-4 h-4" />
  </a>
);