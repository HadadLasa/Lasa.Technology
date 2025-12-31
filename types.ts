
export interface Service {
  id: string;
  title: string;
  description: string;
  titleAr?: string;
  descriptionAr?: string;
  category: string; // Changed to string to support dynamic categories
  icon: string;
  createdAt?: number;
  slug?: string; // New field for URL-friendly ID
}

export enum ServiceCategory {
  DEVELOPMENT = 'Development',
  CLOUD = 'Cloud & Infrastructure',
  SECURITY = 'Security',
  DATA = 'Data & Analytics',
  CONSULTING = 'Consulting',
  DESIGN = 'Design & UX'
}

export const AVAILABLE_ICONS = [
  'Code',
  'Server',
  'Cloud',
  'Shield',
  'Smartphone',
  'Zap',
  'Globe',
  'Cpu',
  'Database',
  'Layout',
  'Terminal',
  'Wifi',
  'Box',
  'Layers',
  'Monitor',
  'Command',
  'Bot',
  'Brain'
] as const;

export type IconName = typeof AVAILABLE_ICONS[number];
