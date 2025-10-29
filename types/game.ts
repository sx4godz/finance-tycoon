export type BusinessCategory = 
  | 'FOOD_BEV' 
  | 'RETAIL_SERVICES' 
  | 'TECH_APPS' 
  | 'INDUSTRIAL' 
  | 'REAL_ESTATE_SERVICES' 
  | 'FINANCE_SERVICES';

export type PropertyCategory = 'RESIDENTIAL' | 'COMMERCIAL' | 'LUXURY_DEV';

export type StockSector = 
  | 'Food' 
  | 'Retail' 
  | 'Tech' 
  | 'Industrial' 
  | 'RealEstate' 
  | 'Services' 
  | 'Tourism' 
  | 'Energy';

export type VolatilityTier = 'LOW' | 'MED' | 'HIGH';

export type EconomicPhaseType = 'expansion' | 'peak' | 'recession' | 'trough' | 'recovery';

export type MarketEventType = 'boom' | 'crash' | 'emergency' | 'holiday';

export interface BusinessUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  unlocked: boolean;
  
  revenueAdd?: number;
  employeeEfficiency?: number;
  costReduction?: number;
  marketingUpkeep?: number;
}

export interface Business {
  id: string;
  name: string;
  icon: string;
  category: BusinessCategory;
  subtype: string;
  
  baseRevenuePH: number;
  baseCost: number;
  
  level: number;
  owned: boolean;
  autoGenerate: boolean;
  
  upgradeE: number;
  upgradeQ: number;
  upgradeM: number;
  upgradeA: number;
  upgradeS: number;
  
  revenuePerHour: number;
  employeeCostPerHour: number;
  operationsCostPerHour: number;
  marketingCostPerHour: number;
  totalCostsPerHour: number;
  netIncomePerHour: number;
  
  priceIndex: number;
  
  purchasePrice: number;
  totalInvested: number;
  
  imageUrl?: string;
}

export interface PropertyUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  unlocked: boolean;
  
  maintenanceReduction?: number;
  incomeAdd?: number;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  rentBonus: number;
  maintenanceAdd: number;
  vacancyReduction?: number;
  unlocked: boolean;
  cost: number;
}

export interface Property {
  id: string;
  name: string;
  icon: string;
  category: PropertyCategory;
  subtype: string;
  
  baseCost: number;
  baseIncomePH: number;
  
  level: number;
  owned: boolean;
  
  upgradeSmartMgmt: number;
  upgradeRenovation: number;
  
  amenities: string[];
  tenantQuality: 'A' | 'B' | 'C';
  vacancyRate: number;
  
  value: number;
  
  incomePerHour: number;
  maintenancePerHour: number;
  taxesPerSec: number;
  insurancePerSec: number;
  netIncomePerHour: number;
  
  purchasePrice: number;
  
  imageUrl?: string;
}

export interface LuxuryUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  multiplierAdd: number;
  unlocked: boolean;
}

export interface LuxuryItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  owned: boolean;
  
  baseMultiplier: number;
  currentMultiplier: number;
  
  prestigeRequirement: number;
  brandScore: number;
  
  upgradePolish: number;
  upgradeRefit: number;
  upgradeEntourage: boolean;
  
  description: string;
  imageUrl?: string;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  sector: StockSector;
  volatility: VolatilityTier;
  
  basePrice: number;
  currentPrice: number;
  sharesOwned: number;
  
  priceHistory: number[];
}

export interface TapUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  baseCost: number;
  multiplier: number;
}

export interface Multiplier {
  id: string;
  name: string;
  description: string;
  level: number;
  baseCost: number;
  multiplierValue: number;
  imageUrl?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward: number;
}

export interface MarketEvent {
  id: string;
  type: MarketEventType;
  title: string;
  description: string;
  effect: string;
  duration: number;
  startTime: number;
  active: boolean;
  
  revenueMultiplier?: number;
  costsMultiplier?: number;
  affectedCategories?: BusinessCategory[];
  affectedSectors?: StockSector[];
}

export interface EconomicPhase {
  phase: EconomicPhaseType;
  duration: number;
  startTime: number;
  multiplier: number;
}

export interface RegionalModifiers {
  housingPriceIndex: number;
  tourismIndex: number;
  businessRentDemand: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'earnings' | 'businesses' | 'properties' | 'stocks' | 'luxury' | 'prestige' | 'trading' | 'efficiency';
  target: number;
  reward: number;
  rewardType: 'cash' | 'multiplier' | 'unlock' | 'prestige';
  unlocked: boolean;
  completed: boolean;
  category: 'daily' | 'weekly' | 'monthly' | 'lifetime' | 'prestige';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  requirements?: {
    minPrestige?: number;
    minNetWorth?: number;
    minBusinesses?: number;
  };
  progress?: number;
}

export interface GameState {
  cash: number;
  
  businesses: Business[];
  properties: Property[];
  luxuryItems: LuxuryItem[];
  stocks: Stock[];
  
  totalEarnings: number;
  totalSpent: number;
  netWorth: number;
  lastSaveTime: number;
  
  tapPower: TapUpgrade;
  multipliers: Multiplier[];
  lifetimeTaps: number;
  
  achievements: Achievement[];
  goals: Goal[];
  
  prestigeLevel: number;
  prestigeMultiplier: number;
  
  economicPhase: EconomicPhase;
  marketSentiment: number;
  efficiencyMultiplier: number;
  lastEconomicUpdate: number;
  
  regionalModifiers: RegionalModifiers;
  
  activeMarketEvents: MarketEvent[];
  lastEventTime: number;
  
  brandInfluenceScore: number;
  charityDonationRate: number;
  
  tradingUnlocked: boolean;
  stockRealizedProfits: number;
  
  isPremium: boolean;
  adsWatched: number;
  lastAdWatchTime: number;
  lastForcedAdTime: number;
  userActionsSinceAd: number;
  freeUpgradeAdsWatched: number;
  lastFreeUpgradeAdTime: number;
  lastDoubleEarningsPopup: number;
  doubleEarningsEndTime: number;
  sessionStartTime: number;
  lastFreeUpgradeAvailableTime: number;
  
  lastGoalReset: number;
}
