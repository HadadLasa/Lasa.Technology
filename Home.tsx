import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Cpu, Globe, Wrench, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const { t, dir } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Gallery Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Parallax Scroll State using a ref for smoother updates
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current) {
        const scrolled = window.scrollY;
        // Adjust the multiplier for the desired parallax intensity
        // We use a subtle 0.3 factor to shift the background slower than the content
        heroBgRef.current.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryItems = [
    {
      id: 'mobile',
      title: t('home.gallery.mobile.title'),
      desc: t('home.gallery.mobile.desc'),
      img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
    },
    {
      id: 'ecommerce',
      title: t('home.gallery.ecommerce.title'),
      desc: t('home.gallery.ecommerce.desc'),
      img: 'https://ebz-static.s3.ap-south-1.amazonaws.com/easebuzz-static/upi-credit-cards-v1.png',
    },
    {
      id: 'uiux',
      title: t('home.gallery.uiux.title'),
      desc: t('home.gallery.uiux.desc'),
      img: 'https://ckedge.com/blogs/wp-content/uploads/2024/04/UI-UX-Design-1024x683.webp',
    },
    {
      id: 'web',
      title: t('home.gallery.web.title'),
      desc: t('home.gallery.web.desc'),
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    }
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title={t('nav.home')}
        description={t('home.hero.description')}
        keywords="Lasa Technology, software solutions, enterprise tech, cloud services"
      />
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-[90vh] flex items-center transition-colors duration-500">
        {/* Background Image with Parallax Effect */}
        <div 
          ref={heroBgRef}
          className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1727434032765-9c4df88b6e02?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-50 scale-125 transition-opacity duration-500"
          />
          {/* Enhanced Overlay for readability and depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white dark:from-slate-950/80 dark:via-slate-950/40 dark:to-slate-950 transition-colors duration-500" />
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-900/10 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 text-sm font-medium mb-8 border border-blue-200 dark:border-blue-500/20 backdrop-blur-md animate-fade-in transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t('home.welcome')}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 drop-shadow-sm dark:drop-shadow-2xl animate-fade-in-down transition-colors">
            {t('home.hero.title_start')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              {t('home.hero.title_end')}
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-200 font-medium drop-shadow-none dark:drop-shadow-lg leading-relaxed animate-fade-in transition-colors">
            {t('home.hero.description')}
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
            <Link 
              to="/services" 
              className="px-10 py-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3"
            >
              {t('home.explore')} <ArrowRight className="h-6 w-6" />
            </Link>
            {isAuthenticated && (
              <Link 
                to="/admin" 
                className="px-10 py-5 rounded-full bg-white dark:bg-slate-800/40 backdrop-blur-xl text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center"
              >
                {t('home.client_login')}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Vision & Innovation Section */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)]"></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                  {t('home.vision.title')}
               </h2>
               <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  {t('home.vision.subtitle')}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { 
                    icon: Megaphone, 
                    title: t('home.vision.card1.title'), 
                    desc: t('home.vision.card1.desc'),
                    color: "from-blue-500 to-cyan-400"
                  },
                  { 
                    icon: Wrench, 
                    title: t('home.vision.card2.title'), 
                    desc: t('home.vision.card2.desc'),
                    color: "from-purple-600 to-pink-500"
                  },
                  { 
                    icon: Globe, 
                    title: t('home.vision.card3.title'), 
                    desc: t('home.vision.card3.desc'),
                    color: "from-indigo-600 to-blue-500"
                  }
               ].map((item, idx) => (
                  <div key={idx} className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                     <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-6 transform group-hover:rotate-6 transition-transform`}>
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                           <item.icon className="w-7 h-7 text-slate-900 dark:text-white" />
                        </div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Feature Showcase Gallery (Carousel) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t('home.gallery.title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.gallery.subtitle')}
            </p>
          </div>

          <div 
            className="relative group max-w-5xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[16/9] md:aspect-[21/9] shadow-2xl border border-white/20 dark:border-white/5">
              <div 
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${dir === 'rtl' ? activeSlide * 100 : -activeSlide * 100}%)` }}
              >
                {galleryItems.map((item, index) => (
                  <div key={item.id} className="w-full h-full flex-shrink-0 relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                      <div className="max-w-2xl animate-fade-in">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{item.title}</h3>
                        <p className="text-slate-300 text-lg md:text-xl max-w-lg mb-6 leading-relaxed">{item.desc}</p>
                        <Link 
                          to="/services" 
                          className="inline-flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors"
                        >
                          {t('home.explore')} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                <button 
                  onClick={(e) => { e.preventDefault(); prevSlide(); }}
                  className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 pointer-events-auto border border-white/20"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className={`h-6 w-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); nextSlide(); }}
                  className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 pointer-events-auto border border-white/20"
                  aria-label="Next Slide"
                >
                  <ChevronRight className={`h-6 w-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {galleryItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 transition-all duration-300 rounded-full ${activeSlide === index ? 'w-10 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: t('home.feature.rapid.title'), desc: t('home.feature.rapid.desc') },
              { title: t('home.feature.security.title'), desc: t('home.feature.security.desc') },
              { title: t('home.feature.scalable.title'), desc: t('home.feature.scalable.desc') }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-cyan-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;