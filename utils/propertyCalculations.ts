import { Property, GameState } from '@/types/game';
import { GAME_CONFIG, calculateGlobalMultiplier } from '@/constants/gameConfig';

export const calculatePropertyLevelCost = (property: Property): number => {
  if (!property.owned) return property.baseCost;
  return property.baseCost * Math.pow(GAME_CONFIG.PROPERTIES.LEVEL_COST_MULTIPLIER, property.level);
};

export const calculatePropertyUpgradeCost = (
  property: Property,
  upgradeType: 'SmartMgmt' | 'Renovation'
): number => {
  let currentLevel: number;
  let maxLevel: number;
  
  if (upgradeType === 'SmartMgmt') {
    currentLevel = property.upgradeSmartMgmt;
    maxLevel = GAME_CONFIG.PROPERTIES.UPGRADES.SMART_MGMT.MAX_LEVEL;
  } else {
    currentLevel = property.upgradeRenovation;
    maxLevel = GAME_CONFIG.PROPERTIES.UPGRADES.RENOVATION.MAX_LEVEL;
  }
  
  if (currentLevel >= maxLevel) return Infinity;
  
  return (
    property.baseCost * 0.3 * 
    Math.pow(GAME_CONFIG.PROPERTIES.LEVEL_COST_MULTIPLIER, property.level) * 
    Math.pow(2.0, currentLevel)
  );
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
  if (!property.owned) {
    return {
      incomePerHour: 0,
      maintenancePerHour: 0,
      taxesPerSec: 0,
      insurancePerSec: 0,
      netIncomePerHour: 0,
    };
  }
  
  let incomePH = property.baseIncomePH * property.level;
  
  incomePH *= (1 + GAME_CONFIG.PROPERTIES.UPGRADES.RENOVATION.INCOME_ADD_PER_LEVEL * property.upgradeRenovation);
  
  let amenityBonus = 0;
  property.amenities.forEach(amenityId => {
    const amenity = GAME_CONFIG.PROPERTIES.AMENITIES[amenityId as keyof typeof GAME_CONFIG.PROPERTIES.AMENITIES];
    if (amenity) {
      amenityBonus += amenity.rent;
    }
  });
  incomePH *= (1 + amenityBonus);
  
  const tenantQuality = GAME_CONFIG.PROPERTIES.TENANT_QUALITY[property.tenantQuality];
  incomePH *= tenantQuality.rentMult;
  
  let regionalMult = 1.0;
  switch (property.category) {
    case 'RESIDENTIAL':
      regionalMult = GAME_CONFIG.PROPERTIES.REGIONAL_MODIFIERS.RESIDENTIAL_BASE + 
                     GAME_CONFIG.PROPERTIES.REGIONAL_MODIFIERS.RESIDENTIAL_SENSITIVITY * 
                     gameState.regionalModifiers.housingPriceIndex;
      break;
    case 'COMMERCIAL':
      regionalMult = GAME_CONFIG.PROPERTIES.REGIONAL_MODIFIERS.COMMERCIAL_BASE + 
                     GAME_CONFIG.PROPERTIES.REGIONAL_MODIFIERS.COMMERCIAL_SENSITIVITY * 
                     gameState.regionalModifiers.businessRentDemand;
      break;
    case 'LUXURY_DEV':
      regionalMult = GAME_CONFIG.PROPERTIES.REGIONAL_MODIFIERS.LUXURY_DEV_BASE + 
                     GAME_CONFIG.PROPERTIES.REGIONAL_MODIFIERS.LUXURY_DEV_SENSITIVITY * 
                     gameState.regionalModifiers.tourismIndex;
      break;
  }
  incomePH *= regionalMult;
  
  const effectiveVacancy = Math.max(0, property.vacancyRate);
  incomePH *= (1 - effectiveVacancy);
  
  let maintPH = incomePH * GAME_CONFIG.PROPERTIES.BASE_MAINTENANCE_RATE;
  
  const smartMgmtReduction = Math.min(
    GAME_CONFIG.PROPERTIES.UPGRADES.SMART_MGMT.HARD_CAP,
    GAME_CONFIG.PROPERTIES.UPGRADES.SMART_MGMT.MAINTENANCE_REDUCTION_PER_LEVEL * property.upgradeSmartMgmt
  );
  maintPH *= (1 - smartMgmtReduction);
  
  let amenityMaintAdd = 0;
  property.amenities.forEach(amenityId => {
    const amenity = GAME_CONFIG.PROPERTIES.AMENITIES[amenityId as keyof typeof GAME_CONFIG.PROPERTIES.AMENITIES];
    if (amenity) {
      amenityMaintAdd += amenity.maintenance;
    }
  });
  maintPH += incomePH * amenityMaintAdd;
  
  const taxPS = (GAME_CONFIG.PROPERTIES.BASE_TAX_RATE * property.value) / (30 * 24 * 3600);
  const insPS = (GAME_CONFIG.PROPERTIES.BASE_INSURANCE_RATE * property.value) / (30 * 24 * 3600);
  
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
  
  const premiumBonus = gameState.isPremium ? 1 : 0;
  
  let eventMult = 1.0;
  gameState.activeMarketEvents.forEach(event => {
    if (!event.active) return;
    
    if (event.revenueMultiplier && !event.affectedCategories) {
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

export const calculatePropertyValue = (property: Property): number => {
  if (!property.owned) return property.baseCost;
  
  const upgradeSpend = 
    (property.upgradeSmartMgmt + property.upgradeRenovation) * 
    property.baseCost * 0.1;
  
  return property.baseCost * Math.pow(1.1, property.level) + upgradeSpend * 0.7;
};
