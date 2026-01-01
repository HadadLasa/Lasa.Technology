import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    'services': t('nav.services'),
    'about': t('nav.about'),
    'contact': t('nav.contact'),
    'admin': t('nav.admin'),
    'login': 'Login'
  };

  return (
    <nav className="flex mb-6 text-sm font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Home className="w-4 h-4 mr-1 rtl:ml-1" />
            {t('nav.home')}
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1 rtl:rotate-180" />
                {isLast ? (
                  <span className="text-slate-900 dark:text-white font-semibold">{name}</span>
                ) : (
                  <Link to={to} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {name}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;