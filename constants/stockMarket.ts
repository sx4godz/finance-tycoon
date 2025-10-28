export interface StockSector {
  id: string;
  name: string;
  volatility: number;
  baseGrowthRate: number;
  correlation: number;
}

export const STOCK_SECTORS: StockSector[] = [
  {
    id: "technology",
    name: "Technology",
    volatility: 0.25,
    baseGrowthRate: 0.0001,
    correlation: 0.7,
  },
  {
    id: "finance",
    name: "Financial Services",
    volatility: 0.20,
    baseGrowthRate: 0.00008,
    correlation: 0.6,
  },
  {
    id: "energy",
    name: "Energy",
    volatility: 0.30,
    baseGrowthRate: 0.00005,
    correlation: 0.4,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    volatility: 0.15,
    baseGrowthRate: 0.00006,
    correlation: 0.3,
  },
  {
    id: "retail",
    name: "Retail",
    volatility: 0.18,
    baseGrowthRate: 0.00004,
    correlation: 0.5,
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    volatility: 0.60,
    baseGrowthRate: 0.0002,
    correlation: 0.9,
  },
];

export const MARKET_SENTIMENT = {
  BULLISH: 1.2,
  NEUTRAL: 1.0,
  BEARISH: 0.8,
  PANIC: 0.6,
};

export const STOCK_PRICE_FLOOR = 0.1; // Minimum price as percentage of base price
export const STOCK_PRICE_CEILING = 10.0; // Maximum price as percentage of base price
export const STOCK_UPDATE_INTERVAL = 3000; // 3 seconds
export const STOCK_HISTORY_LENGTH = 50;
