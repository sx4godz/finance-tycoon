export interface BusinessUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  revenueMultiplier?: number;
  costReduction?: number;
  employeeEfficiency?: number;
  unlocked: boolean;
  category: string;
  tier: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  currentCost: number;
  benefit: number;
  isMaxLevel: boolean;
  unlockRequirement: number;
  icon: string;
  color: string;
}

export interface Business {
  id: string;
  name: string;
  icon: string;
  baseRevenue: number;
  baseCost: number;
  level: number;
  owned: boolean;
  autoGenerate: boolean;
  revenuePerHour: number;
  runningCostsPerHour: number;
  netIncomePerHour: number;
  imageUrl?: string;
  purchasePrice: number;
  totalInvested: number;
  employees: number;
  maxEmployees: number;
  employeeSalaryPerHour: number;
  maintenanceCostPerHour: number;
  utilitiesCostPerHour: number;
  marketingBudgetPerHour: number;
  category: 'financial' | 'food' | 'tech' | 'retail' | 'energy' | 'entertainment';
  operatingHours: number;
  marketingLevel: number;
  efficiencyLevel: number;
  qualityLevel: number;
  automationLevel: number;
  customerSatisfaction: number;
  reputationScore: number;
  upgrades: BusinessUpgrade[];
  totalProfit: number;
  totalRevenue: number;
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

export interface PropertyCustomization {
  id: string;
  name: string;
  description: string;
  cost: number;
  maintenanceReduction?: number;
  incomeBoost?: number;
  valueBoost?: number;
  taxReduction?: number;
  insuranceReduction?: number;
  unlocked: boolean;
  category: 'efficiency' | 'luxury' | 'security' | 'eco' | 'tech';
  tier: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  currentCost: number;
  benefit: number;
  isMaxLevel: boolean;
  unlockRequirement: number;
  icon: string;
  color: string;
}

export interface Property {
  id: string;
  name: string;
  icon: string;
  baseValue: number;
  baseCost: number;
  incomePerHour: number;
  level: number;
  owned: boolean;
  category: 'residential' | 'commercial' | 'luxury' | 'exotic';
  imageUrl?: string;
  purchasePrice: number;
  currentMarketValue: number;
  marketTrend: number;
  maintenanceCostPerHour: number;
  taxesPerMonth: number;
  insurancePerMonth: number;
  rented: boolean;
  rentIncome: number;
  customizations: PropertyCustomization[];
  tenantQuality: number;
  conditionScore: number;
  energyEfficiency: number;
  securityLevel: number;
  amenitiesLevel: number;
}

export interface LuxuryItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  owned: boolean;
  multiplierBonus: number;
  category: 'vehicle' | 'jewelry' | 'art' | 'collectible';
  description: string;
  imageUrl?: string;
  upgrades: LuxuryUpgrade[];
  level: number;
  maxLevel: number;
  baseCost: number;
  currentCost: number;
  baseMultiplier: number;
  currentMultiplier: number;
}

export interface LuxuryUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  tier: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  currentCost: number;
  benefit: number;
  isMaxLevel: boolean;
  unlockRequirement: number;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  basePrice: number;
  volatility: number;
  sharesOwned: number;
  priceHistory: number[];
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
  totalOwed: number;
  takenAt: number;
}

export interface Expense {
  type: 'tax' | 'insurance' | 'loan' | 'maintenance' | 'employee' | 'utility';
  amount: number;
  frequency: 'hourly' | 'daily' | 'monthly';
  description: string;
}

export interface MarketEvent {
  id: string;
  type: 'boom' | 'crash' | 'tax_hike' | 'emergency' | 'bonus';
  title: string;
  description: string;
  effect: string;
  duration: number;
  startTime: number;
  active: boolean;
  multiplier?: number;
  affectedSectors?: string[];
}

export interface EconomicPhase {
  phase: 'expansion' | 'peak' | 'recession' | 'trough' | 'recovery';
  duration: number;
  startTime: number;
  multiplier: number;
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

export interface EconomicIndicators {
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  consumerConfidence: number;
  marketSentiment: number;
  interestRate: number;
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
  prestigeLevel: number;
  prestigeMultiplier: number;
  tradingUnlocked: boolean;
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
  loans: Loan[];
  totalDebt: number;
  monthlyExpenses: number;
  lastExpenseCalculation: number;
  activeMarketEvents: MarketEvent[];
  isBankrupt: boolean;
  bankruptcyCount: number;
  economicPhase: EconomicPhase;
  economicIndicators: EconomicIndicators;
  goals: Goal[];
  lastGoalReset: number;
  marketSentiment: number;
  inflationRate: number;
  efficiencyMultiplier: number;
  lastEconomicUpdate: number;
}
