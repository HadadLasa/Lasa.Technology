import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Cpu, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const USFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} aria-hidden="true">
    <rect width="28" height="20" fill="#bf0a30"/>
    <rect y="3" width="28" height="3" fill="#ffffff"/>
    <rect y="9" width="28" height="3" fill="#ffffff"/>
    <rect y="15" width="28" height="3" fill="#ffffff"/>
    <rect width="12" height="10" fill="#002868"/>
    <circle cx="2.5" cy="2.5" r="0.8" fill="white"/>
    <circle cx="5.5" cy="2.5" r="0.8" fill="white"/>
    <circle cx="8.5" cy="2.5" r="0.8" fill="white"/>
    <circle cx="4" cy="5" r="0.8" fill="white"/>
    <circle cx="7" cy="5" r="0.8" fill="white"/>
    <circle cx="2.5" cy="7.5" r="0.8" fill="white"/>
    <circle cx="5.5" cy="7.5" r="0.8" fill="white"/>
    <circle cx="8.5" cy="7.5" r="0.8" fill="white"/>
  </svg>
);

export const ArabicFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
    <rect width="32" height="24" fill="#135d38"/>
    {/* Shahada Approximation */}
    <path d="M10 8c3-1 6-1 9 0c1 .3 2 .3 3 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
    <path d="M12 11c3-.5 5 .5 7 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
    <circle cx="16" cy="6" r="0.6" fill="white" opacity="0.9" />
    <circle cx="14" cy="5.5" r="0.6" fill="white" opacity="0.9" />
    
    {/* Sword */}
    <path d="M8 16h16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M23 15v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 16h1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 16l3 1.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 16l3 -1.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Defined static links
  const baseNavLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  // Dynamically build links based on auth
  const navLinks = [
      ...baseNavLinks,
      ...(isAuthenticated ? [{ name: t('nav.admin'), path: '/admin' }] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
      logout();
      setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group" aria-label={t('app.title')}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-full p-1.5 ring-1 ring-slate-900/5 dark:ring-white/10 group-hover:ring-blue-500/50 transition-all">
                  <Cpu className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Lasa<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Tech</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-blue-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
              {/* Single Language Toggle Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm"
                aria-label={language === 'en' ? "Switch to Arabic" : "Switch to English"}
              >
                {language === 'en' ? (
                  <>
                    <ArabicFlag className="h-3 w-4.5 rounded-[1px]" />
                    <span>AR</span>
                  </>
                ) : (
                  <>
                    <USFlag className="h-3 w-4.5 rounded-[1px]" />
                    <span>EN</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle Color Theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Logout"
                    aria-label="Logout"
                  >
                      <LogOut className="h-4 w-4" />
                  </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 shadow-sm"
              aria-label={language === 'en' ? "Switch to Arabic" : "Switch to English"}
            >
              {language === 'en' ? (
                <>
                  <ArabicFlag className="h-3 w-4 rounded-[1px]" />
                  AR
                </>
              ) : (
                <>
                  <USFlag className="h-3 w-4 rounded-[1px]" />
                  EN
                </>
              )}
            </button>

             <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle Color Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-fade-in-down shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
                <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <LogOut className="h-4 w-4" /> Logout
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;