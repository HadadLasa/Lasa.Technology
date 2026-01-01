import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Dictionary for UI labels
const translations: Record<string, Record<string, string>> = {
  en: {
    // General
    'app.title': 'Lasa Technology',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',
    'btn.save': 'Save',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.update': 'Update',
    'btn.add': 'Add',
    'btn.send_message': 'Send Message',

    // Nav
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin CMS',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.empowering': 'Empowering businesses through innovative technical solutions.',
    'footer.services': 'Services',
    'footer.connect': 'Connect',
    
    // Home
    'home.welcome': 'Accepting New Projects',
    'home.explore': 'Explore Services',
    'home.client_login': 'Client Login',
    'home.hero.title_start': 'Innovate with',
    'home.hero.title_end': 'Future-Ready Tech',
    'home.hero.description': 'Lasa Technology delivers enterprise-grade software solutions, cloud architecture, and security services designed to scale with your ambition.',

    // Home Vision
    'home.vision.title': 'The Future At Your Fingertips',
    'home.vision.subtitle': 'Explore the future of innovation through Lasa Technology, where we present advancements and visions of the future clearly through visual concepts.',
    'home.vision.card1.title': 'Digital Marketing',
    'home.vision.card1.desc': 'Strategic online marketing solutions to boost your brand visibility, engage your target audience, and drive conversions through SEO, social media, and targeted ads.',
    'home.vision.card2.title': 'Maintenance & Support',
    'home.vision.card2.desc': 'Comprehensive 24/7 technical assistance and proactive system maintenance to ensure your infrastructure remains resilient, secure, and high-performing.',
    'home.vision.card3.title': 'Hosting & Domains',
    'home.vision.card3.desc': 'Reliable, high-speed hosting solutions and seamless domain management to establish your brand\'s digital presence.',

    // Home Gallery
    'home.gallery.title': 'Our Specialized Expertise',
    'home.gallery.subtitle': 'Showcasing our capabilities in delivering world-class digital solutions across diverse industries.',
    'home.gallery.mobile.title': 'Mobile App Development',
    'home.gallery.mobile.desc': 'Crafting seamless native and hybrid mobile experiences for iOS and Android.',
    'home.gallery.ecommerce.title': 'E-commerce Development',
    'home.gallery.ecommerce.desc': 'Building secure, high-conversion online stores tailored to your business model.',
    'home.gallery.uiux.title': 'UI/UX Design',
    'home.gallery.uiux.desc': 'User-centric design thinking that bridges the gap between beauty and functionality.',
    'home.gallery.web.title': 'Web App Development',
    'home.gallery.web.desc': 'Enterprise-grade web applications built with modern, scalable frameworks.',

    // Home Features
    'home.feature.rapid.title': 'Rapid Deployment',
    'home.feature.rapid.desc': 'Agile methodologies ensuring faster time-to-market.',
    'home.feature.security.title': 'Enterprise Security',
    'home.feature.security.desc': 'Bank-grade security protocols protecting your sensitive data.',
    'home.feature.scalable.title': 'Scalable Architecture',
    'home.feature.scalable.desc': 'Systems designed to grow seamlessly with your user base.',

    // Services Page
    'services.header.title': 'Our Expertise',
    'services.header.subtitle': 'Comprehensive technical solutions designed to drive your business forward in the digital age.',
    'services.empty': 'No services found in this category.',
    'services.loading': 'Loading services...',

    // About Page
    'about.title': 'About Lasa Technology',
    'about.subtitle': 'Building the digital future, one solution at a time.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'At Lasa Technology, our mission is to democratize access to enterprise-grade technology. We strive to bridge the gap between complex technical challenges and business success, providing scalable, secure, and innovative solutions that empower organizations to thrive in a rapidly evolving digital landscape.',
    'about.values.title': 'Core Values',
    'about.value.innovation.title': 'Innovation',
    'about.value.innovation.desc': 'We constantly push boundaries to find better, smarter ways to solve problems.',
    'about.value.integrity.title': 'Integrity',
    'about.value.integrity.desc': 'We build trust through transparency, honesty, and accountability in every line of code.',
    'about.value.excellence.title': 'Excellence',
    'about.value.excellence.desc': 'We are committed to the highest standards of quality in engineering and design.',
    
    // About - Timeline
    'about.journey.title': 'Our Journey',
    'about.journey.2018.title': 'Inception',
    'about.journey.2018.desc': 'Founded with a vision to simplify enterprise tech.',
    'about.journey.2020.title': 'Global Projects',
    'about.journey.2020.desc': 'LasaTech has completed numerous projects for international clients.',
    'about.journey.2022.title': 'Future Ambitions',
    'about.journey.2022.desc': 'We aim to achieve Premier Partner status in major technology fields.',
    'about.journey.2024.title': 'Proprietary Suite',
    'about.journey.2024.desc': 'We launched a proprietary project suite designed specifically for enterprises.',

    // About - Why Choose Us
    'about.why.title': 'Why Choose Us?',
    'about.why.expert.title': 'Expert Team',
    'about.why.expert.desc': 'Top-tier engineers and architects with decades of combined experience.',
    'about.why.tailored.title': 'Tailored Solutions',
    'about.why.tailored.desc': 'Custom strategies designed specifically to meet your unique business goals.',
    'about.why.future.title': 'Future-Proof Tech',
    'about.why.future.desc': 'Leveraging the latest innovations to keep your business ahead of the curve.',
    'about.why.support.title': '24/7 Support',
    'about.why.support.desc': 'Round-the-clock dedicated support ensuring your systems never sleep.',
    
    'about.unique.title': 'Why Choose Us?',
    'about.unique.desc': 'Unlike traditional agencies, we view ourselves as your long-term technology partner. We combine deep technical expertise with business acumen to deliver solutions that not only work flawlessly but also drive tangible ROI.',
    'about.gallery.title': 'Life at Lasa',
    'about.gallery.desc': 'A glimpse into our collaborative workspace and the talented people behind our solutions.',
    'about.gallery.img1.alt': 'Team Collaboration',
    'about.gallery.img1.caption': 'Collaborative Brainstorming',
    'about.gallery.img2.alt': 'Modern Office',
    'about.gallery.img2.caption': 'Our HQ',
    'about.gallery.img3.alt': 'Development Team',
    'about.gallery.img3.caption': 'Engineering Excellence',
    'about.gallery.img4.alt': 'Strategic Meeting',
    'about.gallery.img4.caption': 'Strategic Planning',

    // Contact Page
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have a project in mind? We would love to hear from you.',
    'contact.info.title': 'Contact Information',
    'contact.address.label': 'Visit Us',
    'contact.address.value': '123 Tech Boulevard, Innovation District, Silicon Valley, CA 94025',
    'contact.phone.label': 'Call Us',
    'contact.email.label': 'Email Us',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Your Email',
    'contact.form.message': 'Message',
    'contact.social.title': 'Follow Us',

    // Admin - Headers & UI
    'admin.title': 'Service CMS',
    'admin.reset': 'Reset Data',
    'admin.reset.tooltip': 'Restores default services and removes all changes',
    'admin.generating': 'Generating magic...',
    'admin.saving': 'Saving...',
    'admin.preview': 'Live Preview',
    'admin.preview.note': 'This is how your service will appear to visitors.',
    'admin.form.add': 'Add New Service',
    'admin.form.edit': 'Edit Service',
    'admin.form.cancel': 'Cancel',
    
    // Admin - Inputs
    'admin.lang.en': 'English',
    'admin.lang.ar': 'Arabic (العربية)',
    'admin.label.title_en': 'Service Title (English)',
    'admin.label.desc_en': 'Service Description (English)',
    'admin.label.title_ar': 'Service Title (Arabic)',
    'admin.label.desc_ar': 'Service Description (Arabic)',
    'admin.label.category': 'Category',
    'admin.label.category_new': 'New Category Name',
    'admin.label.slug': 'URL Slug',
    'admin.label.icon': 'Service Icon',
    'admin.cat.create_new': '+ Create New Category',
    'admin.cat.back': 'Back to List',
    
    // Admin - Buttons
    'admin.btn.preset': 'Preset',
    'admin.btn.custom': 'Custom Upload',
    'admin.btn.generate': 'Auto-Generate',
    'admin.btn.submit_add': 'Add Service',
    'admin.btn.submit_update': 'Update Service',
    'admin.btn.delete_bulk': 'Delete',
    
    // Admin - AI Settings
    'admin.ai.label': 'AI Settings:',
    'admin.ai.tooltip.tone': 'Select the tone of the generated description',
    'admin.ai.tooltip.length': 'Select the desired length of the description',
    'admin.ai.tone.professional': 'Professional',
    'admin.ai.tone.friendly': 'Friendly',
    'admin.ai.tone.innovative': 'Innovative',
    'admin.ai.tone.technical': 'Technical',
    'admin.ai.tone.formal': 'Formal',
    'admin.ai.tone.enthusiastic': 'Enthusiastic',
    'admin.ai.tone.concise': 'Concise',
    'admin.ai.len.short': 'Short',
    'admin.ai.len.medium': 'Medium',
    'admin.ai.len.long': 'Long',

    // Admin - Filters/Sort
    'admin.header.services': 'Services',
    'admin.placeholder.search': 'Search services...',
    'admin.filter.all': 'All Categories',
    'admin.sort.title': 'Title',
    'admin.sort.category': 'Category',
    'admin.sort.date': 'Date',
    'admin.select.all': 'Select All Visible',
    'admin.empty': 'No services found matching your criteria.',
    'admin.filter.tooltip': 'Filter services by category',
    'admin.sort.tooltip': 'Sort services',
    'admin.sort_dir.tooltip': 'Toggle sort direction',

    // Validation & Errors
    'error.file_size': 'File is too large. Please upload an image under 500KB.',
    'error.file_type': 'Invalid file type. Please upload an image (JPG, PNG, SVG).',
    'error.api_key': 'API Key is missing.',
    'error.gen_fail': 'Failed to generate content.',

    // Toasts
    'toast.save_success': 'Service saved successfully!',
    'toast.delete_success': 'Service deleted successfully!',
    'toast.bulk_delete_success': 'Selected services deleted successfully!',
    'toast.reset_success': 'Data reset to defaults!',

    // Modals - Titles
    'modal.delete.title': 'Delete Service',
    'modal.delete_bulk.title': 'Delete Multiple Services',
    'modal.reset.title': 'Reset Data',
    'modal.save.title': 'Update Service',
    'modal.add.title': 'Add New Service',
    'modal.publish': 'Publish Service',

    // Modals - Messages
    'modal.delete.message': 'Are you sure you want to delete this service? This action cannot be undone and will permanently remove the service from the public view.',
    'modal.delete_bulk.message': 'Are you sure you want to delete these {count} selected services? This action cannot be undone.',
    'modal.reset.message': 'WARNING: This will delete all custom changes, images, and services you have added. The database will be restored to the initial default state. Are you sure?',
    'modal.save.message': 'Are you sure you want to save the changes to this service?',
    'modal.add.message': 'Are you sure you want to publish this new service to the live site?',

    // Categories
    'category.Development': 'Development',
    'category.Cloud & Infrastructure': 'Cloud & Infrastructure',
    'category.Security': 'Security',
    'category.Data & Analytics': 'Data & Analytics',
    'category.Consulting': 'Consulting',
    'category.Design & UX': 'Design & UX',
    'category.Artificial Intelligence': 'Artificial Intelligence',
  },
  ar: {
    // General
    'app.title': 'لاسا للتكنولوجيا',
    'btn.cancel': 'إلغاء',
    'btn.confirm': 'تأكيد',
    'btn.save': 'حفظ',
    'btn.edit': 'تعديل',
    'btn.delete': 'حذف',
    'btn.update': 'تحديث',
    'btn.add': 'إضافة',
    'btn.send_message': 'إرسال الرسالة',

    // Nav
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.admin': 'لوحة التحكم',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.empowering': 'تمكين الشركات من خلال حلول تقنية مبتكرة.',
    'footer.services': 'الخدمات',
    'footer.connect': 'تواصل معنا',

    // Home
    'home.welcome': 'نستقبل مشاريع جديدة',
    'home.explore': 'تصفح الخدمات',
    'home.client_login': 'دخول العملاء',
    'home.hero.title_start': 'ابتكر مع',
    'home.hero.title_end': 'تقنيات المستقبل',
    'home.hero.description': 'تقدم لاسا للتكنولوجيا حلولاً برمجية مؤسسية، وهندسة سحابية، وخدمات أمنية مصممة لتنمو مع طموحك.',

    // Home Vision
    'home.vision.title': 'المستقبل بين يديك',
    'home.vision.subtitle': 'استكشف مستقبل الابتكار من خلال لاسا للتكنولوجيا، حيث نقدم التطورات ورؤى المستقبل بوضوح من خلال مفاهيم بصرية.',
    'home.vision.card1.title': 'التسويق الرقمي',
    'home.vision.card1.desc': 'حلول استراتيجية للتسويق عبر الإنترنت لتعزيز رؤية علامتك التجارية، والتفاعل مع جمهورك المستهدف، وزيادة التحويلات من خلال تحسين محركات البحث، ووسائل التواصل الاجتماعي، والإعلانات الموجهة.',
    'home.vision.card2.title': 'الصيانة والدعم',
    'home.vision.card2.desc': 'مساعدة تقنية شاملة على مدار الساعة وصيانة استباقية للنظام لضمان بقاء بنيتك التحتية مرنة وآمنة وعالية الأداء.',
    'home.vision.card3.title': 'الاستضافة والنطاقات',
    'home.vision.card3.desc': 'حلول استضافة موثوقة وعالية السرعة وإدارة سلسة للنطاقات لترسيخ التواجد الرقمي لعلامتك التجارية.',

    // Home Gallery
    'home.gallery.title': 'خبراتنا المتخصصة',
    'home.gallery.subtitle': 'عرض لقدراتنا في تقديم حلول رقمية عالمية المستوى عبر مختلف الصناعات.',
    'home.gallery.mobile.title': 'تطوير تطبيقات الهاتف',
    'home.gallery.mobile.desc': 'صياغة تجارب هاتفية سلسة (أصلية وهجينة) لأنظمة iOS و Android.',
    'home.gallery.ecommerce.title': 'تطوير التجارة الإلكترونية',
    'home.gallery.ecommerce.desc': 'بناء متاجر إلكترونية آمنة وعالية التحويل مخصصة لنموذج عملك.',
    'home.gallery.uiux.title': 'تصميم واجهة وتجربة المستخدم',
    'home.gallery.uiux.desc': 'تفكير تصميمي يركز على المستخدم يسد الفجوة بين الجمال والوظيفة.',
    'home.gallery.web.title': 'تطوير تطبيقات الويب',
    'home.gallery.web.desc': 'تطبيقات ويب على مستوى المؤسسات مبنية باستخدام أطر عمل حديثة وقابلة للتطوير.',

    // Home Features
    'home.feature.rapid.title': 'نشر سريع',
    'home.feature.rapid.desc': 'منهجيات مرنة تضمن سرعة الوصول إلى السوق.',
    'home.feature.security.title': 'أمان المؤسسات',
    'home.feature.security.desc': 'بروتوكولات أمان بمستوى البنوك لحماية بياناتك الحساسة.',
    'home.feature.scalable.title': 'بنية قابلة للتوسع',
    'home.feature.scalable.desc': 'أنظمة مصممة لتنمو بسلاسة مع قاعدة المستخدمين الخاصة بك.',

    // Services Page
    'services.header.title': 'خبراتنا',
    'services.header.subtitle': 'حلول تقنية شاملة مصممة لدفع عملك إلى الأمام في العصر الرقمي.',
    'services.empty': 'لم يتم العثور على خدمات في هذه الفئة.',
    'services.loading': 'جاري تحميل الخدمات...',

    // About Page
    'about.title': 'عن لاسا للتكنولوجيا',
    'about.subtitle': 'نبني المستقبل الرقمي، حلًا تلو الآخر.',
    'about.mission.title': 'مهمتنا',
    'about.mission.desc': 'في لاسا للتكنولوجيا، مهمتنا هي إتاحة الوصول إلى التكنولوجيا على مستوى المؤسسات للجميع. نسعى لسد الفجوة بين التحديات التقنية المعقدة ونجاح الأعمال، من خلال توفير حلول قابلة للتطوير وآمنة ومبتكرة تمكن المؤسسات من الازدهار في مشهد رقمي سريع التطور.',
    'about.values.title': 'قيمنا الجوهرية',
    'about.value.innovation.title': 'الابتكار',
    'about.value.innovation.desc': 'ندفع الحدود باستمرار لإيجاد طرق أفضل وأكثر ذكاءً لحل المشكلات.',
    'about.value.integrity.title': 'النزاهة',
    'about.value.integrity.desc': 'نبني الثقة من خلال الشفافية والصدق والمساءلة في كل سطر من التعليمات البرمجية.',
    'about.value.excellence.title': 'التميز',
    'about.value.excellence.desc': 'نحن ملتزمون بأعلى معايير الجودة في الهندسة والتصميم.',
    
    // About - Timeline
    'about.journey.title': 'رحلتنا',
    'about.journey.2018.title': 'التأسيس',
    'about.journey.2018.desc': 'تأسست برؤية لتبسيط التكنولوجيا للمؤسسات.',
    'about.journey.2020.title': 'مشاريع عالمية',
    'about.journey.2020.desc': 'أنجزت لاسا تك العديد من المشاريع لعملاء دوليين.',
    'about.journey.2022.title': 'طموحات مستقبلية',
    'about.journey.2022.desc': 'نهدف إلى تحقيق مرتبة الشريك المميز في المجالات التكنولوجية الكبرى.',
    'about.journey.2024.title': 'مجموعة برمجية',
    'about.journey.2024.desc': 'أطلقنا مجموعة مشاريع مملوكة مصممة خصيصًا للمؤسسات.',

    // About - Why Choose Us
    'about.why.title': 'لماذا تختارنا؟',
    'about.why.expert.title': 'فريق خبير',
    'about.why.expert.desc': 'مهندسون ومعماريون من الطراز الأول يتمتعون بعقود من الخبرة المشتركة.',
    'about.why.tailored.title': 'حلول مخصصة',
    'about.why.tailored.desc': 'استراتيجيات مخصصة مصممة خصيصًا لتلبية أهداف عملك الفريدة.',
    'about.why.future.title': 'تكنولوجيا المستقبل',
    'about.why.future.desc': 'الاستفادة من أحدث الابتكارات لإبقاء عملك في الطليعة.',
    'about.why.support.title': 'دعم 24/7',
    'about.why.support.desc': 'دعم مخصص على مدار الساعة لضمان استمرار عمل أنظمتك.',

    'about.unique.title': 'لماذا تختارنا؟',
    'about.unique.desc': 'على عكس الوكالات التقليدية، نعتبر أنفسنا شريكك التكنولوجي طويل الأمد. نجمع بين الخبرة التقنية العميقة والفطنة التجارية لتقديم حلول لا تعمل بسلاسة فحسب، بل تحقق أيضًا عائداً ملموساً على الاستثمار.',
    'about.gallery.title': 'الحياة في لاسا',
    'about.gallery.desc': 'لمحة عن مساحة عملنا التعاونية والأشخاص الموهوبين وراء حلولنا.',
    'about.gallery.img1.alt': 'تعاون الفريق',
    'about.gallery.img1.caption': 'عصف ذهني جماعي',
    'about.gallery.img2.alt': 'مكتب حديث',
    'about.gallery.img2.caption': 'مقرنا الرئيسي',
    'about.gallery.img3.alt': 'فريق التطوير',
    'about.gallery.img3.caption': 'التميز الهندسي',
    'about.gallery.img4.alt': 'اجتماع استراتيجي',
    'about.gallery.img4.caption': 'تخطيط استراتيجي',

    // Contact Page
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'هل لديك مشروع في الاعتبار؟ نود أن نسمع منك.',
    'contact.info.title': 'معلومات الاتصال',
    'contact.address.label': 'قم بزيارتنا',
    'contact.address.value': '123 شارع التكنولوجيا، حي الابتكار، وادي السيليكون، كاليفورنيا 94025',
    'contact.phone.label': 'اتصل بنا',
    'contact.email.label': 'راسلنا',
    'contact.form.name': 'اسمك',
    'contact.form.email': 'بريدك الإلكتروني',
    'contact.form.message': 'الرسالة',
    'contact.social.title': 'تابعنا',

    // Admin - Headers & UI
    'admin.title': 'نظام إدارة الخدمات',
    'admin.reset': 'إعادة تعيين البيانات',
    'admin.reset.tooltip': 'يستعيد الخدمات الافتراضية ويزيل جميع التغييرات',
    'admin.generating': 'جاري التوليد...',
    'admin.saving': 'جاري الحفظ...',
    'admin.preview': 'معاينة حية',
    'admin.preview.note': 'هكذا ستظهر خدمتك للزوار.',
    'admin.form.add': 'إضافة خدمة جديدة',
    'admin.form.edit': 'تعديل الخدمة',
    'admin.form.cancel': 'إلغاء',

    // Admin - Inputs
    'admin.lang.en': 'الإنجليزية (English)',
    'admin.lang.ar': 'العربية',
    'admin.label.title_en': 'عنوان الخدمة (إنجليزي)',
    'admin.label.desc_en': 'وصف الخدمة (إنجليزي)',
    'admin.label.title_ar': 'عنوان الخدمة (عربي)',
    'admin.label.desc_ar': 'وصف الخدمة (عربي)',
    'admin.label.category': 'الفئة',
    'admin.label.category_new': 'اسم الفئة الجديدة',
    'admin.label.slug': 'الرابط المختصر',
    'admin.label.icon': 'أيقونة الخدمة',
    'admin.cat.create_new': '+ إنشاء فئة جديدة',
    'admin.cat.back': 'العودة للقائمة',

    // Admin - Buttons
    'admin.btn.preset': 'جاهز',
    'admin.btn.custom': 'رفع مخصص',
    'admin.btn.generate': 'توليد تلقائي',
    'admin.btn.submit_add': 'إضافة الخدمة',
    'admin.btn.submit_update': 'تحديث الخدمة',
    'admin.btn.delete_bulk': 'حذف',

    // Admin - AI Settings
    'admin.ai.label': 'إعدادات الذكاء الاصطناعي:',
    'admin.ai.tooltip.tone': 'اختر نبرة الوصف الذي سيتم توليده',
    'admin.ai.tooltip.length': 'اختر الطول المطلوب للوصف',
    'admin.ai.tone.professional': 'احترافي',
    'admin.ai.tone.friendly': 'ودود',
    'admin.ai.tone.innovative': 'مبتكر',
    'admin.ai.tone.technical': 'تقني',
    'admin.ai.tone.formal': 'رسمي',
    'admin.ai.tone.enthusiastic': 'حماسي',
    'admin.ai.tone.concise': 'موجز',
    'admin.ai.len.short': 'قصير',
    'admin.ai.len.medium': 'متوسط',
    'admin.ai.len.long': 'طويل',

    // Admin - Filters/Sort
    'admin.header.services': 'الخدمات',
    'admin.placeholder.search': 'بحث في الخدمات...',
    'admin.filter.all': 'جميع الفئات',
    'admin.sort.title': 'العنوان',
    'admin.sort.category': 'الفئة',
    'admin.sort.date': 'التاريخ',
    'admin.select.all': 'تحديد كل الظاهر',
    'admin.empty': 'لم يتم العثور على خدمات مطابقة لمعايير البحث.',
    'admin.filter.tooltip': 'تصفية الخدمات حسب الفئة',
    'admin.sort.tooltip': 'فرز الخدمات',
    'admin.sort_dir.tooltip': 'تبديل اتجاه الفرز',

    // Validation & Errors
    'error.file_size': 'الملف كبير جداً. يرجى رفع صورة أقل من 500 كيلوبايت.',
    'error.file_type': 'نوع الملف غير صالح. يرجى رفع صورة (JPG, PNG, SVG).',
    'error.api_key': 'مفتاح API مفقود.',
    'error.gen_fail': 'فشل في توليد المحتوى.',

    // Toasts
    'toast.save_success': 'تم حفظ الخدمة بنجاح!',
    'toast.delete_success': 'تم حذف الخدمة بنجاح!',
    'toast.bulk_delete_success': 'تم حذف الخدمات المحددة بنجاح!',
    'toast.reset_success': 'تمت استعادة البيانات الافتراضية!',

    // Modals - Titles
    'modal.delete.title': 'حذف الخدمة',
    'modal.delete_bulk.title': 'حذف خدمات متعددة',
    'modal.reset.title': 'إعادة تعيين البيانات',
    'modal.save.title': 'تحديث الخدمة',
    'modal.add.title': 'إضافة خدمة جديدة',
    'modal.publish': 'نشر الخدمة',

    // Modals - Messages
    'modal.delete.message': 'هل أنت متأكد أنك تريد حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء وسيتم إزالة الخدمة بشكل دائم من العرض العام.',
    'modal.delete_bulk.message': 'هل أنت متأكد أنك تريد حذف هذه الخدمات المحددة ({count})؟ لا يمكن التراجع عن هذا الإجراء.',
    'modal.reset.message': 'تحذير: سيؤدي هذا إلى حذف جميع التغييرات والصور والخدمات المخصصة التي أضفتها. ستتم استعادة قاعدة البيانات إلى الحالة الافتراضية الأولية. هل أنت متأكد؟',
    'modal.save.message': 'هل أنت متأكد أنك تريد حفظ التغييرات على هذه الخدمة؟',
    'modal.add.message': 'هل أنت متأكد أنك تريد نشر هذه الخدمة الجديدة على الموقع المباشر؟',

    // Categories
    'category.Development': 'تطوير',
    'category.Cloud & Infrastructure': 'السحابة والبنية التحتية',
    'category.Security': 'الأمن والحماية',
    'category.Data & Analytics': 'البيانات والتحليلات',
    'category.Consulting': 'استشارات',
    'category.Design & UX': 'التصميم وتجربة المستخدم',
    'category.Artificial Intelligence': 'الذكاء الاصطناعي',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar') ? 'ar' : 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = dir;
    localStorage.setItem('language', language);
  }, [language, dir]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
