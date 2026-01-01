import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Send, Facebook, Instagram } from 'lucide-react';
import Toast, { ToastMessage } from '../components/Toast';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: 'Please fill in all required fields correctly.'
      });
      return;
    }

    // Simulate form submission
    setToast({
      id: Date.now().toString(),
      type: 'success',
      message: 'Message sent successfully! We will get back to you soon.'
    });
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950">
      <SEO 
        title={t('contact.title')}
        description="Get in touch with Lasa Technology for your software and cloud infrastructure needs."
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8 animate-fade-in">
            
            {/* Address Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1 rtl:text-right">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact.address.label')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('contact.address.value')}
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 rtl:text-right">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact.email.label')}</h3>
                <a href="mailto:hello@lasatech.com" dir="ltr" className="block text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-cyan-400 transition-colors rtl:text-right">hello@lasatech.com</a>
                <a href="mailto:support@lasatech.com" dir="ltr" className="block text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-cyan-400 transition-colors rtl:text-right">support@lasatech.com</a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1 rtl:text-right">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact.phone.label')}</h3>
                <a href="tel:+905370255103" dir="ltr" className="block text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-cyan-400 transition-colors rtl:text-right">+90 (537) 025-5103</a>
                <p dir="ltr" className="text-slate-600 dark:text-slate-400 text-sm text-xs mt-1 rtl:text-right">Mon-Fri, 9am - 6pm PST</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('contact.social.title')}</h3>
                <div className="flex gap-4">
                    <a href="https://twitter.com/lasatech" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:-translate-y-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                    </a>
                    <a href="https://instagram.com/lasatech" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:-translate-y-1">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://t.me/LasaTechnology" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:-translate-y-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                    </a>
                    <a href="https://wa.me/+905370255103" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:-translate-y-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </a>
                    <a href="https://www.facebook.com/people/Lasa-Technology/61583635169059/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:-translate-y-1">
                        <Facebook className="w-5 h-5" />
                    </a>
                </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800 h-full">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('contact.form.name')}</label>
                    <input 
                      type="text"
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-700'} text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('contact.form.email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-700'} text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('contact.form.message')}</label>
                  <textarea 
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${errors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-700'} text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none`}
                  ></textarea>
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> {t('btn.send_message')}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
