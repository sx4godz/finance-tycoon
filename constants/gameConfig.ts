import { BusinessCategory } from '@/types/game';

export const GAME_CONFIG = {
  META: {
    GAME_NAME: 'Finance Tycoon',
    VISION: 'Grind → Optimize → Dominate → Diversify',
    GLOBAL_CAPS: {
      PER_SOURCE_GLOBAL_MULTIPLIER_CAP: 10.0,
    },
    TUNING_TARGETS: {
      TTU_EARLY: { min: 20, max: 60 },
      TTU_MID: { min: 360, max: 720 },
      TTU_LATE: { min: 1200, max: 2700 },
    },
  },
  
  GLOBAL: {
    PRESTIGE_CURVE: {
      FIRST_5: 1.25,
      TO_20: 1.18,
      POST_20: 1.12,
    },
    PREMIUM_BONUS: 1.0,
    SENTIMENT: {
      UPDATE_SECONDS: 10,
      MEAN_REVERT_TO: 50,
      DRIFT_RATE: 0.5,
    },
    EFFICIENCY: {
      BASE_CAP: 2.5,
      UPDATE_SECONDS: 30,
      MEAN_REVERT_TO: 1.3,
      DRIFT_RATE: 0.001,
    },
  },
  
  ECONOMIC_PHASES: {
    CYCLE_LENGTH_MINUTES: 30,
    PHASES: [
      { name: 'Expansion' as const, mult: 1.10, minutes: 10 },
      { name: 'Peak' as const, mult: 1.20, minutes: 5 },
      { name: 'Recession' as const, mult: 0.85, minutes: 8 },
      { name: 'Trough' as const, mult: 0.90, minutes: 2 },
      { name: 'Recovery' as const, mult: 1.05, minutes: 5 },
    ],
  },
  
  MARKET_EVENTS: {
    DURATION_MINUTES: { min: 5, max: 30 },
    COOLDOWN_MINUTES_MIN: 5,
    TYPES: {
      BOOM_SECTOR: { 
        revenuePreCosts: { min: 0.50, max: 0.80 },
      },
      CRASH_GLOBAL: { 
        revenuePreCosts: { min: -0.35, max: -0.20 },
      },
      EMERGENCY: { 
        costs: { min: 0.15, max: 0.30 },
        revenue: { min: -0.20, max: -0.10 },
      },
      HOLIDAY: { 
        costs: { min: -0.40, max: -0.25 },
      },
    },
    RULES: {
      NO_DOUBLE_GLOBAL_NEGATIVES: true,
      SECTOR_CAN_STACK_WITH_SINGLE_GLOBAL: true,
    },
  },
  
  BUSINESSES: {
    REVENUE_GROWTH: 1.17,
    LEVEL_COST_GROWTH: 1.15,
    UPGRADE_COST_GROWTH: 2.35,
    
    EMPLOYEE_COST_BASE: 0.15,
    OPERATIONS_COST_BASE: 0.08,
    MARKETING_COST_BASE: 0.02,
    
    UPGRADES: {
      EFFICIENCY: {
        REV_ADD_PER_LEVEL: 0.10,
        EMPLOYEE_EFF_PER_LEVEL: 0.15,
        MAX_LEVEL: 10,
      },
      QUALITY: {
        REV_ADD_PER_LEVEL: 0.12,
        MAX_LEVEL: 10,
      },
      MARKETING: {
        REV_ADD_PER_LEVEL: 0.08,
        UPKEEP_SLOPE_PER_LEVEL: 0.05,
        MAX_LEVEL: 10,
      },
      AUTOMATION: {
        COST_REDUCTION_PER_LEVEL: 0.15,
        HARD_CAP: 0.70,
        MAX_LEVEL: 6,
      },
      SUSTAINABILITY: {
        COST_REDUCTION_PER_LEVEL: 0.05,
        MAX_LEVEL: 6,
      },
    },
    
    CATEGORIES: {
      FOOD_BEV: {
        KEY: 'FOOD_BEV' as BusinessCategory,
        NAME: 'Food & Beverage',
        INVENTORY_SPOILAGE_RATE: { min: 0.01, max: 0.05 },
        INGREDIENT_VOLATILITY: { min: 0.02, max: 0.08 },
        HYGIENE_EVENT_PENALTY: -0.10,
        HYGIENE_EVENT_CHANCE_PER_HOUR: 0.002,
        COGS_RATIO_BASE: 0.28,
        ELASTICITY: -0.8,
        VENDOR_CONTRACTS: {
          SHORT_TERM: { cogsDelta: 0.03, flexible: true },
          LONG_TERM: { cogsDelta: -0.03, flexible: false, lockDays: 7 },
        },
      },
      
      RETAIL_SERVICES: {
        KEY: 'RETAIL_SERVICES' as BusinessCategory,
        NAME: 'Retail & Services',
        FOOT_TRAFFIC_BASE: 1.0,
        SEASONALITY_AMPLITUDE: 0.12,
        SEASONALITY_PERIOD_DAYS: 7,
        SHRINKAGE_RATE: 0.02,
        ELASTICITY: -0.6,
        SECURITY_UPGRADE: {
          SHRINKAGE_DELTA_PER_LEVEL: -0.01,
          MAX_REDUCTION: 0.0,
        },
      },
      
      TECH_APPS: {
        KEY: 'TECH_APPS' as BusinessCategory,
        NAME: 'Tech & Apps',
        NETWORK_EFFECT_BASE: 0.02,
        INFRA_COST_START_LEVEL: 10,
        INFRA_COST_SLOPE: 0.005,
        CHURN_PRESSURE_DECAY: -0.005,
        ELASTICITY: -0.3,
        RND_UPGRADE: {
          REV_ADD_PER_LEVEL: 0.06,
          MAX_LEVEL: 10,
        },
      },
      
      INDUSTRIAL: {
        KEY: 'INDUSTRIAL' as BusinessCategory,
        NAME: 'Industrial & Manufacturing',
        BULK_MATERIALS_INDEX_BASE: 1.0,
        ENERGY_COST_INDEX_BASE: 1.0,
        QUALITY_YIELD: { min: 0.92, max: 0.99 },
        OPERATIONS_BASE: 0.10,
        ELASTICITY: -0.4,
        CONTRACTS: {
          SPOT: { materialsDelta: 0.05, flexible: true },
          FIXED: { materialsDelta: -0.04, lockDays: 10 },
        },
        LOGISTICS_SURCHARGE: 0.02,
      },
      
      REAL_ESTATE_SERVICES: {
        KEY: 'REAL_ESTATE_SERVICES' as BusinessCategory,
        NAME: 'Real Estate Services',
        HOUSING_CYCLE_CORRELATION: 0.6,
        PERMIT_BOTTLENECK_CHANCE: 0.01,
        PERMIT_DELAY_TTU_ADD: 0.10,
        ELASTICITY: -0.4,
      },
      
      FINANCE_SERVICES: {
        KEY: 'FINANCE_SERVICES' as BusinessCategory,
        NAME: 'Finance & Professional Services',
        COMPLIANCE_COST: 0.02,
        REPUTATION_MULT_PER_ACHIEVEMENT: 0.03,
        ELASTICITY: -0.2,
      },
    },
    
    DOMINANCE: {
      THRESHOLDS: [
        { share: 0.25, revenueBonus: 0.05, effect: '+5% revenue in category' },
        { 
          share: 0.50, 
          revenueBonus: 0.12, 
          marketingUpkeepReduction: 0.02,
          effect: '+12% revenue, -2% marketing upkeep',
        },
        { 
          share: 0.75, 
          revenueBonus: 0.20, 
          marketingUpkeepReduction: 0.05,
          boomEventBias: 0.1,
          effect: '+20% revenue, -5% marketing upkeep, +Boom sector chance',
        },
      ],
    },
    
    WORKFORCE: {
      ENABLED: true,
      STAFF_SLOTS_PER_LEVEL: 2,
      TRAINING_EFFICIENCY_PER_LEVEL: 0.05,
      TRAINING_MAX_BONUS: 0.30,
      TURNOVER_BASELINE: 0.01,
      WAGES_SLIDER_RANGE: { min: 0.9, max: 1.2 },
    },
    
    EXPANSION_TIERS: [
      { everyLevels: 10, revenueBonus: 0.03, staffSlot: 1, costMult: 0.8 },
      { everyLevels: 25, revenueBonus: 0.15, opsCostAdd: 0.05, costMult: 3.0 },
    ],
  },
  
  PROPERTIES: {
    LEVEL_UPGRADE_COST_MULT: 1.15,
    VALUE_FORMULA_UPGRADE_MULT: 0.7,
    BASE_MAINTENANCE_RATE: 0.12,
    BASE_TAX_RATE_MONTHLY: 0.0008,
    BASE_INSURANCE_RATE_MONTHLY: 0.0004,
    
    UPGRADES: {
      SMART_MGMT: {
        COST_REDUCTION_PER_LEVEL: 0.08,
        MAX_REDUCTION: 0.60,
        MAX_LEVEL: 10,
      },
      RENOVATION: {
        INCOME_ADD_PER_LEVEL: 0.10,
        MAX_LEVEL: 10,
      },
      SCREENING: {
        VACANCY_REDUCTION_PER_LEVEL: 0.01,
        DEFAULT_RISK_REDUCTION: 0.005,
        MAX_LEVEL: 5,
      },
    },
    
    CATEGORIES: {
      RESIDENTIAL: {
        KEY: 'RESIDENTIAL',
        TENANT_QUALITY_TIERS: {
          A: { rentMultiplier: 1.10, vacancyRate: 0.02, maintenanceAdd: 0.00 },
          B: { rentMultiplier: 1.00, vacancyRate: 0.04, maintenanceAdd: 0.01 },
          C: { rentMultiplier: 0.90, vacancyRate: 0.07, maintenanceAdd: 0.03 },
        },
        AMENITIES: {
          POOL: { rentBonus: 0.06, maintenanceAdd: 0.01 },
          GYM: { rentBonus: 0.04, maintenanceAdd: 0.005 },
          PARKING: { rentBonus: 0.03, maintenanceAdd: 0.002 },
          SECURITY: { rentBonus: 0.02, maintenanceAdd: 0.003, vacancyReduction: 0.01 },
        },
        REGIONAL_FORMULA: {
          baseMultiplier: 0.9,
          indexWeight: 0.2,
        },
      },
      
      COMMERCIAL: {
        KEY: 'COMMERCIAL',
        LEASE_TERMS_MONTHS: [6, 12, 24] as const,
        BUSINESS_CYCLE_SENSITIVITY: 0.5,
        FITOUT_INVESTMENT: {
          rentBonusPerTier: 0.08,
        },
        REGIONAL_FORMULA: {
          baseMultiplier: 0.9,
          indexWeight: 0.2,
        },
      },
      
      LUXURY_DEV: {
        KEY: 'LUXURY_DEV',
        TOURISM_INDEX_CORRELATION: 0.7,
        OCCUPANCY_VARIANCE: { min: 0.10, max: 0.30 },
        REGIONAL_FORMULA: {
          baseMultiplier: 0.8,
          indexWeight: 0.3,
        },
      },
    },
    
    REGIONAL_MODIFIERS: {
      HOUSING_PRICE_INDEX_BASE: 1.0,
      TOURISM_INDEX_BASE: 1.0,
      BUSINESS_RENT_DEMAND_BASE: 1.0,
    },
  },
  
  LUXURY: {
    ITEMS: [
      { id: 'l1', name: 'Designer Watch', baseMult: 0.02, prestigeReq: 0, brandScore: 1 },
      { id: 'l2', name: 'Luxury Car', baseMult: 0.04, prestigeReq: 1, brandScore: 2 },
      { id: 'l3', name: 'Yacht', baseMult: 0.12, prestigeReq: 3, brandScore: 4 },
      { id: 'l4', name: 'Private Jet', baseMult: 0.50, prestigeReq: 5, brandScore: 8 },
    ],
    
    UPGRADES: {
      POLISH: {
        MULT_ADD_PER_LEVEL: 0.005,
        MAX_ADD: 0.05,
        MAX_LEVEL: 10,
      },
      REFIT: {
        MULT_ADD_PER_LEVEL: 0.01,
        MAX_ADD: 0.10,
        MAX_LEVEL: 10,
      },
      ENTOURAGE: {
        UNLOCKS_BRAND_EVENTS: true,
        EVENT_SECTOR_REVENUE_BONUS: 0.01,
        EVENT_DURATION_MINUTES: 30,
        EVENT_COOLDOWN_HOURS: 2,
      },
    },
    
    BRAND_INFLUENCE: {
      THRESHOLDS: [
        { score: 3, bonus: '+2% global income' },
        { score: 7, bonus: 'Sector PR: chance for +Holiday on owned sectors' },
        { score: 12, bonus: 'Event Bias: reduce Crash magnitude by 10%' },
      ],
    },
    
    CHARITY: {
      DONATE_RATE_RANGE: { min: 0, max: 0.02 },
      REPUTATION_MULT_PER_PERCENT: 0.02,
    },
  },
  
  STOCKS: {
    UNLOCK_LIFETIME_EARNINGS: 250000,
    TICK_INTERVAL_SEC: 5,
    
    VOLATILITY: {
      LOW: 0.015,
      MED: 0.03,
      HIGH: 0.06,
    },
    
    PRICE_MODEL: {
      DRIFT_DAILY: 0.0008,
      FLOOR_MULTIPLE_OF_BASE: 0.1,
      
      PHASE_BIAS: {
        Peak: 0.002,
        Expansion: 0.001,
        Recovery: 0.0005,
        Trough: -0.001,
        Recession: -0.002,
      },
      
      EVENT_BIAS: {
        BOOM_SECTOR: 0.01,
        CRASH_GLOBAL: -0.01,
      },
    },
    
    GAMEPLAY_LINKS: {
      CATEGORY_LEADING_BONUS: 0.02,
      PRESTIGE_XP_PER_10K_PROFIT: 1,
    },
    
    MARGIN_TRADING: {
      UNLOCK_PRESTIGE_LEVEL: 3,
      MARGIN_CALL_PENALTY: 0.03,
    },
    
    HISTORY_LENGTH: 20,
  },
  
  PRICING_DEMAND: {
    PRICE_INDEX_RANGE: { min: 0.9, max: 1.2 },
    REVENUE_MULTIPLIER_CLAMP: { min: 0.6, max: 1.3 },
  },
  
  SOFTCAPS: {
    REVENUE_SOFTCAP_TAPER: 0.9,
    EVENT_MIN_NET_MARGIN: 0.05,
  },
} as const;

