import { PropertyCustomization } from "@/types/game";
import { 
  UPGRADE_TIERS, 
  UPGRADE_CATEGORIES, 
  PROPERTY_UPGRADE_CONFIGS,
  COST_FORMULAS,
  BENEFIT_FORMULAS 
} from "./upgradeSystem";

export const createPropertyUpgrades = (propertyId: string, baseCost: number, propertyLevel: number = 1): PropertyCustomization[] => {
  const config = PROPERTY_UPGRADE_CONFIGS[propertyId as keyof typeof PROPERTY_UPGRADE_CONFIGS] || {
    availableCategories: ["efficiency", "quality", "sustainability"],
    baseMultiplier: 1.0,
  };

  const upgrades: PropertyCustomization[] = [];

  config.availableCategories.forEach((categoryId, index) => {
    const category = UPGRADE_CATEGORIES.find((c: any) => c.id === categoryId);
    if (!category) return;

    for (let level = 1; level <= category.maxLevel; level++) {
      const tier = UPGRADE_TIERS[Math.min(level - 1, UPGRADE_TIERS.length - 1)];
      
      const baseUpgradeCost = baseCost * 0.1;
      const currentCost = COST_FORMULAS.property(baseUpgradeCost, propertyLevel, level);
      
      const benefit = BENEFIT_FORMULAS.revenue(config.baseMultiplier, level, tier);
      
      const upgrade: PropertyCustomization = {
        id: `${propertyId}_${categoryId}_${level}`,
        name: `${tier.name} ${category.name}`,
        description: `${category.description} - Level ${level}`,
        cost: currentCost,
        maintenanceReduction: categoryId === 'efficiency' ? BENEFIT_FORMULAS.costReduction(level, tier) : undefined,
        incomeBoost: categoryId === 'capacity' ? benefit : undefined,
        valueBoost: categoryId === 'quality' ? benefit : undefined,
        taxReduction: categoryId === 'sustainability' ? BENEFIT_FORMULAS.costReduction(level, tier) * 0.5 : undefined,
        insuranceReduction: categoryId === 'efficiency' ? BENEFIT_FORMULAS.costReduction(level, tier) * 0.3 : undefined,
        unlocked: level === 1,
        category: categoryId as 'efficiency' | 'luxury' | 'security' | 'eco' | 'tech',
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
      };

      upgrades.push(upgrade);
    }
  });

  return upgrades;
};

export const updatePropertyUpgrades = (upgrades: PropertyCustomization[], propertyLevel: number, baseCost: number): PropertyCustomization[] => {
  return upgrades.map(upgrade => {
    const tier = UPGRADE_TIERS.find((t: any) => t.id === upgrade.tier);
    if (!tier) return upgrade;

    const newCost = COST_FORMULAS.property(upgrade.baseCost, propertyLevel, upgrade.level);
    const newBenefit = BENEFIT_FORMULAS.revenue(1.0, upgrade.level, tier);
    
    return {
      ...upgrade,
      currentCost: newCost,
      cost: newCost,
      benefit: newBenefit,
      maintenanceReduction: upgrade.category === 'efficiency' ? BENEFIT_FORMULAS.costReduction(upgrade.level, tier) : upgrade.maintenanceReduction,
      incomeBoost: upgrade.category === 'capacity' ? newBenefit : upgrade.incomeBoost,
      valueBoost: upgrade.category === 'quality' ? newBenefit : upgrade.valueBoost,
      taxReduction: upgrade.category === 'sustainability' ? BENEFIT_FORMULAS.costReduction(upgrade.level, tier) * 0.5 : upgrade.taxReduction,
      insuranceReduction: upgrade.category === 'efficiency' ? BENEFIT_FORMULAS.costReduction(upgrade.level, tier) * 0.3 : upgrade.insuranceReduction,
    };
  });
};

export const getAvailablePropertyUpgrades = (upgrades: PropertyCustomization[], propertyLevel: number): PropertyCustomization[] => {
  return upgrades.filter(upgrade => 
    !upgrade.unlocked && 
    propertyLevel >= upgrade.unlockRequirement &&
    !upgrade.isMaxLevel
  );
};

export const calculatePropertyUpgradeBenefits = (upgrades: PropertyCustomization[]) => {
  const unlockedUpgrades = upgrades.filter(u => u.unlocked);
  
  return unlockedUpgrades.reduce((acc, upgrade) => {
    acc.maintenanceReduction += (upgrade.maintenanceReduction || 0);
    acc.incomeBoost += (upgrade.incomeBoost || 0);
    acc.valueBoost += (upgrade.valueBoost || 0);
    acc.taxReduction += (upgrade.taxReduction || 0);
    acc.insuranceReduction += (upgrade.insuranceReduction || 0);
    return acc;
  }, {
    maintenanceReduction: 0,
    incomeBoost: 0,
    valueBoost: 0,
    taxReduction: 0,
    insuranceReduction: 0,
  });
};
