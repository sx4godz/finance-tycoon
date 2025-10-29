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

export interface SupplyContract {
  type: 'short_term' | 'long_term';
  cogsDelta: number;
  flexible: boolean;
  lockDays?: number;
  startTime: number;
}

export interface WorkforceState {
  staffSlots: number;
  staffHired: number;
  trainingLevel: number;
  wagesMultiplier: number;
  turnoverRate: number;
  satisfactionScore: number;
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
  upgradeRnD?: number;
  upgradeInfra?: number;
  upgradeSecurity?: number;
  
  revenuePerHour: number;
  employeeCostPerHour: number;
  operationsCostPerHour: number;
  marketingCostPerHour: number;
  totalCostsPerHour: number;
  netIncomePerHour: number;
  
  priceIndex: number;
  
  supplyContract?: SupplyContract;
  workforce?: WorkforceState;
  
  footTrafficIndex?: number;
  networkEffectTier?: number;
  qualityYield?: number;
  
  categoryRevenue?: number;
  categoryDominanceShare?: number;
  
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

export interface TenantQualityTier {
  tier: 'A' | 'B' | 'C';
  rentMultiplier: number;
  vacancyRate: number;
  maintenanceAdd: number;
}

export interface LeaseTerms {
  months: 6 | 12 | 24;
  startTime: number;
  rentLocked: number;
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
  upgradeScreening?: number;
  upgradeFitout?: number;
  
  amenities: string[];
  tenantQuality: 'A' | 'B' | 'C';
  vacancyRate: number;
  occupancyRate?: number;
  
  leaseTerms?: LeaseTerms;
  
  value: number;
  totalUpgradeSpend: number;
  
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
  
  entourageActive?: boolean;
  lastEntourageEvent?: number;
  
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
  averageBuyPrice?: number;
  
  priceHistory: number[];
  
  stopLoss?: number;
  takeProfit?: number;
}

export interface StockVolatilityConfig {
  LOW: number;
  MED: number;
  HIGH: number;
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
  bulkMaterialsIndex: number;
  energyCostIndex: number;
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
  lastSentimentUpdate: number;
  lastEfficiencyUpdate: number;
  
  regionalModifiers: RegionalModifiers;
  
  activeMarketEvents: MarketEvent[];
  lastEventTime: number;
  eventCooldownEnd: number;
  
  brandInfluenceScore: number;
  charityDonationRate: number;
  reputationMultiplier: number;
  
  tradingUnlocked: boolean;
  stockRealizedProfits: number;
  marginTradingUnlocked: boolean;
  
  categoryDominance: Record<BusinessCategory, number>;
  
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
  lastStockTick: number;
}
