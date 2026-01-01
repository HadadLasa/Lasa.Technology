import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Lightbulb, ShieldCheck, Award, Calendar, Users, Zap, Clock, Shield, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const TechBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Moving Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] animate-pan" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />
      
      {/* Animated Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      {/* Drifting Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/5 blur-3xl animate-blob"
          style={{
            width: Math.random() * 400 + 100 + 'px',
            height: Math.random() * 400 + 100 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 10 + 15 + 's',
            animationDelay: Math.random() * 10 + 's',
          }}
        />
      ))}

      {/* Small Bright Dots (Circuit Joints) */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-blue-400/20 dark:bg-cyan-400/20 rounded-full"
          style={{
            left: Math.floor(Math.random() * 20) * 5 + '%',
            top: Math.floor(Math.random() * 20) * 5 + '%',
          }}
        />
      ))}
    </div>
  );
};

const AboutPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{url: string, alt: string, caption: string} | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      alt: t('about.gallery.img1.alt'),
      caption: t('about.gallery.img1.caption')
    },
    {
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      alt: t('about.gallery.img2.alt'),
      caption: t('about.gallery.img2.caption')
    },
    {
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
      alt: t('about.gallery.img3.alt'),
      caption: t('about.gallery.img3.caption')
    },
    {
      url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200",
      alt: t('about.gallery.img4.alt'),
      caption: t('about.gallery.img4.caption')
    }
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  const milestones = [
    { year: '2018', titleKey: 'about.journey.2018.title', descKey: 'about.journey.2018.desc' },
    { year: '2020', titleKey: 'about.journey.2020.title', descKey: 'about.journey.2020.desc' },
    { year: '2022', titleKey: 'about.journey.2022.title', descKey: 'about.journey.2022.desc' },
    { year: '2024', titleKey: 'about.journey.2024.title', descKey: 'about.journey.2024.desc' },
  ];

  const whyChooseUs = [
    { icon: Users, titleKey: 'about.why.expert.title', descKey: 'about.why.expert.desc', color: 'bg-blue-100 text-blue-600' },
    { icon: Zap, titleKey: 'about.why.tailored.title', descKey: 'about.why.tailored.desc', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Shield, titleKey: 'about.why.future.title', descKey: 'about.why.future.desc', color: 'bg-purple-100 text-purple-600' },
    { icon: Clock, titleKey: 'about.why.support.title', descKey: 'about.why.support.desc', color: 'bg-green-100 text-green-600' },
  ];

  const openLightbox = (img: typeof galleryImages[0]) => {
    setSelectedImage(img);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <SEO 
        title={t('about.title')}
        description={t('about.mission.desc')}
      />

      <TechBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-16 shadow-lg border border-slate-200 dark:border-slate-800 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                <Target className="w-4 h-4" /> {t('about.mission.title')}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {t('about.mission.desc')}
              </h2>
            </div>
            
            <div className="flex-1 w-full max-w-md mx-auto">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 transform hover:scale-[1.02] transition-transform duration-500">
                    <img src="https://cdn.dribbble.com/userupload/42305701/file/original-6cd2bd3708f2eb1db8e810fb9614161a.gif" alt="Lasa Technology Mission" className="absolute inset-0 w-full h-full object-cover" />
                </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-24">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">{t('about.journey.title')}</h2>
            <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                
                <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                        <div key={index} className={`relative flex items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className="w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-[0_0_20px_rgba(37,99,235,0.6)] z-10 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className={`w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold mb-2">
                                        {milestone.year}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t(milestone.titleKey)}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{t(milestone.descKey)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Gallery Carousel Section */}
        <div className="mb-24">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('about.gallery.title')}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('about.gallery.desc')}</p>
            </div>
            
            <div 
                className="relative group max-w-5xl mx-auto"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
            >
                {/* Main Carousel Container */}
                <div className="relative overflow-hidden rounded-3xl aspect-[16/9] shadow-2xl bg-slate-200 dark:bg-slate-800 border border-white/20 dark:border-white/5">
                    <div 
                        className="flex h-full transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(${dir === 'rtl' ? activeSlide * 100 : -activeSlide * 100}%)` }}
                    >
                        {galleryImages.map((img, index) => (
                            <div 
                                key={index} 
                                className="w-full h-full flex-shrink-0 relative group/slide cursor-pointer"
                                onClick={() => openLightbox(img)}
                            >
                                <img 
                                    src={img.url} 
                                    alt={img.alt} 
                                    className="w-full h-full object-cover"
                                />
                                {/* Slide Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white text-2xl font-bold mb-1">{img.caption}</h3>
                                            <p className="text-white/70 text-sm">{img.alt}</p>
                                        </div>
                                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                                            <ZoomIn className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-4' : 'left-4'} p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-20`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-4' : 'right-4'} p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-20`}
                    aria-label="Next slide"
                >
                    <ChevronRight className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {galleryImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`h-2 transition-all duration-300 rounded-full ${activeSlide === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Lightbulb, 
                title: t('about.value.innovation.title'), 
                desc: t('about.value.innovation.desc'),
                color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
              },
              { 
                icon: ShieldCheck, 
                title: t('about.value.integrity.title'), 
                desc: t('about.value.integrity.desc'),
                color: 'text-green-500 bg-green-50 dark:bg-green-900/20' 
              },
              { 
                icon: Award, 
                title: t('about.value.excellence.title'), 
                desc: t('about.value.excellence.desc'),
                color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              }
            ].map((value, index) => (
              <div key={index} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${value.color}`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-24">
             <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">{t('about.why.title')}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyChooseUs.map((item, index) => (
                    <div key={index} className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color} dark:bg-opacity-20`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{t(item.titleKey)}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{t(item.descKey)}</p>
                    </div>
                ))}
             </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
            onClick={closeLightbox}
        >
            <button 
                onClick={closeLightbox}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                aria-label="Close gallery"
            >
                <X className="w-8 h-8" />
            </button>
            
            <div 
                className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()} 
            >
                <img 
                    src={selectedImage.url} 
                    alt={selectedImage.alt} 
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl animate-scale-in"
                />
                <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.caption}</h3>
                    <p className="text-white/60 text-lg">{selectedImage.alt}</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;