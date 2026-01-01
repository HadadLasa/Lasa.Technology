
import { Service, ServiceCategory } from '../types';

const STORAGE_KEY = 'lasa_services_v1';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Custom Software Development',
    titleAr: 'تطوير البرمجيات المخصصة',
    description: 'We build scalable, robust, and secure custom software solutions tailored to your unique business requirements using cutting-edge technologies.',
    descriptionAr: 'نقوم ببناء حلول برمجية قابلة للتطوير وقوية وآمنة مخصصة لمتطلبات عملك الفريدة باستخدام أحدث التقنيات.',
    category: ServiceCategory.DEVELOPMENT,
    icon: 'Code',
    createdAt: 1704067200000,
    slug: 'custom-software-development'
  },
  {
    id: '2',
    title: 'Cloud Infrastructure Migration',
    titleAr: 'ترحيل البنية التحتية السحابية',
    description: 'Seamlessly migrate your legacy systems to the cloud. We specialize in AWS, Azure, and Google Cloud Platform architectural design and implementation.',
    descriptionAr: 'قم بترحيل أنظمتك القديمة بسلاسة إلى السحابة. نحن متخصصون في التصميم والتنفيذ المعماري لـ AWS و Azure و Google Cloud Platform.',
    category: ServiceCategory.CLOUD,
    icon: 'Cloud',
    createdAt: 1704153600000,
    slug: 'cloud-infrastructure-migration'
  },
  {
    id: '3',
    title: 'Cybersecurity Audit',
    titleAr: 'تدقيق الأمن السيبراني',
    description: 'Protect your digital assets with our comprehensive security audits. We identify vulnerabilities and implement enterprise-grade defense mechanisms.',
    descriptionAr: 'احمِ أصولك الرقمية من خلال تدقيقات الأمان الشاملة التي نقدمها. نحدد الثغرات ونطبق آليات دفاع على مستوى المؤسسات.',
    category: ServiceCategory.SECURITY,
    icon: 'Shield',
    createdAt: 1704240000000,
    slug: 'cybersecurity-audit'
  },
  {
    id: '4',
    title: 'Mobile App Development',
    titleAr: 'تطوير تطبيقات الهاتف المحمول',
    description: 'Engage your customers on the go. We create intuitive, high-performance native and cross-platform mobile applications for iOS and Android.',
    descriptionAr: 'تفاعل مع عملائك أثناء التنقل. نقوم بإنشاء تطبيقات جوال أصلية وعبر المنصات بديهية وعالية الأداء لنظامي iOS و Android.',
    category: ServiceCategory.DEVELOPMENT,
    icon: 'Smartphone',
    createdAt: 1704326400000,
    slug: 'mobile-app-development'
  },
  {
    id: '5',
    title: 'Data Analytics & BI',
    titleAr: 'تحليلات البيانات وذكاء الأعمال',
    description: 'Transform raw data into actionable insights. Our data scientists utilize advanced machine learning models to forecast trends and optimize operations.',
    descriptionAr: 'تحويل البيانات الخام إلى رؤى قابلة للتنفيذ. يستخدم علماء البيانات لدينا نماذج تعلم آلي متقدمة للتنبؤ بالاتجاهات وتحسين العمليات.',
    category: ServiceCategory.DATA,
    icon: 'Database',
    createdAt: 1704412800000,
    slug: 'data-analytics-bi'
  },
  {
    id: '6',
    title: 'UI/UX Design',
    titleAr: 'تصميم واجهة وتجربة المستخدم',
    description: 'Crafting digital experiences that delight. Our user-centric design approach ensures your products are not only beautiful but also intuitive and accessible.',
    descriptionAr: 'صياغة تجارب رقمية ممتعة. يضمن نهج التصميم الذي يركز على المستخدم أن منتجاتك ليست جميلة فحسب، بل بديهية وسهلة الوصول أيضًا.',
    category: ServiceCategory.DESIGN,
    icon: 'Layout',
    createdAt: 1704499200000,
    slug: 'ui-ux-design'
  },
  {
    id: '7',
    title: 'AI-Driven Business Automation',
    titleAr: 'أتمتة الأعمال المدعومة بالذكاء الاصطناعي',
    description: 'Revolutionize your workflow with intelligent automation. We leverage advanced machine learning algorithms and generative AI to streamline complex processes, reduce manual overhead, and unlock new operational efficiencies tailored to your industry needs.',
    descriptionAr: 'أحدث ثورة في سير عملك من خلال الأتمتة الذكية. نستفيد من خوارزميات التعلم الآلي المتقدمة والذكاء الاصطناعي التوليدي لتبسيط العمليات المعقدة، وتقليل العبء اليدوي، وفتح آفاق جديدة من الكفاءة التشغيلية المصممة خصيصًا لاحتياجات مجال عملك.',
    category: 'Artificial Intelligence',
    icon: 'Bot',
    createdAt: 1704585600000,
    slug: 'ai-driven-business-automation'
  }
];

export const getServices = (): Service[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES));
      return DEFAULT_SERVICES;
    }
    const services = JSON.parse(stored);
    // Ensure data integrity (backfill slugs and dates)
    return services.map((s: Service) => ({
      ...s,
      createdAt: s.createdAt || Date.now(),
      slug: s.slug || generateSlug(s.title)
    }));
  } catch (e) {
    console.error('Failed to parse services from local storage', e);
    return DEFAULT_SERVICES;
  }
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  const services = getServices();
  return services.find(s => s.slug === slug);
};

export const saveService = (service: Service): Service[] => {
  const current = getServices();
  const index = current.findIndex(s => s.id === service.id);
  
  // Ensure slug exists
  const serviceToSave = {
    ...service,
    slug: service.slug || generateSlug(service.title),
    createdAt: service.createdAt || (index >= 0 ? current[index].createdAt : Date.now())
  };
  
  let updated: Service[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = serviceToSave;
  } else {
    updated = [...current, serviceToSave];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteService = (id: string): Service[] => {
  const current = getServices();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteServices = (ids: string[]): Service[] => {
  const current = getServices();
  const updated = current.filter(s => !ids.includes(s.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const resetServices = (): Service[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
};
