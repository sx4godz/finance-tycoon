import { Business, BusinessCategory, GameState } from '@/types/game';
import { GAME_CONFIG, calculateGlobalMultiplier } from '@/constants/gameConfig';

interface BusinessContext {
  elasticity?: number;
  priceIndex: number;
  networkEffectMult?: number;
  footTrafficIndex?: number;
  cogsRatioBase?: number;
  shrinkageRate?: number;
  infraCostAdd?: number;
  energySurcharge?: number;
  complianceCost?: number;
}

export const calculateBusinessLevelCost = (business: Business): number => {
  if (!business.owned) return business.baseCost;
  return Math.floor(
    business.baseCost * Math.pow(GAME_CONFIG.BUSINESSES.LEVEL_COST_GROWTH, business.level)
  );
};

export const calculateBusinessUpgradeCost = (
  business: Business,
  upgradeType: 'E' | 'Q' | 'M' | 'A' | 'S'
): number => {
  let currentLevel: number;
  let maxLevel: number;
  
  switch (upgradeType) {
    case 'E':
      currentLevel = business.upgradeE;
      maxLevel = GAME_CONFIG.BUSINESSES.UPGRADES.EFFICIENCY.MAX_LEVEL;
      break;
    case 'Q':
      currentLevel = business.upgradeQ;
      maxLevel = GAME_CONFIG.BUSINESSES.UPGRADES.QUALITY.MAX_LEVEL;
      break;
    case 'M':
      currentLevel = business.upgradeM;
      maxLevel = GAME_CONFIG.BUSINESSES.UPGRADES.MARKETING.MAX_LEVEL;
      break;
    case 'A':
      currentLevel = business.upgradeA;
      maxLevel = GAME_CONFIG.BUSINESSES.UPGRADES.AUTOMATION.MAX_LEVEL;
      break;
    case 'S':
      currentLevel = business.upgradeS;
      maxLevel = GAME_CONFIG.BUSINESSES.UPGRADES.SUSTAINABILITY.MAX_LEVEL;
      break;
  }
  
  if (currentLevel >= maxLevel) return Infinity;
  
  return Math.floor(
    business.baseRevenuePH * 2 * 
    Math.pow(GAME_CONFIG.BUSINESSES.LEVEL_COST_GROWTH, business.level) * 
    Math.pow(GAME_CONFIG.BUSINESSES.UPGRADE_COST_GROWTH, currentLevel)
  );
};

const getCategoryContext = (
  category: BusinessCategory,
  business: Business,
  gameState: GameState
): Partial<BusinessContext> => {
  const ctx: Partial<BusinessContext> = {};
  
  switch (category) {
    case 'FOOD_BEV':
      ctx.elasticity = GAME_CONFIG.BUSINESSES.CATEGORIES.FOOD_BEV.ELASTICITY;
      ctx.cogsRatioBase = GAME_CONFIG.BUSINESSES.CATEGORIES.FOOD_BEV.COGS_RATIO_BASE;
      
      if (business.supplyContract?.type === 'short_term') {
        ctx.cogsRatioBase += GAME_CONFIG.BUSINESSES.CATEGORIES.FOOD_BEV.VENDOR_CONTRACTS.SHORT_TERM.cogsDelta;
      } else if (business.supplyContract?.type === 'long_term') {
        ctx.cogsRatioBase += GAME_CONFIG.BUSINESSES.CATEGORIES.FOOD_BEV.VENDOR_CONTRACTS.LONG_TERM.cogsDelta;
      }
      break;
      
    case 'RETAIL_SERVICES':
      ctx.elasticity = GAME_CONFIG.BUSINESSES.CATEGORIES.RETAIL_SERVICES.ELASTICITY;
      ctx.shrinkageRate = GAME_CONFIG.BUSINESSES.CATEGORIES.RETAIL_SERVICES.SHRINKAGE_RATE;
      
      if (business.upgradeSecurity && business.upgradeSecurity > 0) {
        ctx.shrinkageRate = Math.max(
          0,
          ctx.shrinkageRate + 
          business.upgradeSecurity * GAME_CONFIG.BUSINESSES.CATEGORIES.RETAIL_SERVICES.SECURITY_UPGRADE.SHRINKAGE_DELTA_PER_LEVEL
        );
      }
      
      ctx.footTrafficIndex = business.footTrafficIndex ?? 1.0;
      break;
      
    case 'TECH_APPS':
      ctx.elasticity = GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.ELASTICITY;
      
      if (business.level >= GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_START_LEVEL) {
        const tier = Math.floor(
          (business.level - GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_START_LEVEL) / 5
        );
        ctx.networkEffectMult = 1 + GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.NETWORK_EFFECT_BASE * tier;
        ctx.infraCostAdd = GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_SLOPE * tier;
      }
      break;
      
    case 'INDUSTRIAL':
      ctx.elasticity = GAME_CONFIG.BUSINESSES.CATEGORIES.INDUSTRIAL.ELASTICITY;
      
      if (gameState.regionalModifiers.energyCostIndex > 1.1) {
        ctx.energySurcharge = GAME_CONFIG.BUSINESSES.CATEGORIES.INDUSTRIAL.LOGISTICS_SURCHARGE;
      }
      break;
      
    case 'REAL_ESTATE_SERVICES':
      ctx.elasticity = GAME_CONFIG.BUSINESSES.CATEGORIES.REAL_ESTATE_SERVICES.ELASTICITY;
      break;
      
    case 'FINANCE_SERVICES':
      ctx.elasticity = GAME_CONFIG.BUSINESSES.CATEGORIES.FINANCE_SERVICES.ELASTICITY;
      ctx.complianceCost = GAME_CONFIG.BUSINESSES.CATEGORIES.FINANCE_SERVICES.COMPLIANCE_COST;
      break;
  }
  
  ctx.priceIndex = business.priceIndex;
  return ctx;
};

