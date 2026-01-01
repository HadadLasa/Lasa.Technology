import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { getServiceBySlug, getServices } from '../services/storage';
import { useLanguage } from '../contexts/LanguageContext';
import * as Icons from 'lucide-react';
import { HelpCircle, ArrowLeft, Calendar, Tag, MessageSquare } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';

const ServiceDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      const allServices = getServices();
      const foundService = allServices.find(s => s.slug === slug);
      
      if (foundService) {
        setService(foundService);
        // Find 3 related services in the same category, excluding current
        const related = allServices
          .filter(s => s.category === foundService.category && s.id !== foundService.id)
          .slice(0, 3);
        setRelatedServices(related);
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Service Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">The service you are looking for does not exist or has been removed.</p>
        <Link to="/services" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Services
        </Link>
      </div>
    );
  }

  const title = (language === 'ar' && service.titleAr) ? service.titleAr : service.title;
  const description = (language === 'ar' && service.descriptionAr) ? service.descriptionAr : service.description;
  const categoryLabel = t(`category.${service.category}`) === `category.${service.category}` 
    ? service.category 
    : t(`category.${service.category}`);
  
  const isCustomIcon = service.icon.startsWith('http') || service.icon.startsWith('data:');
  const IconComponent = (!isCustomIcon)
    ? (Icons[service.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ElementType
    : null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950">
      <SEO 
        title={title}
        description={description.substring(0, 160)}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
           <Breadcrumbs />
        </div>

        <button 
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors group"
          aria-label={language === 'ar' ? 'العودة إلى قائمة الخدمات' : 'Back to services list'}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:translate-x-1" />
          {t('admin.cat.back')}
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-down mb-16">
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-slate-900 relative">
             <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" aria-hidden="true"></div>
             <div className="absolute -bottom-12 left-8 md:left-12">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-lg ring-4 ring-white dark:ring-slate-900 flex items-center justify-center">
                  {isCustomIcon ? (
                    <img 
                      src={service.icon} 
                      alt={language === 'ar' ? `أيقونة لـ ${title}` : `Icon for ${title}`} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    IconComponent ? (
                      <IconComponent className="h-12 w-12 text-blue-600 dark:text-blue-400" aria-label={service.icon} />
                    ) : (
                      <HelpCircle className="h-12 w-12 text-slate-400" aria-hidden="true" />
                    )
                  )}
                </div>
             </div>
          </div>

          <div className="pt-16 pb-12 px-8 md:px-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                   <Tag className="w-3.5 h-3.5" />
                   {categoryLabel}
                </span>
                {service.createdAt && (
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
              {title}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* Clear Call-To-Action */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {language === 'ar' ? 'هل أنت مستعد لبدء مشروعك؟' : 'Ready to start your project?'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? 'تواصل مع خبرائنا اليوم لمناقشة كيف يمكن لخدماتنا أن تساعد في نمو عملك.' : 'Get in touch with our experts today to discuss how our services can help grow your business.'}
                  </p>
               </div>
               <Link 
                  to="/contact"
                  className="whitespace-nowrap px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  aria-label={language === 'ar' ? 'استفسر الآن عن هذه الخدمة' : 'Inquire now about this service'}
               >
                 <MessageSquare className="w-5 h-5" />
                 {language === 'ar' ? 'استفسر الآن' : 'Inquire Now'}
               </Link>
            </div>
          </div>
        </div>

        {/* Related Services Section */}
        {relatedServices.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 px-2 flex items-center gap-3">
              <Tag className="w-6 h-6 text-blue-600" />
              {language === 'ar' ? 'خدمات ذات صلة' : 'Related Services'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map(related => (
                <ServiceCard key={related.id} service={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;