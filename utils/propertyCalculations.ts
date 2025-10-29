import { Property, GameState } from '@/types/game';
import { GAME_CONFIG, calculateGlobalMultiplier } from '@/constants/gameConfig';

export const calculatePropertyLevelCost = (property: Property): number => {
  if (!property.owned) return property.baseCost;
  return Math.floor(
    property.baseCost * Math.pow(GAME_CONFIG.PROPERTIES.LEVEL_UPGRADE_COST_MULT, property.level)
  );
};

export const calculatePropertyValue = (property: Property): number => {
  const baseValue = property.baseCost;
  const upgradeValue = property.totalUpgradeSpend * GAME_CONFIG.PROPERTIES.VALUE_FORMULA_UPGRADE_MULT;
  return baseValue + upgradeValue;
};

const getTenantQualityModifiers = (property: Property) => {
  if (property.category !== 'RESIDENTIAL') {
    return { rentMultiplier: 1.0, vacancyRate: 0.04, maintenanceAdd: 0 };
  }
  
  const tier = property.tenantQuality;
  const config = GAME_CONFIG.PROPERTIES.CATEGORIES.RESIDENTIAL.TENANT_QUALITY_TIERS[tier];
  
  return {
    rentMultiplier: config.rentMultiplier,
    vacancyRate: config.vacancyRate,
    maintenanceAdd: config.maintenanceAdd,
  };
};

const getAmenityBonuses = (property: Property) => {
  if (property.category !== 'RESIDENTIAL') {
    return { rentBonus: 0, maintenanceAdd: 0, vacancyReduction: 0 };
  }
  
  let rentBonus = 0;
  let maintenanceAdd = 0;
  let vacancyReduction = 0;
  
  const amenitiesConfig = GAME_CONFIG.PROPERTIES.CATEGORIES.RESIDENTIAL.AMENITIES;
  
  property.amenities.forEach(amenityKey => {
    const key = amenityKey.toUpperCase() as keyof typeof amenitiesConfig;
    if (amenitiesConfig[key]) {
      rentBonus += amenitiesConfig[key].rentBonus;
      maintenanceAdd += amenitiesConfig[key].maintenanceAdd;
      const amenityConfig = amenitiesConfig[key];
      if ('vacancyReduction' in amenityConfig && amenityConfig.vacancyReduction) {
        vacancyReduction += amenityConfig.vacancyReduction;
      }
    }
  });
  
  return { rentBonus, maintenanceAdd, vacancyReduction };
};

const getRegionalMultiplier = (
  property: Property,
  gameState: GameState
): number => {
  const regionalMods = gameState.regionalModifiers;
  
  switch (property.category) {
    case 'RESIDENTIAL': {
      const config = GAME_CONFIG.PROPERTIES.CATEGORIES.RESIDENTIAL.REGIONAL_FORMULA;
      return config.baseMultiplier + config.indexWeight * regionalMods.housingPriceIndex;
    }
    
    case 'COMMERCIAL': {
      const config = GAME_CONFIG.PROPERTIES.CATEGORIES.COMMERCIAL.REGIONAL_FORMULA;
      return config.baseMultiplier + config.indexWeight * regionalMods.businessRentDemand;
    }
    
    case 'LUXURY_DEV': {
      const config = GAME_CONFIG.PROPERTIES.CATEGORIES.LUXURY_DEV.REGIONAL_FORMULA;
      return config.baseMultiplier + config.indexWeight * regionalMods.tourismIndex;
    }
  }
};

export const calculatePropertyMetrics = (
  property: Property,
  gameState: GameState
): {
  incomePerHour: number;
  maintenancePerHour: number;
  taxesPerSec: number;
  insurancePerSec: number;
  netIncomePerHour: number;
} => {
  if (!property.owned || property.level === 0) {
    return {
      incomePerHour: 0,
      maintenancePerHour: 0,
      taxesPerSec: 0,
      insurancePerSec: 0,
      netIncomePerHour: 0,
    };
  }
  
  const tenantMods = getTenantQualityModifiers(property);
  const amenityBonuses = getAmenityBonuses(property);
  
  let incomePH = property.baseIncomePH * property.level;
  
  incomePH *= tenantMods.rentMultiplier;
  
  const renovationBonus = GAME_CONFIG.PROPERTIES.UPGRADES.RENOVATION.INCOME_ADD_PER_LEVEL * 
    property.upgradeRenovation;
  incomePH *= (1 + renovationBonus + amenityBonuses.rentBonus);
  
  if (property.upgradeFitout && property.category === 'COMMERCIAL') {
    const fitoutBonus = GAME_CONFIG.PROPERTIES.CATEGORIES.COMMERCIAL.FITOUT_INVESTMENT.rentBonusPerTier * 
      property.upgradeFitout;
    incomePH *= (1 + fitoutBonus);
  }
  
  const regionalMult = getRegionalMultiplier(property, gameState);
  incomePH *= regionalMult;
  
  let effectiveVacancyRate = tenantMods.vacancyRate - amenityBonuses.vacancyReduction;
  
  if (property.upgradeScreening) {
    effectiveVacancyRate -= GAME_CONFIG.PROPERTIES.UPGRADES.SCREENING.VACANCY_REDUCTION_PER_LEVEL * 
      property.upgradeScreening;
  }
  
  effectiveVacancyRate = Math.max(0, effectiveVacancyRate);
  incomePH *= (1 - effectiveVacancyRate);
  
  let maintPH = incomePH * GAME_CONFIG.PROPERTIES.BASE_MAINTENANCE_RATE;
  
  maintPH *= (1 + tenantMods.maintenanceAdd + amenityBonuses.maintenanceAdd);
  
  const smartMgmtReduction = Math.min(
    GAME_CONFIG.PROPERTIES.UPGRADES.SMART_MGMT.MAX_REDUCTION,
    GAME_CONFIG.PROPERTIES.UPGRADES.SMART_MGMT.COST_REDUCTION_PER_LEVEL * property.upgradeSmartMgmt
  );
  maintPH *= (1 - smartMgmtReduction);
  
  const propertyValue = calculatePropertyValue(property);
  const taxPS = (GAME_CONFIG.PROPERTIES.BASE_TAX_RATE_MONTHLY * propertyValue) / (30 * 24 * 3600);
  const insPS = (GAME_CONFIG.PROPERTIES.BASE_INSURANCE_RATE_MONTHLY * propertyValue) / (30 * 24 * 3600);
  
  const netPH = incomePH - maintPH - (taxPS * 3600) - (insPS * 3600);
  
  return {
    incomePerHour: incomePH,
    maintenancePerHour: maintPH,
    taxesPerSec: taxPS,
    insurancePerSec: insPS,
    netIncomePerHour: netPH,
  };
};

export const calculatePropertyNetPerSecond = (
  property: Property,
  gameState: GameState
): number => {
  if (!property.owned) return 0;
  
  const metrics = calculatePropertyMetrics(property, gameState);
  const localNetPS = metrics.netIncomePerHour / 3600;
  
  const luxuryBonus = gameState.luxuryItems.reduce((sum, item) => {
    return item.owned ? sum + item.currentMultiplier : sum;
  }, 0);
  
  const premiumBonus = gameState.isPremium ? GAME_CONFIG.GLOBAL.PREMIUM_BONUS : 0;
  
  let eventMult = 1.0;
  gameState.activeMarketEvents.forEach(event => {
    if (!event.active) return;
    
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
