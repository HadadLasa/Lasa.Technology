import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Plus, Sparkles, Wand2, RefreshCw, Search, Filter, Upload, Trash2, ArrowUpDown, ChevronDown, Check, Shield, AlertCircle, X, Settings, Lock, LayoutGrid, Eye, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Service, ServiceCategory, AVAILABLE_ICONS } from '../types';
import { getServices, saveService, deleteService, deleteServices, resetServices } from '../services/storage';
import { generateServiceDescription } from '../services/gemini';
import ServiceCard from '../components/ServiceCard';
import ConfirmationModal from '../components/ConfirmationModal';
import Tooltip from '../components/Tooltip';
import Toast, { ToastMessage } from '../components/Toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

type SortOption = 'title' | 'category' | 'date';
type SortDirection = 'asc' | 'desc';
type AdminTab = 'services' | 'settings';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const { role, changePassword } = useAuth();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Search, Filter, Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // AI Config State
  const [aiTone, setAiTone] = useState('Professional');
  const [aiLength, setAiLength] = useState('Medium');

  // Custom Icon State
  const [iconType, setIconType] = useState<'preset' | 'custom'>('preset');
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);

  // Category State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Input Language Tab
  const [inputTab, setInputTab] = useState<'en' | 'ar'>('en');

  // Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    titleAr: '',
    descriptionAr: '',
    category: ServiceCategory.DEVELOPMENT,
    icon: 'Code',
    slug: ''
  });

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive: boolean;
    confirmText: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false,
    confirmText: 'Confirm'
  });

  useEffect(() => {
    loadServices();

    // Real-time synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lasa_services_v1') {
        loadServices();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-generate slug
  useEffect(() => {
    if (formData.title) {
        const generatedSlug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        if (!isEditing || !formData.slug) {
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }
  }, [formData.title]);

  // Update iconType
  useEffect(() => {
    if (formData.icon) {
      const isCustom = formData.icon.startsWith('http') || formData.icon.startsWith('data:');
      setIconType(isCustom ? 'custom' : 'preset');
    }
  }, [formData.icon]);

  const loadServices = () => {
    setLoading(true);
    // Simulate delay for skeleton
    setTimeout(() => {
        setServices(getServices());
        setLoading(false);
    }, 600);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ id: Date.now().toString(), type, message });
  };

  const openConfirmModal = (
    action: () => void, 
    title: string, 
    message: string, 
    isDestructive = false, 
    confirmText = 'Confirm'
  ) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: action,
      isDestructive,
      confirmText
    });
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setIsEditing(true);
    setIsCreatingCategory(false);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    // Both Admin and Editor can delete
    openConfirmModal(
      () => {
        const updated = deleteService(id);
        setServices(updated);
        if (selectedIds.has(id)) {
          const newSelected = new Set(selectedIds);
          newSelected.delete(id);
          setSelectedIds(newSelected);
        }
        showToast('success', t('toast.delete_success'));
      },
      t('modal.delete.title'),
      t('modal.delete.message'),
      true,
      t('btn.delete')
    );
  };

  const handleBulkDelete = () => {
    // Both Admin and Editor can bulk delete
    if (selectedIds.size === 0) return;
    openConfirmModal(
        () => {
            const updated = deleteServices(Array.from(selectedIds));
            setServices(updated);
            setSelectedIds(new Set());
            showToast('success', t('toast.bulk_delete_success'));
        },
        t('modal.delete_bulk.title'),
        t('modal.delete_bulk.message', { count: selectedIds.size }),
        true,
        `${t('btn.delete')} (${selectedIds.size})`
    );
  };

  const toggleSelection = (id: string) => {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
          newSelected.delete(id);
      } else {
          newSelected.add(id);
      }
      setSelectedIds(newSelected);
  };

  const selectAll = () => {
      if (selectedIds.size === filteredServices.length) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredServices.map(s => s.id)));
      }
  };

  const handleReset = () => {
    if (role !== 'ADMIN') {
        showToast('error', 'Only Admins can reset data.');
        return;
    }
    openConfirmModal(
        () => {
            const reset = resetServices();
            setServices(reset);
            setSelectedIds(new Set());
            showToast('success', t('toast.reset_success'));
        },
        t('modal.reset.title'),
        t('modal.reset.message'),
        true,
        t('admin.reset')
    );
  }

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSortOption('date');
    setSortDirection('desc');
  };

  const toggleCategoryFilter = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|gif|webp|svg\+xml)$/)) {
        showToast('error', t('error.file_type'));
        e.target.value = ''; 
        return;
      }
      const maxSize = 500 * 1024;
      if (file.size > maxSize) { 
        showToast('error', t('error.file_size'));
         e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result as string });
      };
      reader.onerror = () => {
        showToast('error', 'Failed to read file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const saveAction = () => {
        setIsSaving(true);
        setTimeout(() => {
            const finalCategory = isCreatingCategory ? newCategoryName : formData.category;
            
            const newService: Service = {
                id: formData.id || uuidv4(),
                title: formData.title || '',
                description: formData.description || '',
                titleAr: formData.titleAr || '',
                descriptionAr: formData.descriptionAr || '',
                category: finalCategory || 'General',
                icon: formData.icon || 'Code',
                slug: formData.slug || '',
                createdAt: formData.createdAt || Date.now()
            };
    
            const updated = saveService(newService);
            setServices(updated);
            showToast('success', t('toast.save_success'));
            setIsSaving(false);
            resetForm();
        }, 600);
    };

    openConfirmModal(
        saveAction,
        isEditing ? t('modal.save.title') : t('modal.add.title'),
        isEditing 
            ? t('modal.save.message') 
            : t('modal.add.message'),
        false,
        isEditing ? t('btn.update') : t('modal.publish')
    );
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'ADMIN') {
        showToast('error', 'Only Admins can change passwords.');
        return;
    }
    if (newPassword.length < 6) {
        showToast('error', 'Password must be at least 6 characters long.');
        return;
    }
    if (newPassword !== confirmPassword) {
        showToast('error', 'Passwords do not match.');
        return;
    }

    const success = changePassword(newPassword);
    if (success) {
        showToast('success', 'Admin password updated successfully.');
        setNewPassword('');
        setConfirmPassword('');
    } else {
        showToast('error', 'Failed to update password.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      titleAr: '',
      descriptionAr: '',
      category: ServiceCategory.DEVELOPMENT,
      icon: 'Code',
      slug: ''
    });
    setIsEditing(false);
    setIconType('preset');
    setIsCreatingCategory(false);
    setNewCategoryName('');
  };

  const handleMagicGenerate = async () => {
    if (!formData.title) {
      showToast('error', "Please enter a service title first.");
      return;
    }
    
    setGenerating(true);
    try {
      const description = await generateServiceDescription(
        formData.title, 
        (isCreatingCategory ? newCategoryName : formData.category) || 'General',
        { tone: aiTone, length: aiLength }
      );
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      showToast('error', t('error.gen_fail'));
    } finally {
      setGenerating(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new_custom_category') {
      setIsCreatingCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setIsCreatingCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  const uniqueCategories = Array.from(new Set([
    ...Object.values(ServiceCategory),
    ...services.map(s => s.category)
  ]));

  const previewService: Service = {
    id: 'preview',
    title: formData.title || 'Service Title',
    description: formData.description || 'Service description will appear here...',
    titleAr: formData.titleAr || 'عنوان الخدمة',
    descriptionAr: formData.descriptionAr || 'وصف الخدمة سيظهر هنا...',
    category: isCreatingCategory ? (newCategoryName || 'New Category') : ((formData.category) || ServiceCategory.DEVELOPMENT),
    icon: formData.icon || 'Code',
  };

  const filteredServices = services
    .filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
        return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
        let comparison = 0;
        if (sortOption === 'title') {
            comparison = a.title.localeCompare(b.title);
        } else if (sortOption === 'category') {
            comparison = a.category.localeCompare(b.category);
        } else if (sortOption === 'date') {
            comparison = (a.createdAt || 0) - (b.createdAt || 0);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 h-full">
      <div className="flex justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
      <div className="flex gap-3 mt-4">
        <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950">
      <SEO 
        title={t('admin.title')} 
        description="Manage your services, create new content with AI, and organize your offerings."
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      
      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        isDestructive={modalConfig.isDestructive}
        confirmText={modalConfig.confirmText}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wand2 className="h-8 w-8 text-blue-600" /> {t('admin.title')}
                </h1>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'}`}>
                    {role}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/contact" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                    {t('nav.contact')}
                </Link>

                {role === 'ADMIN' && (
                    <Tooltip content={t('admin.reset.tooltip')} position="bottom">
                        <button onClick={handleReset} className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                            <RefreshCw className="w-4 h-4"/> {t('admin.reset')}
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 p-1 mb-8 max-w-md">
            <button
                onClick={() => setActiveTab('services')}
                className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                    activeTab === 'services'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-100 shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/[0.12] hover:text-slate-800'
                } flex items-center justify-center gap-2`}
            >
                <LayoutGrid className="w-4 h-4" /> Services
            </button>
            <button
                onClick={() => setActiveTab('settings')}
                className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                    activeTab === 'settings'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-100 shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/[0.12] hover:text-slate-800'
                } flex items-center justify-center gap-2`}
            >
                <Settings className="w-4 h-4" /> Security
            </button>
        </div>
        
        {/* SERVICES TAB */}
        {activeTab === 'services' && (
            <>
                {/* Editor & Preview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Form */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        {(generating || isSaving) && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-20 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-2" />
                                <span className="text-blue-600 font-medium">
                                    {generating ? t('admin.generating') : t('admin.saving')}
                                </span>
                            </div>
                            </div>
                        )}
                        
                        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                            {isEditing ? t('admin.form.edit') : t('admin.form.add')}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                        {/* Language Tabs */}
                        <div className="md:col-span-2 flex border-b border-slate-200 dark:border-slate-700 mb-2">
                          <button
                            type="button"
                            onClick={() => setInputTab('en')}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                              inputTab === 'en' 
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                            {t('admin.lang.en')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setInputTab('ar')}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                              inputTab === 'ar' 
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                             {t('admin.lang.ar')}
                          </button>
                        </div>

                        {inputTab === 'en' ? (
                          <>
                            {/* Title EN */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.title_en')}</label>
                                <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., Cloud Migration"
                                required
                                />
                            </div>

                             {/* Slug (Auto-generated) */}
                             <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.slug')}</label>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                    <span className="text-xs">/services/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-700 dark:text-slate-300"
                                        placeholder="url-slug"
                                    />
                                </div>
                            </div>

                            {/* Description EN */}
                            <div className="space-y-4 md:col-span-2">
                              <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.desc_en')}</label>
                                  
                                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2">{t('admin.ai.label')}</span>
                                  <Tooltip content={t('admin.ai.tooltip.tone')}>
                                    <select 
                                        value={aiTone}
                                        onChange={(e) => setAiTone(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Professional">{t('admin.ai.tone.professional')}</option>
                                        <option value="Friendly">{t('admin.ai.tone.friendly')}</option>
                                        <option value="Innovative">{t('admin.ai.tone.innovative')}</option>
                                        <option value="Technical">{t('admin.ai.tone.technical')}</option>
                                        <option value="Formal">{t('admin.ai.tone.formal')}</option>
                                        <option value="Enthusiastic">{t('admin.ai.tone.enthusiastic')}</option>
                                        <option value="Concise">{t('admin.ai.tone.concise')}</option>
                                    </select>
                                  </Tooltip>
                                  <Tooltip content={t('admin.ai.tooltip.length')}>
                                    <select 
                                        value={aiLength}
                                        onChange={(e) => setAiLength(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Short">{t('admin.ai.len.short')}</option>
                                        <option value="Medium">{t('admin.ai.len.medium')}</option>
                                        <option value="Long">{t('admin.ai.len.long')}</option>
                                    </select>
                                  </Tooltip>
                                  <button
                                      type="button"
                                      onClick={handleMagicGenerate}
                                      disabled={generating || !formData.title}
                                      className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                                  >
                                      <Sparkles className="h-3 w-3" /> {t('admin.btn.generate')}
                                  </button>
                                  </div>
                              </div>
                              
                              <textarea
                                  value={formData.description}
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                                  rows={4}
                                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                  placeholder="Describe the service..."
                                  required
                              />
                            </div>
                          </>
                        ) : (
                          <>
                             {/* Title AR */}
                             <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.title_ar')}</label>
                                <input
                                type="text"
                                dir="rtl"
                                value={formData.titleAr || ''}
                                onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="مثال: ترحيل السحابة"
                                />
                            </div>

                             {/* Description AR */}
                             <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.desc_ar')}</label>
                                <textarea
                                    dir="rtl"
                                    value={formData.descriptionAr || ''}
                                    onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    placeholder="وصف الخدمة..."
                                />
                            </div>
                          </>
                        )}


                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.category')}</label>
                            
                            {!isCreatingCategory ? (
                                <select
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    {uniqueCategories.map(cat => (
                                        <option key={cat} value={cat}>{t(`category.${cat}`) === `category.${cat}` ? cat : t(`category.${cat}`)}</option>
                                    ))}
                                    <option disabled>──────────</option>
                                    <option value="new_custom_category" className="text-blue-600 font-medium">{t('admin.cat.create_new')}</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder={t('admin.label.category_new')}
                                        className="flex-1 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingCategory(false)}
                                        className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-xs"
                                    >
                                        {t('admin.cat.back')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Icon Selection */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.label.icon')}</label>
                            
                            <div className="flex gap-4 mb-3">
                                <button 
                                    type="button"
                                    onClick={() => { setIconType('preset'); setFormData({...formData, icon: 'Code'}) }}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${iconType === 'preset' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    <Sparkles className="w-4 h-4" /> {t('admin.btn.preset')}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIconType('custom')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${iconType === 'custom' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    <Upload className="w-4 h-4" /> {t('admin.btn.custom')}
                                </button>
                            </div>

                            {iconType === 'preset' ? (
                                <div className="relative">
                                    {/* Custom Dropdown Trigger */}
                                    <div 
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                                        onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {(() => {
                                                const Icon = Icons[formData.icon as keyof typeof Icons] as React.ElementType;
                                                return Icon ? <Icon className="w-5 h-5 text-blue-600" /> : null;
                                            })()}
                                            <span>{formData.icon}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isIconDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Dropdown List */}
                                    {isIconDropdownOpen && (
                                        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-1 p-2">
                                            {AVAILABLE_ICONS.map(iconName => {
                                                const Icon = Icons[iconName as keyof typeof Icons] as React.ElementType;
                                                const isSelected = formData.icon === iconName;
                                                return (
                                                    <Tooltip key={iconName} content={iconName} position="top">
                                                        <div 
                                                            onClick={() => {
                                                                setFormData({...formData, icon: iconName});
                                                                setIsIconDropdownOpen(false);
                                                            }}
                                                            className={`w-full flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                                                isSelected 
                                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                            }`}
                                                        >
                                                            {Icon && <Icon className="w-4 h-4" />}
                                                            <span className="text-sm truncate">{iconName}</span>
                                                        </div>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* Overlay to close */}
                                    {isIconDropdownOpen && (
                                        <div className="fixed inset-0 z-40" onClick={() => setIsIconDropdownOpen(false)}></div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    <div className="relative flex-1">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full px-4 py-2 text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-blue-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                            <div className="flex gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditing ? null : <Plus className="h-4 w-4" />)}
                                {isEditing ? t('admin.btn.submit_update') : t('admin.btn.submit_add')}
                            </button>
                            {isEditing && (
                                <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
                                >
                                {t('admin.form.cancel')}
                                </button>
                            )}
                            </div>
                        </form>
                    </div>

                    {/* Live Preview */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('admin.preview')}</h3>
                        <div className="flex-1 opacity-90 hover:opacity-100 transition-opacity">
                            <ServiceCard service={previewService} isAdmin={false} />
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                            {t('admin.preview.note')}
                        </p>
                    </div>
                </div>

                {/* Management Section */}
                <div className="space-y-6">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    
                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap">{t('admin.header.services')} ({filteredServices.length})</h3>
                            {selectedIds.size > 0 && (
                                <button 
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> {t('admin.btn.delete_bulk')} ({selectedIds.size})
                                </button>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                            
                            {/* Search */}
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder={t('admin.placeholder.search')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Multi-Select Filter */}
                            <div className="relative">
                                <Tooltip content={t('admin.filter.tooltip')}>
                                <button 
                                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                    className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer min-w-[160px]"
                                >
                                    <span className="truncate">
                                    {selectedCategories.length === 0 
                                        ? t('admin.filter.all') 
                                        : `${selectedCategories.length} selected`}
                                    </span>
                                    <Filter className="h-4 w-4 text-slate-400" />
                                </button>
                                </Tooltip>
                                
                                {isFilterDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterDropdownOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-40 max-h-60 overflow-y-auto">
                                    {uniqueCategories.map(cat => (
                                        <div 
                                        key={cat}
                                        onClick={() => toggleCategoryFilter(cat)}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                                        >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                            selectedCategories.includes(cat) 
                                            ? 'bg-blue-600 border-blue-600' 
                                            : 'border-slate-300 dark:border-slate-500'
                                        }`}>
                                            {selectedCategories.includes(cat) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
                                            {t(`category.${cat}`) === `category.${cat}` ? cat : t(`category.${cat}`)}
                                        </span>
                                        </div>
                                    ))}
                                    </div>
                                </>
                                )}
                            </div>

                            {/* Clear Filters Button */}
                            {(searchTerm || selectedCategories.length > 0) && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Clear all filters"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            )}

                            {/* Sort */}
                            <div className="flex rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                                <Tooltip content={t('admin.sort.tooltip')}>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                                    className="bg-transparent text-sm px-2 outline-none cursor-pointer"
                                    aria-label="Sort services by"
                                >
                                    <option value="title">{t('admin.sort.title')}</option>
                                    <option value="category">{t('admin.sort.category')}</option>
                                    <option value="date">{t('admin.sort.date')}</option>
                                </select>
                                </Tooltip>
                                <Tooltip content={t('admin.sort_dir.tooltip')}>
                                <button 
                                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                >
                                    <ArrowUpDown className={`w-4 h-4 transform transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 px-1">
                        <input 
                            type="checkbox" 
                            checked={selectedIds.size > 0 && selectedIds.size === filteredServices.length}
                            onChange={selectAll}
                            disabled={loading || filteredServices.length === 0}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t('admin.select.all')}</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                            <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">{t('admin.empty')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map(service => (
                            <ServiceCard 
                                key={service.id} 
                                service={service} 
                                isAdmin={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                selectable={true}
                                selected={selectedIds.has(service.id)}
                                onToggleSelect={toggleSelection}
                            />
                            ))}
                        </div>
                    )}
                </div>
            </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
             <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security Settings</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage access credentials and administrative privileges.</p>
                        </div>
                    </div>

                    {role === 'ADMIN' ? (
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Admin Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Enter new password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                                <input 
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={!newPassword || !confirmPassword}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 flex gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">Only Administrators can change system passwords. Please contact your administrator if you need to update your credentials.</p>
                        </div>
                    )}
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;