export const calculateBusinessMetrics = (
  business: Business,
  gameState: GameState
): {
  revenuePerHour: number;
  employeeCostPerHour: number;
  operationsCostPerHour: number;
  marketingCostPerHour: number;
  totalCostsPerHour: number;
  netIncomePerHour: number;
} => {
  if (!business.owned || business.level === 0) {
    return {
      revenuePerHour: 0,
      employeeCostPerHour: 0,
      operationsCostPerHour: 0,
      marketingCostPerHour: 0,
      totalCostsPerHour: 0,
      netIncomePerHour: 0,
    };
  }
  
  const grossPH = business.baseRevenuePH * 
    Math.pow(GAME_CONFIG.BUSINESSES.REVENUE_GROWTH, business.level - 1);
  
  let revAdd = 0;
  revAdd += GAME_CONFIG.BUSINESSES.UPGRADES.EFFICIENCY.REV_ADD_PER_LEVEL * business.upgradeE;
  revAdd += GAME_CONFIG.BUSINESSES.UPGRADES.QUALITY.REV_ADD_PER_LEVEL * business.upgradeQ;
  revAdd += GAME_CONFIG.BUSINESSES.UPGRADES.MARKETING.REV_ADD_PER_LEVEL * business.upgradeM;
  
  if (business.upgradeRnD) {
    revAdd += GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.RND_UPGRADE.REV_ADD_PER_LEVEL * business.upgradeRnD;
  }
  
  let categoryRevenuePH = grossPH * (1 + revAdd);
  
  const ctx = getCategoryContext(business.category, business, gameState);
  
  if (ctx.networkEffectMult) {
    categoryRevenuePH *= ctx.networkEffectMult;
  }
  
  if (ctx.footTrafficIndex) {
    categoryRevenuePH *= ctx.footTrafficIndex;
  }
  
  if (ctx.elasticity !== undefined && ctx.priceIndex) {
    const elasticityEffect = 1 + ctx.elasticity * (ctx.priceIndex - 1);
    const clampedEffect = Math.max(
      GAME_CONFIG.PRICING_DEMAND.REVENUE_MULTIPLIER_CLAMP.min,
      Math.min(GAME_CONFIG.PRICING_DEMAND.REVENUE_MULTIPLIER_CLAMP.max, elasticityEffect)
    );
    categoryRevenuePH *= clampedEffect;
  }
  
  const dominanceBonus = calculateDominanceBonus(business.category, gameState);
  categoryRevenuePH *= (1 + dominanceBonus.revenueBonus);
  
  const employeeEfficiency = 1 + 
    GAME_CONFIG.BUSINESSES.UPGRADES.EFFICIENCY.EMPLOYEE_EFF_PER_LEVEL * business.upgradeE;
  
  let workforceEffMult = 1.0;
  if (business.workforce) {
    workforceEffMult = 1 + business.workforce.trainingLevel * 
      GAME_CONFIG.BUSINESSES.WORKFORCE.TRAINING_EFFICIENCY_PER_LEVEL;
  }
  
  const employees = categoryRevenuePH * GAME_CONFIG.BUSINESSES.EMPLOYEE_COST_BASE / 
    (employeeEfficiency * workforceEffMult);
  
  let operations = categoryRevenuePH * (
    business.category === 'INDUSTRIAL' 
      ? GAME_CONFIG.BUSINESSES.CATEGORIES.INDUSTRIAL.OPERATIONS_BASE 
      : GAME_CONFIG.BUSINESSES.OPERATIONS_COST_BASE
  );
  
  if (ctx.cogsRatioBase) {
    operations += categoryRevenuePH * ctx.cogsRatioBase;
  }
  if (ctx.shrinkageRate) {
    operations += categoryRevenuePH * ctx.shrinkageRate;
  }
  if (ctx.infraCostAdd) {
    operations += categoryRevenuePH * ctx.infraCostAdd;
  }
  if (ctx.energySurcharge) {
    operations += categoryRevenuePH * ctx.energySurcharge;
  }
  if (ctx.complianceCost) {
    operations += categoryRevenuePH * ctx.complianceCost;
  }
  
  const marketingUpkeepMult = (1 + 
    GAME_CONFIG.BUSINESSES.UPGRADES.MARKETING.UPKEEP_SLOPE_PER_LEVEL * business.upgradeM
  ) * (1 - dominanceBonus.marketingUpkeepReduction);
  
  const marketing = categoryRevenuePH * GAME_CONFIG.BUSINESSES.MARKETING_COST_BASE * 
    marketingUpkeepMult;
  
  const rawCostsPH = employees + operations + marketing;
  
  const automationReduction = Math.min(
    GAME_CONFIG.BUSINESSES.UPGRADES.AUTOMATION.HARD_CAP,
    GAME_CONFIG.BUSINESSES.UPGRADES.AUTOMATION.COST_REDUCTION_PER_LEVEL * business.upgradeA
  );
  const sustainabilityReduction = 
    GAME_CONFIG.BUSINESSES.UPGRADES.SUSTAINABILITY.COST_REDUCTION_PER_LEVEL * business.upgradeS;
  const costMult = (1 - automationReduction) * (1 - sustainabilityReduction);
  
  const finalCostsPH = rawCostsPH * costMult;
  
  const netPH = categoryRevenuePH - finalCostsPH;
  
  return {
    revenuePerHour: categoryRevenuePH,
    employeeCostPerHour: employees * costMult,
    operationsCostPerHour: operations * costMult,
    marketingCostPerHour: marketing * costMult,
    totalCostsPerHour: finalCostsPH,
    netIncomePerHour: netPH,
  };
};

