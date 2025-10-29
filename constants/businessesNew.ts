import { Business, BusinessCategory } from '@/types/game';

const createBusiness = (data: {
  id: string;
  name: string;
  icon: string;
  category: BusinessCategory;
  subtype: string;
  baseRevenuePH: number;
  baseCost: number;
  imageUrl?: string;
}): Business => ({
  id: data.id,
  name: data.name,
  icon: data.icon,
  category: data.category,
  subtype: data.subtype,
  baseRevenuePH: data.baseRevenuePH,
  baseCost: data.baseCost,
  level: 0,
  owned: false,
  autoGenerate: false,
  upgradeE: 0,
  upgradeQ: 0,
  upgradeM: 0,
  upgradeA: 0,
  upgradeS: 0,
  revenuePerHour: 0,
  employeeCostPerHour: 0,
  operationsCostPerHour: 0,
  marketingCostPerHour: 0,
  totalCostsPerHour: 0,
  netIncomePerHour: 0,
  priceIndex: 1.0,
  purchasePrice: 0,
  totalInvested: 0,
  imageUrl: data.imageUrl,
});

export const INITIAL_BUSINESSES_NEW: Business[] = [
  createBusiness({
    id: 'b1',
    name: 'Lemonade Stand',
    icon: '🍋',
    category: 'FOOD_BEV',
    subtype: 'Lemonade',
    baseRevenuePH: 30,
    baseCost: 100,
    imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f2d?w=800',
  }),
  
  createBusiness({
    id: 'b2',
    name: 'Food Truck',
    icon: '🚚',
    category: 'FOOD_BEV',
    subtype: 'FoodTruck',
    baseRevenuePH: 120,
    baseCost: 600,
    imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800',
  }),
  
  createBusiness({
    id: 'b3',
    name: 'Corner Store',
    icon: '🏪',
    category: 'RETAIL_SERVICES',
    subtype: 'CornerStore',
    baseRevenuePH: 450,
    baseCost: 3200,
  }),
  
  createBusiness({
    id: 'b4',
    name: 'Coffee Chain',
    icon: '☕',
    category: 'FOOD_BEV',
    subtype: 'Cafe',
    baseRevenuePH: 1200,
    baseCost: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
  }),
  
  createBusiness({
    id: 'b5',
    name: 'Online Boutique',
    icon: '🛍️',
    category: 'TECH_APPS',
    subtype: 'eShop',
    baseRevenuePH: 3500,
    baseCost: 40000,
  }),
  
  createBusiness({
    id: 'b6',
    name: 'FinTech App',
    icon: '💳',
    category: 'TECH_APPS',
    subtype: 'FinTech',
    baseRevenuePH: 8000,
    baseCost: 120000,
  }),
  
  createBusiness({
    id: 'b7',
    name: 'Small Factory',
    icon: '🏭',
    category: 'INDUSTRIAL',
    subtype: 'SmallFactory',
    baseRevenuePH: 18000,
    baseCost: 320000,
  }),
  
  createBusiness({
    id: 'b8',
    name: 'Car Wash Chain',
    icon: '🚗',
    category: 'RETAIL_SERVICES',
    subtype: 'CarWash',
    baseRevenuePH: 25000,
    baseCost: 550000,
  }),
  
  createBusiness({
    id: 'b9',
    name: 'SaaS Company',
    icon: '☁️',
    category: 'TECH_APPS',
    subtype: 'SaaS',
    baseRevenuePH: 42000,
    baseCost: 900000,
  }),
  
  createBusiness({
    id: 'b10',
    name: 'Assembly Line',
    icon: '⚙️',
    category: 'INDUSTRIAL',
    subtype: 'AssemblyLine',
    baseRevenuePH: 75000,
    baseCost: 1800000,
  }),
  
  createBusiness({
    id: 'b11',
    name: 'Real Estate Brokerage',
    icon: '🏢',
    category: 'REAL_ESTATE_SERVICES',
    subtype: 'Brokerage',
    baseRevenuePH: 125000,
    baseCost: 3500000,
  }),
  
  createBusiness({
    id: 'b12',
    name: 'Mobile Game Studio',
    icon: '🎮',
    category: 'TECH_APPS',
    subtype: 'MobileGame',
    baseRevenuePH: 220000,
    baseCost: 7000000,
  }),
  
  createBusiness({
    id: 'b13',
    name: 'Warehouse Network',
    icon: '📦',
    category: 'INDUSTRIAL',
    subtype: 'Warehouse',
    baseRevenuePH: 380000,
    baseCost: 14000000,
  }),
  
  createBusiness({
    id: 'b14',
    name: 'Consultancy Firm',
    icon: '💼',
    category: 'FINANCE_SERVICES',
    subtype: 'Consultancy',
    baseRevenuePH: 650000,
    baseCost: 28000000,
  }),
  
  createBusiness({
    id: 'b15',
    name: 'Restaurant Chain',
    icon: '🍴',
    category: 'FOOD_BEV',
    subtype: 'RestaurantChain',
    baseRevenuePH: 1100000,
    baseCost: 55000000,
  }),
  
  createBusiness({
    id: 'b16',
    name: 'Accounting Network',
    icon: '📊',
    category: 'FINANCE_SERVICES',
    subtype: 'Accounting',
    baseRevenuePH: 1900000,
    baseCost: 100000000,
  }),
  
  createBusiness({
    id: 'b17',
    name: 'Recycling Plant',
    icon: '♻️',
    category: 'INDUSTRIAL',
    subtype: 'RecyclingPlant',
    baseRevenuePH: 3200000,
    baseCost: 200000000,
  }),
  
  createBusiness({
    id: 'b18',
    name: 'Ad Network',
    icon: '📱',
    category: 'TECH_APPS',
    subtype: 'AdNetwork',
    baseRevenuePH: 5500000,
    baseCost: 380000000,
  }),
  
  createBusiness({
    id: 'b19',
    name: 'Investment Bank',
    icon: '🏦',
    category: 'FINANCE_SERVICES',
    subtype: 'InvestmentBank',
    baseRevenuePH: 9500000,
    baseCost: 750000000,
  }),
  
  createBusiness({
    id: 'b20',
    name: 'Franchise Empire',
    icon: '🌍',
    category: 'FOOD_BEV',
    subtype: 'Franchise',
    baseRevenuePH: 16000000,
    baseCost: 1500000000,
  }),
];

export const AUTO_GENERATE_LEVEL = 1;
export const SECONDS_PER_HOUR = 3600;
