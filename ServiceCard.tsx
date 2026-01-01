import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Service } from '../types';
import { Check, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onEdit, 
  onDelete, 
  isAdmin, 
  selectable,
  selected,
  onToggleSelect
}) => {
  const { language, t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if icon is a URL or Base64 string
  const isCustomIcon = service.icon.startsWith('http') || service.icon.startsWith('data:');
  
  // Dynamically resolve the icon component if it's not custom
  const IconComponent = (!isCustomIcon || imageError)
    ? (Icons[service.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ElementType
    : null;

  // Resolve content based on language
  const title = (language === 'ar' && service.titleAr) ? service.titleAr : service.title;
  const description = (language === 'ar' && service.descriptionAr) ? service.descriptionAr : service.description;
  
  // Fallback for category translation
  const categoryLabel = t(`category.${service.category}`) === `category.${service.category}` 
    ? service.category 
    : t(`category.${service.category}`);

  // Truncation logic threshold (characters)
  const TRUNCATION_THRESHOLD = 150;
  const isLongDescription = description.length > TRUNCATION_THRESHOLD;
  const linkPath = service.slug ? `/services/${service.slug}` : '#';

  // Accessibility labels
  const detailsAriaLabel = language === 'ar' 
    ? `عرض تفاصيل خدمة ${title}` 
    : `View details for ${title}`;
  
  const readMoreAriaLabel = isExpanded 
    ? (language === 'ar' ? 'عرض أقل' : 'Read less about this service') 
    : (language === 'ar' ? 'اقرأ المزيد عن هذه الخدمة' : 'Read more about this service');

  return (
    <div className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border flex flex-col h-full overflow-hidden ${selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-cyan-500/50'}`}>
      
      {/* Selection Overlay/Checkbox */}
      {selectable && onToggleSelect && (
        <div className={`absolute top-4 z-20 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
          <button
            onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(service.id);
            }}
            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                selected 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-500'
            }`}
            aria-label={selected ? (language === 'ar' ? 'إلغاء تحديد الخدمة' : 'Deselect service') : (language === 'ar' ? 'تحديد الخدمة' : 'Select service')}
          >
            {selected && <Check className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Background Gradient Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-slate-700/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0 relative">
          {isCustomIcon && !imageError ? (
            <div className="w-full h-full relative flex items-center justify-center bg-white/10">
               <img 
                src={service.icon} 
                alt={title} 
                className="w-full h-full object-contain p-1" 
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
             IconComponent ? <IconComponent className="h-6 w-6 text-white" /> : <HelpCircle className="h-6 w-6 text-white" />
          )}
        </div>
        
        <div className="mb-2 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            {categoryLabel}
          </span>
        </div>

        {/* Title Link */}
        <Link 
          to={linkPath} 
          className="block mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 -m-1"
          aria-label={detailsAriaLabel}
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors shrink-0 flex items-center gap-2">
            {title}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 rtl:rotate-180" />
          </h3>
        </Link>
        
        <div className="relative">
          <p className={`text-slate-600 dark:text-slate-300 text-sm leading-relaxed transition-all duration-300 ${!isExpanded && isLongDescription ? 'line-clamp-3' : ''}`}>
            {description}
          </p>
          {isLongDescription && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-3 px-3 py-1.5 -ml-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 bg-blue-50/50 dark:bg-slate-700/50 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              aria-label={readMoreAriaLabel}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>
                  {language === 'ar' ? 'اقرأ أقل' : 'Read Less'} <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                   {language === 'ar' ? 'اقرأ المزيد' : 'Read More'} <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex gap-3 shrink-0">
          <button
            onClick={() => onEdit?.(service)}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
            aria-label={language === 'ar' ? `تعديل ${title}` : `Edit ${title}`}
          >
            {t('btn.edit')}
          </button>
          <button
            onClick={() => onDelete?.(service.id)}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none"
            aria-label={language === 'ar' ? `حذف ${title}` : `Delete ${title}`}
          >
            {t('btn.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;