export const calculateBusinessNetPerSecond = (
  business: Business,
  gameState: GameState
): number => {
  if (!business.autoGenerate || !business.owned) return 0;
  
  const metrics = calculateBusinessMetrics(business, gameState);
  const localNetPS = metrics.netIncomePerHour / 3600;
  
  const luxuryBonus = gameState.luxuryItems.reduce((sum, item) => {
    return item.owned ? sum + item.currentMultiplier : sum;
  }, 0);
  
  const premiumBonus = gameState.isPremium ? GAME_CONFIG.GLOBAL.PREMIUM_BONUS : 0;
  
  let eventMult = 1.0;
  gameState.activeMarketEvents.forEach(event => {
    if (!event.active) return;
    
    if (event.affectedCategories && !event.affectedCategories.includes(business.category)) {
      return;
    }
    
    if (event.revenueMultiplier) {
      eventMult *= event.revenueMultiplier;
    }
  });
  
  const sentimentMult = 0.5 + gameState.marketSentiment / 100;
  
  const globalMult = calculateGlobalMultiplier({
    prestigeLevel: gameState.prestigeLevel,
    luxuryBonus,
    premiumBonus,
    economicPhaseMult: gameState.economicPhase.multiplier,
    sentimentMult,
    efficiencyMult: gameState.efficiencyMultiplier,
    eventMult,
  });
  
  return localNetPS * globalMult;
};

export const calculateDominanceBonus = (
  category: BusinessCategory,
  gameState: GameState
): { revenueBonus: number; marketingUpkeepReduction: number } => {
  const share = gameState.categoryDominance[category] ?? 0;
  
  let revenueBonus = 0;
  let marketingUpkeepReduction = 0;
  
  for (const threshold of GAME_CONFIG.BUSINESSES.DOMINANCE.THRESHOLDS) {
    if (share >= threshold.share) {
      revenueBonus = threshold.revenueBonus;
      marketingUpkeepReduction = 'marketingUpkeepReduction' in threshold ? threshold.marketingUpkeepReduction : 0;
    }
  }
  
  return { revenueBonus, marketingUpkeepReduction };
};

export const calculateCategoryRevenue = (
  category: BusinessCategory,
  gameState: GameState
): number => {
  return gameState.businesses
    .filter(b => b.category === category && b.owned)
    .reduce((sum, b) => {
      const metrics = calculateBusinessMetrics(b, gameState);
      return sum + metrics.revenuePerHour;
    }, 0);
};

export const calculateCategoryDominance = (
  category: BusinessCategory,
  gameState: GameState
): number => {
  const playerRevenue = calculateCategoryRevenue(category, gameState);
  
  const npcBaseline = 1000000;
  const totalRevenue = playerRevenue + npcBaseline;
  
  return totalRevenue > 0 ? playerRevenue / totalRevenue : 0;
};
