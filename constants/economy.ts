// Economic balance constants
export const ECONOMY_CONFIG = {
  // Inflation and deflation
  INFLATION_RATE: 0.0001, // 0.01% per second
  DEFLATION_THRESHOLD: 0.8, // When to trigger deflation
  INFLATION_THRESHOLD: 1.2, // When to trigger inflation
  
  // Market dynamics
  SUPPLY_DEMAND_FACTOR: 0.1, // How much supply/demand affects prices
  MARKET_CORRECTION_RATE: 0.05, // How quickly prices return to base
  
  // Business efficiency
  EFFICIENCY_DECAY_RATE: 0.001, // How much efficiency decreases over time
  MAX_EFFICIENCY: 3.0, // Maximum efficiency multiplier
  MIN_EFFICIENCY: 0.5, // Minimum efficiency multiplier
  
  // Property market
  PROPERTY_DEPRECIATION: 0.0001, // Property value decreases over time
  PROPERTY_APPRECIATION: 0.0002, // Property value increases over time
  RENT_DEMAND_FACTOR: 0.1, // How much demand affects rent
  
  // Stock market
  STOCK_MARKET_IMPACT: 0.3, // How much stock performance affects business revenue
  DIVIDEND_RATE: 0.02, // Annual dividend rate for stocks
  
  // Economic cycles
  CYCLE_LENGTH: 3600000, // 1 hour economic cycle
  BOOM_PROBABILITY: 0.3,
  BUST_PROBABILITY: 0.2,
  RECOVERY_PROBABILITY: 0.5,
  
  // Player progression
  PRESTIGE_BONUS_CAP: 10, // Maximum prestige multiplier
  ACHIEVEMENT_SCALING: 1.1, // How much achievements scale with progress
  LUXURY_DIMINISHING_RETURNS: 0.9, // Diminishing returns for luxury items
};

export const ECONOMIC_INDICATORS = {
  gdpGrowth: 0,
  inflation: 0,
  unemployment: 0,
  consumerConfidence: 50,
  marketSentiment: 50,
  interestRate: 0.05,
};

export const ECONOMIC_PHASES = {
  EXPANSION: "expansion",
  PEAK: "peak",
  RECESSION: "recession",
  TROUGH: "trough",
  RECOVERY: "recovery",
} as const;

export type EconomicPhase = typeof ECONOMIC_PHASES[keyof typeof ECONOMIC_PHASES];