export const calculatePrestigeMultiplier = (prestigeLevel: number): number => {
  let mult = 1;
  for (let i = 1; i <= prestigeLevel; i++) {
    if (i <= 5) {
      mult *= GAME_CONFIG.GLOBAL.PRESTIGE_CURVE.FIRST_5;
    } else if (i <= 20) {
      mult *= GAME_CONFIG.GLOBAL.PRESTIGE_CURVE.TO_20;
    } else {
      mult *= GAME_CONFIG.GLOBAL.PRESTIGE_CURVE.POST_20;
    }
  }
  return mult;
};

export const calculateGlobalMultiplier = (params: {
  prestigeLevel: number;
  luxuryBonus: number;
  premiumBonus: number;
  economicPhaseMult: number;
  sentimentMult: number;
  efficiencyMult: number;
  eventMult: number;
}): number => {
  const prestigeMult = calculatePrestigeMultiplier(params.prestigeLevel);
  const add = 1 + params.luxuryBonus + params.premiumBonus;
  
  const rawMult = prestigeMult * add * params.economicPhaseMult * 
                  params.sentimentMult * params.efficiencyMult * params.eventMult;
  
  return Math.min(GAME_CONFIG.META.GLOBAL_CAPS.PER_SOURCE_GLOBAL_MULTIPLIER_CAP, rawMult);
};

export const getEconomicPhaseMultiplier = (phaseName: string): number => {
  const phase = GAME_CONFIG.ECONOMIC_PHASES.PHASES.find(p => p.name.toLowerCase() === phaseName.toLowerCase());
  return phase?.mult ?? 1.0;
};

export const getStockPhaseBias = (phaseName: string): number => {
  const key = phaseName.charAt(0).toUpperCase() + phaseName.slice(1);
  return (GAME_CONFIG.STOCKS.PRICE_MODEL.PHASE_BIAS as Record<string, number>)[key] ?? 0;
};

export const gaussian = (mean: number = 0, stdDev: number = 1): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * stdDev;
};
