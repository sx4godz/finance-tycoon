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
}

export const calculateBusinessLevelCost = (business: Business): number => {
  if (!business.owned) return business.baseCost;
  return business.baseCost * Math.pow(GAME_CONFIG.BUSINESSES.LEVEL_COST_GROWTH, business.level);
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
  
  return (
    business.baseRevenuePH * 2 * 
    Math.pow(GAME_CONFIG.BUSINESSES.LEVEL_COST_GROWTH, business.level) * 
    Math.pow(GAME_CONFIG.BUSINESSES.UPGRADE_COST_GROWTH, currentLevel)
  );
};

const getCategoryContext = (category: BusinessCategory): Partial<BusinessContext> => {
  switch (category) {
    case 'FOOD_BEV':
      return {
        elasticity: GAME_CONFIG.BUSINESSES.CATEGORIES.FOOD_BEV.ELASTICITY,
        cogsRatioBase: GAME_CONFIG.BUSINESSES.CATEGORIES.FOOD_BEV.COGS_RATIO_BASE,
      };
    case 'RETAIL_SERVICES':
      return {
        elasticity: GAME_CONFIG.BUSINESSES.CATEGORIES.RETAIL_SERVICES.ELASTICITY,
        shrinkageRate: GAME_CONFIG.BUSINESSES.CATEGORIES.RETAIL_SERVICES.SHRINKAGE_RATE,
      };
    case 'TECH_APPS':
      return {
        elasticity: GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.ELASTICITY,
      };
    case 'INDUSTRIAL':
      return {
        elasticity: GAME_CONFIG.BUSINESSES.CATEGORIES.INDUSTRIAL.ELASTICITY,
      };
    case 'REAL_ESTATE_SERVICES':
      return {
        elasticity: GAME_CONFIG.BUSINESSES.CATEGORIES.REAL_ESTATE_SERVICES.ELASTICITY,
      };
    case 'FINANCE_SERVICES':
      return {
        elasticity: GAME_CONFIG.BUSINESSES.CATEGORIES.FINANCE_SERVICES.ELASTICITY,
      };
  }
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
  
  const grossPH = business.baseRevenuePH * Math.pow(GAME_CONFIG.BUSINESSES.REVENUE_GROWTH, business.level - 1);
  
  let revAdd = 0;
  revAdd += GAME_CONFIG.BUSINESSES.UPGRADES.EFFICIENCY.REV_ADD_PER_LEVEL * business.upgradeE;
  revAdd += GAME_CONFIG.BUSINESSES.UPGRADES.QUALITY.REV_ADD_PER_LEVEL * business.upgradeQ;
  revAdd += GAME_CONFIG.BUSINESSES.UPGRADES.MARKETING.REV_ADD_PER_LEVEL * business.upgradeM;
  
  let categoryRevenuePH = grossPH * (1 + revAdd);
  
  const ctx = getCategoryContext(business.category);
  
  if (ctx.elasticity !== undefined) {
    const elasticityEffect = 1 + ctx.elasticity * (business.priceIndex - 1);
    categoryRevenuePH *= Math.max(0.6, Math.min(1.3, elasticityEffect));
  }
  
  if (business.category === 'TECH_APPS' && business.level >= GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_START_LEVEL) {
    const tier = Math.floor((business.level - GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_START_LEVEL) / 5);
    const networkEffect = 1 + GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.NETWORK_EFFECT_BASE * tier;
    categoryRevenuePH *= networkEffect;
  }
  
  const employeeEfficiency = 1 + GAME_CONFIG.BUSINESSES.UPGRADES.EFFICIENCY.EMPLOYEE_EFF_PER_LEVEL * business.upgradeE;
  const employees = categoryRevenuePH * GAME_CONFIG.BUSINESSES.EMPLOYEE_COST_BASE / employeeEfficiency;
  
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
  if (business.category === 'TECH_APPS' && business.level >= GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_START_LEVEL) {
    const tier = Math.floor((business.level - GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_START_LEVEL) / 5);
    operations += categoryRevenuePH * GAME_CONFIG.BUSINESSES.CATEGORIES.TECH_APPS.INFRA_COST_SLOPE * tier;
  }
  if (business.category === 'FINANCE_SERVICES') {
    operations += categoryRevenuePH * GAME_CONFIG.BUSINESSES.CATEGORIES.FINANCE_SERVICES.COMPLIANCE_COST;
  }
  
  const marketingUpkeepMult = 1 + GAME_CONFIG.BUSINESSES.UPGRADES.MARKETING.UPKEEP_SLOPE_PER_LEVEL * business.upgradeM;
  const marketing = categoryRevenuePH * GAME_CONFIG.BUSINESSES.MARKETING_COST_BASE * marketingUpkeepMult;
  
  const rawCostsPH = employees + operations + marketing;
  
  const automationReduction = Math.min(
    GAME_CONFIG.BUSINESSES.UPGRADES.AUTOMATION.HARD_CAP,
    GAME_CONFIG.BUSINESSES.UPGRADES.AUTOMATION.COST_REDUCTION_PER_LEVEL * business.upgradeA
  );
  const sustainabilityReduction = GAME_CONFIG.BUSINESSES.UPGRADES.SUSTAINABILITY.COST_REDUCTION_PER_LEVEL * business.upgradeS;
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
  
  const premiumBonus = gameState.isPremium ? 1 : 0;
  
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
