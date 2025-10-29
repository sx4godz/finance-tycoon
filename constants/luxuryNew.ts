import { LuxuryItem } from '@/types/game';

const createLuxuryItem = (data: {
  id: string;
  name: string;
  icon: string;
  cost: number;
  baseMultiplier: number;
  prestigeRequirement: number;
  brandScore: number;
  description: string;
  imageUrl?: string;
}): LuxuryItem => ({
  id: data.id,
  name: data.name,
  icon: data.icon,
  cost: data.cost,
  owned: false,
  baseMultiplier: data.baseMultiplier,
  currentMultiplier: data.baseMultiplier,
  prestigeRequirement: data.prestigeRequirement,
  brandScore: data.brandScore,
  upgradePolish: 0,
  upgradeRefit: 0,
  upgradeEntourage: false,
  description: data.description,
  imageUrl: data.imageUrl,
});

export const INITIAL_LUXURY_ITEMS_NEW: LuxuryItem[] = [
  createLuxuryItem({
    id: 'l1',
    name: 'Designer Watch',
    icon: '⌚',
    cost: 50000,
    baseMultiplier: 0.02,
    prestigeRequirement: 0,
    brandScore: 1,
    description: 'Timepiece that commands respect',
  }),
  
  createLuxuryItem({
    id: 'l2',
    name: 'Luxury Car',
    icon: '🚗',
    cost: 250000,
    baseMultiplier: 0.04,
    prestigeRequirement: 1,
    brandScore: 2,
    description: 'High-performance vehicle that turns heads',
  }),
  
  createLuxuryItem({
    id: 'l3',
    name: 'Private Yacht',
    icon: '🛥️',
    cost: 2000000,
    baseMultiplier: 0.12,
    prestigeRequirement: 3,
    brandScore: 4,
    description: 'Floating palace for ocean adventures',
  }),
  
  createLuxuryItem({
    id: 'l4',
    name: 'Private Jet',
    icon: '✈️',
    cost: 15000000,
    baseMultiplier: 0.50,
    prestigeRequirement: 5,
    brandScore: 8,
    description: 'Ultimate symbol of wealth and power',
  }),
];
