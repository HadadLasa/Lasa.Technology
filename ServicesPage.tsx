import React, { useEffect, useState } from 'react';
import { Service } from '../types';
import { getServices } from '../services/storage';
import ServiceCard from '../components/ServiceCard';
import { useLanguage } from '../contexts/LanguageContext';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { Search } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Simulate network delay for realistic loading effect
    const timer = setTimeout(() => {
      setServices(getServices());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        service.title.toLowerCase().includes(searchLower) || 
        service.description.toLowerCase().includes(searchLower) ||
        (service.titleAr && service.titleAr.includes(searchTerm)) ||
        (service.descriptionAr && service.descriptionAr.includes(searchTerm));
        
    return matchesCategory && matchesSearch;
  });

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 h-full">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 mb-6 animate-pulse"></div>
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <SEO 
        title={t('services.header.title')}
        description="Explore our comprehensive technical solutions including Software Development, Cloud Infrastructure, and AI-Driven Automation."
        keywords="software development, cloud migration, AI, cybersecurity, mobile apps, data analytics"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs />

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('services.header.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('services.header.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10 relative animate-fade-in-down">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input 
                    type="text" 
                    placeholder={t('admin.placeholder.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>
        </div>

        {loading ? (
          <div>
             {/* Skeleton Filters */}
             <div className="flex flex-wrap justify-center gap-2 mb-12">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                ))}
             </div>
             {/* Skeleton Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <SkeletonCard key={i} />
                ))}
             </div>
          </div>
        ) : (
          <>
            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'All' 
                    ? t('admin.filter.all') 
                    : (t(`category.${cat}`) === `category.${cat}` ? cat : t(`category.${cat}`))}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-lg">{t('admin.empty')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;