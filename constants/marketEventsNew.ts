import { MarketEvent, MarketEventType, BusinessCategory, StockSector } from '@/types/game';

interface MarketEventTemplate {
  id: string;
  type: MarketEventType;
  title: string;
  description: string;
  effect: string;
  durationMinutes: number;
  revenueMultiplier?: number;
  costsMultiplier?: number;
  affectedCategories?: BusinessCategory[];
  affectedSectors?: StockSector[];
}

const EVENT_TEMPLATES: MarketEventTemplate[] = [
  {
    id: 'boom_tech',
    type: 'boom',
    title: 'Tech Boom',
    description: 'Massive investor interest in technology sector',
    effect: '+50% revenue for Tech businesses',
    durationMinutes: 15,
    revenueMultiplier: 1.5,
    affectedCategories: ['TECH_APPS'],
    affectedSectors: ['Tech'],
  },
  
  {
    id: 'boom_food',
    type: 'boom',
    title: 'Culinary Renaissance',
    description: 'Food culture is thriving with new trends',
    effect: '+60% revenue for Food & Beverage',
    durationMinutes: 20,
    revenueMultiplier: 1.6,
    affectedCategories: ['FOOD_BEV'],
    affectedSectors: ['Food'],
  },
  
  {
    id: 'boom_retail',
    type: 'boom',
    title: 'Shopping Frenzy',
    description: 'Consumer spending hits record highs',
    effect: '+55% revenue for Retail',
    durationMinutes: 18,
    revenueMultiplier: 1.55,
    affectedCategories: ['RETAIL_SERVICES'],
    affectedSectors: ['Retail'],
  },
  
  {
    id: 'crash_global',
    type: 'crash',
    title: 'Market Crash',
    description: 'Global markets tumble on economic fears',
    effect: '-30% revenue across all sectors',
    durationMinutes: 25,
    revenueMultiplier: 0.7,
  },
  
  {
    id: 'crash_finance',
    type: 'crash',
    title: 'Banking Crisis',
    description: 'Financial sector under pressure',
    effect: '-35% revenue for Financial Services',
    durationMinutes: 30,
    revenueMultiplier: 0.65,
    affectedCategories: ['FINANCE_SERVICES'],
  },
  
  {
    id: 'emergency_supply',
    type: 'emergency',
    title: 'Supply Chain Disruption',
    description: 'Global logistics facing severe delays',
    effect: '+25% costs, -15% revenue',
    durationMinutes: 20,
    revenueMultiplier: 0.85,
    costsMultiplier: 1.25,
    affectedCategories: ['INDUSTRIAL', 'RETAIL_SERVICES'],
  },
  
  {
    id: 'emergency_energy',
    type: 'emergency',
    title: 'Energy Crisis',
    description: 'Power costs surge dramatically',
    effect: '+30% operating costs',
    durationMinutes: 25,
    costsMultiplier: 1.3,
    affectedCategories: ['INDUSTRIAL', 'TECH_APPS'],
  },
  
  {
    id: 'holiday_season',
    type: 'holiday',
    title: 'Holiday Season',
    description: 'Festive spending boosts sales',
    effect: '-30% operating costs',
    durationMinutes: 30,
    costsMultiplier: 0.7,
  },
  
  {
    id: 'holiday_tax',
    type: 'holiday',
    title: 'Tax Holiday',
    description: 'Temporary tax relief for businesses',
    effect: '-40% operating costs',
    durationMinutes: 15,
    costsMultiplier: 0.6,
  },
];

export const createMarketEvent = (template: MarketEventTemplate): MarketEvent => ({
  id: template.id,
  type: template.type,
  title: template.title,
  description: template.description,
  effect: template.effect,
  duration: template.durationMinutes * 60 * 1000,
  startTime: Date.now(),
  active: true,
  revenueMultiplier: template.revenueMultiplier,
  costsMultiplier: template.costsMultiplier,
  affectedCategories: template.affectedCategories,
  affectedSectors: template.affectedSectors,
});

export const getRandomMarketEvent = (): MarketEvent | null => {
  if (EVENT_TEMPLATES.length === 0) return null;
  const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  return createMarketEvent(template);
};

export const shouldSpawnEvent = (
  lastEventTime: number,
  minCooldownMs: number,
  spawnChance: number
): boolean => {
  const timeSinceLastEvent = Date.now() - lastEventTime;
  if (timeSinceLastEvent < minCooldownMs) return false;
  return Math.random() < spawnChance;
};

export { EVENT_TEMPLATES };
