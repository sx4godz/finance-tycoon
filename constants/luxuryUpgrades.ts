import { LuxuryItem, LuxuryUpgrade } from "@/types/game";
import { 
  UPGRADE_TIERS, 
  UPGRADE_CATEGORIES, 
  LUXURY_UPGRADE_CONFIGS,
  COST_FORMULAS,
  BENEFIT_FORMULAS 
} from "./upgradeSystem";

// Create luxury item upgrades using the unified system
export const createLuxuryUpgrades = (luxuryId: string, baseCost: number, baseMultiplier: number): LuxuryUpgrade[] => {
  const config = LUXURY_UPGRADE_CONFIGS[luxuryId as keyof typeof LUXURY_UPGRADE_CONFIGS] || {
    availableCategories: ["quality"],
    baseMultiplier: 1.0,
  };

  const upgrades: LuxuryUpgrade[] = [];

  // Create upgrades for each available category
  config.availableCategories.forEach((categoryId, index) => {
    const category = UPGRADE_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    // Create 5 levels of upgrades for each category
    for (let level = 1; level <= category.maxLevel; level++) {
      const tier = UPGRADE_TIERS[Math.min(level - 1, UPGRADE_TIERS.length - 1)];
      
      const baseUpgradeCost = baseCost * 0.2; // Base cost is 20% of luxury item cost
      const currentCost = COST_FORMULAS.luxury(baseUpgradeCost, level);
      
      const benefit = BENEFIT_FORMULAS.revenue(config.baseMultiplier, level, tier);
      
      const upgrade: LuxuryUpgrade = {
        id: `${luxuryId}_${categoryId}_${level}`,
        name: `${tier.name} ${category.name}`,
        description: `${category.description} - Level ${level}`,
        cost: currentCost,
        category: categoryId,
        tier: tier.id,
        level: level,
        maxLevel: category.maxLevel,
        baseCost: baseUpgradeCost,
        currentCost: currentCost,
        benefit: benefit,
        isMaxLevel: level === category.maxLevel,
        unlockRequirement: tier.unlockRequirement,
        icon: tier.icon,
        color: tier.color,
        unlocked: level === 1, // First level is always unlocked
      };

      upgrades.push(upgrade);
    }
  });

  return upgrades;
};

// Create luxury item with upgrades
export const createLuxuryItemWithUpgrades = (baseItem: Omit<LuxuryItem, 'upgrades' | 'level' | 'maxLevel' | 'baseCost' | 'currentCost' | 'baseMultiplier' | 'currentMultiplier'>): LuxuryItem => {
  const upgrades = createLuxuryUpgrades(baseItem.id, baseItem.cost, baseItem.multiplierBonus);
  
  return {
    ...baseItem,
    upgrades,
    level: 1,
    maxLevel: 5,
    baseCost: baseItem.cost,
    currentCost: baseItem.cost,
    baseMultiplier: baseItem.multiplierBonus,
    currentMultiplier: baseItem.multiplierBonus,
  };
};

// Update luxury item upgrades
export const updateLuxuryUpgrades = (upgrades: LuxuryUpgrade[], luxuryLevel: number, baseCost: number): LuxuryUpgrade[] => {
  return upgrades.map(upgrade => {
    const tier = UPGRADE_TIERS.find(t => t.id === upgrade.tier);
    if (!tier) return upgrade;

    const newCost = COST_FORMULAS.luxury(upgrade.baseCost, upgrade.level);
    const newBenefit = BENEFIT_FORMULAS.revenue(1.0, upgrade.level, tier);
    
    return {
      ...upgrade,
      currentCost: newCost,
      cost: newCost,
      benefit: newBenefit,
    };
  });
};

// Get available upgrades for a luxury item
export const getAvailableLuxuryUpgrades = (upgrades: LuxuryUpgrade[], luxuryLevel: number): LuxuryUpgrade[] => {
  return upgrades.filter(upgrade => 
    !upgrade.unlocked && 
    luxuryLevel >= upgrade.unlockRequirement &&
    !upgrade.isMaxLevel
  );
};

// Calculate total upgrade benefits for a luxury item
export const calculateLuxuryUpgradeBenefits = (upgrades: LuxuryUpgrade[]) => {
  const unlockedUpgrades = upgrades.filter(u => u.unlocked);
  
  return unlockedUpgrades.reduce((acc, upgrade) => {
    acc.multiplierBonus += upgrade.benefit;
    return acc;
  }, {
    multiplierBonus: 0,
  });
};

// Upgrade a luxury item
export const upgradeLuxuryItem = (luxuryItem: LuxuryItem, upgradeId: string): LuxuryItem => {
  const upgradeIndex = luxuryItem.upgrades.findIndex(u => u.id === upgradeId);
  if (upgradeIndex === -1) return luxuryItem;

  const upgrade = luxuryItem.upgrades[upgradeIndex];
  if (upgrade.unlocked || upgrade.isMaxLevel) return luxuryItem;

  const updatedUpgrades = [...luxuryItem.upgrades];
  updatedUpgrades[upgradeIndex] = {
    ...upgrade,
    unlocked: true,
  };

  // Calculate new multiplier
  const benefits = calculateLuxuryUpgradeBenefits(updatedUpgrades);
  const newMultiplier = luxuryItem.baseMultiplier + benefits.multiplierBonus;

  return {
    ...luxuryItem,
    upgrades: updatedUpgrades,
    currentMultiplier: newMultiplier,
    multiplierBonus: newMultiplier,
  };
};
