import { BusinessUpgrade } from "@/types/game";
import { 
  UPGRADE_TIERS, 
  UPGRADE_CATEGORIES, 
  BUSINESS_UPGRADE_CONFIGS,
  COST_FORMULAS,
  BENEFIT_FORMULAS 
} from "./upgradeSystem";

export const createBusinessUpgrades = (businessId: string, baseRevenue: number, businessLevel: number = 1): BusinessUpgrade[] => {
  const config = BUSINESS_UPGRADE_CONFIGS[businessId as keyof typeof BUSINESS_UPGRADE_CONFIGS] || {
    availableCategories: ["efficiency", "capacity", "quality", "marketing"],
    baseMultiplier: 1.0,
  };

  const upgrades: BusinessUpgrade[] = [];

  config.availableCategories.forEach((categoryId, index) => {
    const category = UPGRADE_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    for (let level = 1; level <= category.maxLevel; level++) {
      const tier = UPGRADE_TIERS[Math.min(level - 1, UPGRADE_TIERS.length - 1)];
      
      const baseCost = baseRevenue * 2;
      const currentCost = COST_FORMULAS.business(baseCost, businessLevel, level);
      
      const benefit = BENEFIT_FORMULAS.revenue(config.baseMultiplier, level, tier);
      
      const upgrade: BusinessUpgrade = {
        id: `${businessId}_${categoryId}_${level}`,
        name: `${tier.name} ${category.name}`,
        description: `${category.description} - Level ${level}`,
        cost: currentCost,
        revenueMultiplier: categoryId === 'efficiency' ? benefit : undefined,
        costReduction: categoryId === 'automation' ? BENEFIT_FORMULAS.costReduction(level, tier) : undefined,
        employeeEfficiency: categoryId === 'efficiency' ? BENEFIT_FORMULAS.efficiency(level, tier) : undefined,
        unlocked: level === 1,
        category: categoryId,
        tier: tier.id,
        level: level,
        maxLevel: category.maxLevel,
        baseCost: baseCost,
        currentCost: currentCost,
        benefit: benefit,
        isMaxLevel: level === category.maxLevel,
        unlockRequirement: tier.unlockRequirement,
        icon: tier.icon,
        color: tier.color,
      };

      upgrades.push(upgrade);
    }
  });

  return upgrades;
};

export const updateBusinessUpgrades = (upgrades: BusinessUpgrade[], businessLevel: number, baseRevenue: number): BusinessUpgrade[] => {
  return upgrades.map(upgrade => {
    const tier = UPGRADE_TIERS.find(t => t.id === upgrade.tier);
    if (!tier) return upgrade;

    const newCost = COST_FORMULAS.business(upgrade.baseCost!, businessLevel, upgrade.level!);
    const newBenefit = BENEFIT_FORMULAS.revenue(1.0, upgrade.level!, tier);
    
    return {
      ...upgrade,
      currentCost: newCost,
      cost: newCost,
      benefit: newBenefit,
      revenueMultiplier: upgrade.category === 'efficiency' ? newBenefit : upgrade.revenueMultiplier,
      costReduction: upgrade.category === 'automation' ? BENEFIT_FORMULAS.costReduction(upgrade.level!, tier) : upgrade.costReduction,
      employeeEfficiency: upgrade.category === 'efficiency' ? BENEFIT_FORMULAS.efficiency(upgrade.level!, tier) : upgrade.employeeEfficiency,
    };
  });
};

export const getAvailableUpgrades = (upgrades: BusinessUpgrade[], businessLevel: number): BusinessUpgrade[] => {
  return upgrades.filter(upgrade => 
    !upgrade.unlocked && 
    businessLevel >= (upgrade.unlockRequirement ?? 0) &&
    !upgrade.isMaxLevel
  );
};

export const getNextUpgrade = (upgrades: BusinessUpgrade[], category: string): BusinessUpgrade | null => {
  const categoryUpgrades = upgrades.filter(u => u.category === category && !u.unlocked);
  return categoryUpgrades.length > 0 ? categoryUpgrades[0] : null;
};

export const calculateUpgradeBenefits = (upgrades: BusinessUpgrade[]) => {
  const unlockedUpgrades = upgrades.filter(u => u.unlocked);
  
  return unlockedUpgrades.reduce((acc, upgrade) => {
    switch (upgrade.category) {
      case 'efficiency':
        acc.revenueMultiplier *= (upgrade.revenueMultiplier || 1);
        acc.employeeEfficiency *= (upgrade.employeeEfficiency || 1);
        break;
      case 'capacity':
        acc.capacityMultiplier *= (upgrade.benefit || 1);
        break;
      case 'quality':
        acc.qualityMultiplier *= (upgrade.benefit || 1);
        break;
      case 'automation':
        acc.costReduction += (upgrade.costReduction || 0);
        break;
      case 'marketing':
        acc.marketingMultiplier *= (upgrade.benefit || 1);
        break;
      case 'sustainability':
        acc.sustainabilityMultiplier *= (upgrade.benefit || 1);
        break;
    }
    return acc;
  }, {
    revenueMultiplier: 1,
    costReduction: 0,
    employeeEfficiency: 1,
    capacityMultiplier: 1,
    qualityMultiplier: 1,
    marketingMultiplier: 1,
    sustainabilityMultiplier: 1,
  });
};
