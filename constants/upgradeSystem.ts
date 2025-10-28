// Unified Upgrade System Framework
export interface UpgradeTier {
  id: string;
  name: string;
  description: string;
  level: number;
  costMultiplier: number;
  benefitMultiplier: number;
  unlockRequirement: number;
  color: string;
  icon: string;
}

export interface UpgradeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxLevel: number;
  costFormula: (baseCost: number, level: number) => number;
  benefitFormula: (baseValue: number, level: number) => number;
}

// Upgrade Tiers - Consistent across all systems
export const UPGRADE_TIERS: UpgradeTier[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential improvements",
    level: 1,
    costMultiplier: 1.0,
    benefitMultiplier: 1.2,
    unlockRequirement: 0,
    color: "#4CAF50",
    icon: "⭐",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Significant enhancements",
    level: 2,
    costMultiplier: 2.5,
    benefitMultiplier: 1.5,
    unlockRequirement: 5,
    color: "#2196F3",
    icon: "⭐⭐",
  },
  {
    id: "expert",
    name: "Expert",
    description: "Professional-grade upgrades",
    level: 3,
    costMultiplier: 6.0,
    benefitMultiplier: 2.0,
    unlockRequirement: 15,
    color: "#FF9800",
    icon: "⭐⭐⭐",
  },
  {
    id: "master",
    name: "Master",
    description: "Elite-level improvements",
    level: 4,
    costMultiplier: 15.0,
    benefitMultiplier: 3.0,
    unlockRequirement: 30,
    color: "#9C27B0",
    icon: "⭐⭐⭐⭐",
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "Mythical enhancements",
    level: 5,
    costMultiplier: 40.0,
    benefitMultiplier: 5.0,
    unlockRequirement: 50,
    color: "#F44336",
    icon: "⭐⭐⭐⭐⭐",
  },
];

// Upgrade Categories - Different types of improvements
export const UPGRADE_CATEGORIES: UpgradeCategory[] = [
  {
    id: "efficiency",
    name: "Efficiency",
    description: "Improve operational efficiency",
    icon: "⚡",
    color: "#FFC107",
    maxLevel: 5,
    costFormula: (baseCost, level) => baseCost * Math.pow(2.5, level - 1),
    benefitFormula: (baseValue, level) => baseValue * (1 + level * 0.25),
  },
  {
    id: "capacity",
    name: "Capacity",
    description: "Increase production capacity",
    icon: "📈",
    color: "#4CAF50",
    maxLevel: 5,
    costFormula: (baseCost, level) => baseCost * Math.pow(3.0, level - 1),
    benefitFormula: (baseValue, level) => baseValue * (1 + level * 0.4),
  },
  {
    id: "quality",
    name: "Quality",
    description: "Enhance product/service quality",
    icon: "💎",
    color: "#2196F3",
    maxLevel: 5,
    costFormula: (baseCost, level) => baseCost * Math.pow(2.8, level - 1),
    benefitFormula: (baseValue, level) => baseValue * (1 + level * 0.35),
  },
  {
    id: "automation",
    name: "Automation",
    description: "Reduce manual labor requirements",
    icon: "🤖",
    color: "#FF9800",
    maxLevel: 5,
    costFormula: (baseCost, level) => baseCost * Math.pow(4.0, level - 1),
    benefitFormula: (baseValue, level) => baseValue * (1 + level * 0.3),
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Improve customer acquisition",
    icon: "📢",
    color: "#E91E63",
    maxLevel: 5,
    costFormula: (baseCost, level) => baseCost * Math.pow(2.2, level - 1),
    benefitFormula: (baseValue, level) => baseValue * (1 + level * 0.2),
  },
  {
    id: "sustainability",
    name: "Sustainability",
    description: "Reduce environmental impact and costs",
    icon: "🌱",
    color: "#8BC34A",
    maxLevel: 5,
    costFormula: (baseCost, level) => baseCost * Math.pow(3.5, level - 1),
    benefitFormula: (baseValue, level) => baseValue * (1 + level * 0.15),
  },
];

