import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Home, LayoutDashboard, FileText, CheckCircle, Search, TrendingUp, Sun, Moon } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen dark:bg-[#0f1117] bg-gray-50 flex flex-col font-sans transition-colors dark:text-gray-100 text-gray-900">
      <header className="border-b dark:border-gray-800 border-gray-200 dark:bg-[#161b22] bg-white sticky top-0 z-50 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
              TL
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              TalentLens
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 dark:text-gray-400 text-gray-600 dark:hover:text-blue-500 hover:text-blue-600 transition-colors" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 dark:text-gray-300 text-gray-600 hover:text-blue-400 transition-colors font-medium">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                {user.role === 'recruiter' && (
                  <>
                    <Link to="/roles" className="flex items-center gap-2 dark:text-gray-300 text-gray-600 hover:text-blue-500 transition-colors font-medium">
                      <Search size={18} /> Jobs
                    </Link>
                    <Link to="/analytics" className="flex items-center gap-2 dark:text-gray-300 text-gray-600 hover:text-blue-500 transition-colors font-medium">
                      <TrendingUp size={18} /> Analytics
                    </Link>
                  </>
                )}
                {user.role === 'candidate' && (
                  <Link to="/resumes" className="flex items-center gap-2 dark:text-gray-300 text-gray-600 hover:text-blue-400 transition-colors font-medium">
                    <FileText size={18} /> Resumes
                  </Link>
                )}
                <div className="flex items-center gap-4 ml-4 pl-6 border-l dark:border-gray-800 border-gray-300">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium dark:text-gray-200 text-gray-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="dark:text-gray-300 text-gray-600 hover:text-blue-500 transition-colors font-medium">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="border-t dark:border-gray-800/60 border-gray-200 py-10 dark:bg-[#0a0c10] bg-gray-100 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            &copy; {new Date().getFullYear()} TalentLens AI build with <span className="text-red-500 text-lg">❤</span> by Aishwarya
          </p>
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-blue-500 uppercase tracking-widest">Home</Link>
            <Link to="/dashboard" className="text-xs font-bold text-slate-500 hover:text-blue-500 uppercase tracking-widest">Pipeline</Link>
            <Link to="/roles" className="text-xs font-bold text-slate-500 hover:text-blue-500 uppercase tracking-widest">Mandates</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
