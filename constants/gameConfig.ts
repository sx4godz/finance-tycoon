export const GAME_CONFIG = {
  GLOBAL_CAPS: {
    PER_SOURCE_MULTIPLIER_CAP: 10.0,
  },
  
  PRESTIGE: {
    FIRST_5_MULT: 1.25,
    TO_20_MULT: 1.18,
    POST_20_MULT: 1.12,
    REQUIREMENT: 10000000,
  },
  
  ECONOMIC_CYCLE: {
    PHASES: [
      { name: 'expansion' as const, mult: 1.10, minutes: 10 },
      { name: 'peak' as const, mult: 1.20, minutes: 5 },
      { name: 'recession' as const, mult: 0.85, minutes: 8 },
      { name: 'trough' as const, mult: 0.90, minutes: 2 },
      { name: 'recovery' as const, mult: 1.05, minutes: 5 },
    ],
    TOTAL_CYCLE_MINUTES: 30,
  },
  
  SENTIMENT: {
    UPDATE_INTERVAL_SEC: 10,
    MIN: 0,
    MAX: 100,
    STARTING: 50,
    MEAN_REVERT_STRENGTH: 0.02,
  },
  
  EFFICIENCY: {
    BASE_CAP: 2.5,
    UPDATE_INTERVAL_SEC: 30,
    MEAN_REVERT_TO: 1.3,
    VOLATILITY: 0.001,
  },
  
  EVENTS: {
    MIN_DURATION_MINUTES: 5,
    MAX_DURATION_MINUTES: 30,
    MIN_COOLDOWN_MINUTES: 5,
    CHECK_INTERVAL_SEC: 30,
    SPAWN_CHANCE: 0.1,
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
        ELASTICITY: -0.8,
        COGS_RATIO_BASE: 0.28,
        SPOILAGE_RATE: 0.02,
      },
      RETAIL_SERVICES: {
        ELASTICITY: -0.6,
        SHRINKAGE_RATE: 0.02,
      },
      TECH_APPS: {
        ELASTICITY: -0.3,
        NETWORK_EFFECT_BASE: 0.02,
        INFRA_COST_START_LEVEL: 10,
        INFRA_COST_SLOPE: 0.005,
      },
      INDUSTRIAL: {
        ELASTICITY: -0.4,
        OPERATIONS_BASE: 0.10,
        MATERIALS_IMPACT: 0.05,
      },
      REAL_ESTATE_SERVICES: {
        ELASTICITY: -0.4,
      },
      FINANCE_SERVICES: {
        ELASTICITY: -0.2,
        COMPLIANCE_COST: 0.02,
      },
    },
    
    DOMINANCE: {
      THRESHOLDS: [
        { share: 0.25, revenueBonus: 0.05, description: '+5% revenue' },
        { share: 0.50, revenueBonus: 0.12, marketingReduction: 0.02, description: '+12% revenue, -2% marketing' },
        { share: 0.75, revenueBonus: 0.20, marketingReduction: 0.05, description: '+20% revenue, -5% marketing' },
      ],
    },
  },
  
  PROPERTIES: {
    LEVEL_COST_MULTIPLIER: 1.15,
    BASE_MAINTENANCE_RATE: 0.12,
    BASE_TAX_RATE: 0.0008,
    BASE_INSURANCE_RATE: 0.0004,
    
    UPGRADES: {
      SMART_MGMT: {
        MAINTENANCE_REDUCTION_PER_LEVEL: 0.08,
        HARD_CAP: 0.60,
        MAX_LEVEL: 10,
      },
      RENOVATION: {
        INCOME_ADD_PER_LEVEL: 0.10,
        MAX_LEVEL: 10,
      },
    },
    
    TENANT_QUALITY: {
      A: { rentMult: 1.10, vacancy: 0.02, maintenanceAdd: 0.00 },
      B: { rentMult: 1.00, vacancy: 0.04, maintenanceAdd: 0.01 },
      C: { rentMult: 0.90, vacancy: 0.07, maintenanceAdd: 0.03 },
    },
    
    AMENITIES: {
      pool: { rent: 0.06, maintenance: 0.01 },
      gym: { rent: 0.04, maintenance: 0.005 },
      parking: { rent: 0.03, maintenance: 0.002 },
      security: { rent: 0.02, maintenance: 0.003, vacancy: -0.01 },
    },
    
    REGIONAL_MODIFIERS: {
      RESIDENTIAL_BASE: 0.9,
      RESIDENTIAL_SENSITIVITY: 0.2,
      COMMERCIAL_BASE: 0.9,
      COMMERCIAL_SENSITIVITY: 0.2,
      LUXURY_DEV_BASE: 0.8,
      LUXURY_DEV_SENSITIVITY: 0.3,
    },
  },
  
  LUXURY: {
    UPGRADES: {
      POLISH: {
        MULT_PER_LEVEL: 0.005,
        MAX_ADD: 0.05,
        MAX_LEVEL: 10,
      },
      REFIT: {
        MULT_PER_LEVEL: 0.01,
        MAX_ADD: 0.10,
        MAX_LEVEL: 10,
      },
    },
    
    BRAND_INFLUENCE: {
      THRESHOLDS: [
        { score: 3, bonus: 0.02, description: '+2% global income' },
        { score: 7, bonus: 0.04, description: '+4% global income, PR boost' },
        { score: 12, bonus: 0.06, description: '+6% global income, event mitigation' },
      ],
    },
  },
  
  STOCKS: {
    UNLOCK_LIFETIME_EARNINGS: 250000,
    TICK_INTERVAL_SEC: 5,
    DRIFT_DAILY: 0.0008,
    FLOOR_MULTIPLE: 0.1,
    HISTORY_LENGTH: 20,
    
    VOLATILITY: {
      LOW: 0.015,
      MED: 0.03,
      HIGH: 0.06,
    },
    
    PHASE_DRIFT_ADJUSTMENT: {
      peak: 0.002,
      expansion: 0.001,
      recovery: 0.0005,
      trough: -0.001,
      recession: -0.002,
    },
  },
  
  SOFTCAPS: {
    MIN_NET_MARGIN: 0.05,
  },
} as const;

export const calculatePrestigeMultiplier = (prestigeLevel: number): number => {
  let mult = 1;
  for (let i = 1; i <= prestigeLevel; i++) {
    if (i <= 5) {
      mult *= GAME_CONFIG.PRESTIGE.FIRST_5_MULT;
    } else if (i <= 20) {
      mult *= GAME_CONFIG.PRESTIGE.TO_20_MULT;
    } else {
      mult *= GAME_CONFIG.PRESTIGE.POST_20_MULT;
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
  const additiveBonus = 1 + params.luxuryBonus + params.premiumBonus;
  
  const rawMult = prestigeMult * additiveBonus * params.economicPhaseMult * 
                  params.sentimentMult * params.efficiencyMult * params.eventMult;
  
  return Math.min(GAME_CONFIG.GLOBAL_CAPS.PER_SOURCE_MULTIPLIER_CAP, rawMult);
};