// Business-specific upgrade configurations
export const BUSINESS_UPGRADE_CONFIGS = {
  lemonade_stand: {
    availableCategories: ["efficiency", "capacity", "quality", "marketing"],
    baseMultiplier: 1.0,
  },
  atm: {
    availableCategories: ["efficiency", "automation", "quality"],
    baseMultiplier: 1.2,
  },
  coffee_cart: {
    availableCategories: ["efficiency", "capacity", "quality", "marketing"],
    baseMultiplier: 1.1,
  },
  tech_startup: {
    availableCategories: ["efficiency", "capacity", "quality", "automation", "sustainability"],
    baseMultiplier: 1.5,
  },
  // Add more business-specific configs...
};

// Property-specific upgrade configurations
export const PROPERTY_UPGRADE_CONFIGS = {
  studio_apt: {
    availableCategories: ["efficiency", "quality", "sustainability"],
    baseMultiplier: 1.0,
  },
  office_space: {
    availableCategories: ["efficiency", "capacity", "automation", "sustainability"],
    baseMultiplier: 1.3,
  },
  luxury_villa: {
    availableCategories: ["quality", "sustainability", "marketing"],
    baseMultiplier: 2.0,
  },
  // Add more property-specific configs...
};

// Luxury item upgrade configurations
export const LUXURY_UPGRADE_CONFIGS = {
  designer_watch: {
    availableCategories: ["quality"],
    baseMultiplier: 1.0,
  },
  luxury_car: {
    availableCategories: ["quality", "efficiency"],
    baseMultiplier: 1.2,
  },
  private_jet: {
    availableCategories: ["quality", "efficiency", "capacity"],
    baseMultiplier: 2.0,
  },
  // Add more luxury-specific configs...
};

// Global upgrade configurations
export const GLOBAL_UPGRADE_CONFIGS = {
  tap_power: {
    availableCategories: ["efficiency", "capacity"],
    baseMultiplier: 1.0,
  },
  multipliers: {
    availableCategories: ["efficiency", "quality"],
    baseMultiplier: 1.0,
  },
};

// Cost calculation formulas
export const COST_FORMULAS = {
  // Business upgrades scale with current business value
  business: (baseCost: number, businessLevel: number, upgradeLevel: number) => {
    const businessValue = baseCost * Math.pow(1.15, businessLevel - 1);
    return Math.floor(businessValue * Math.pow(2.5, upgradeLevel - 1));
  },
  
  // Property upgrades scale with property value
  property: (baseCost: number, propertyLevel: number, upgradeLevel: number) => {
    const propertyValue = baseCost * Math.pow(1.15, propertyLevel - 1);
    return Math.floor(propertyValue * Math.pow(2.8, upgradeLevel - 1));
  },
  
  // Luxury upgrades scale with luxury value
  luxury: (baseCost: number, upgradeLevel: number) => {
    return Math.floor(baseCost * Math.pow(3.0, upgradeLevel - 1));
  },
  
  // Global upgrades scale with total earnings
  global: (baseCost: number, totalEarnings: number, upgradeLevel: number) => {
    const earningsFactor = Math.max(1, Math.log10(totalEarnings / 1000));
    return Math.floor(baseCost * Math.pow(2.0, upgradeLevel - 1) * earningsFactor);
  },
};

// Benefit calculation formulas
export const BENEFIT_FORMULAS = {
  // Revenue multiplier based on upgrade level and tier
  revenue: (baseMultiplier: number, upgradeLevel: number, tier: UpgradeTier) => {
    return baseMultiplier * (1 + upgradeLevel * 0.2) * tier.benefitMultiplier;
  },
  
  // Cost reduction based on upgrade level and tier
  costReduction: (upgradeLevel: number, tier: UpgradeTier) => {
    return Math.min(0.8, upgradeLevel * 0.1 * tier.benefitMultiplier);
  },
  
  // Efficiency multiplier based on upgrade level and tier
  efficiency: (upgradeLevel: number, tier: UpgradeTier) => {
    return 1 + (upgradeLevel * 0.15 * tier.benefitMultiplier);
  },
  
  // Capacity multiplier based on upgrade level and tier
  capacity: (upgradeLevel: number, tier: UpgradeTier) => {
    return 1 + (upgradeLevel * 0.25 * tier.benefitMultiplier);
  },
};
