import { TapUpgrade, Multiplier, Achievement } from "@/types/game";

export const INITIAL_TAP_UPGRADE: TapUpgrade = {
  id: "tap",
  name: "Credit Limit",
  description: "Increase earnings per swipe",
  level: 1,
  baseCost: 100,
  multiplier: 1,
};

export const INITIAL_MULTIPLIERS: Multiplier[] = [
  {
    id: "financial_advisor",
    name: "Financial Advisor",
    description: "1.5x revenue for all income",
    level: 0,
    baseCost: 15000,
    multiplierValue: 1.5,
    imageUrl: "https://r2-pub.rork.com/generated-images/725a48e7-fec3-4100-93e3-af8b81361b50.png",
  },
  {
    id: "tax_consultant",
    name: "Tax Consultant",
    description: "2x revenue for all income",
    level: 0,
    baseCost: 100000,
    multiplierValue: 2,
    imageUrl: "https://r2-pub.rork.com/generated-images/ea319b35-4f4a-494c-9d14-f1419cb5c9a6.png",
  },
  {
    id: "portfolio_manager",
    name: "Portfolio Manager",
    description: "3x revenue for all income",
    level: 0,
    baseCost: 1000000,
    multiplierValue: 3,
    imageUrl: "https://r2-pub.rork.com/generated-images/6a8315d9-ac9c-4d17-864a-78395556a4a7.png",
  },
  {
    id: "wealth_strategist",
    name: "Wealth Strategist",
    description: "5x revenue for all income",
    level: 0,
    baseCost: 15000000,
    multiplierValue: 5,
    imageUrl: "https://r2-pub.rork.com/generated-images/49bfad34-125e-4d57-bcb1-412eb9fa22c8.png",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_business",
    name: "Entrepreneur",
    description: "Buy your first business",
    unlocked: false,
    reward: 100,
  },
  {
    id: "first_property",
    name: "Real Estate Investor",
    description: "Buy your first property",
    unlocked: false,
    reward: 500,
  },
  {
    id: "first_luxury",
    name: "Living Large",
    description: "Buy your first luxury item",
    unlocked: false,
    reward: 1000,
  },
  {
    id: "first_trade",
    name: "Stock Trader",
    description: "Complete your first stock trade",
    unlocked: false,
    reward: 5000,
  },
  {
    id: "tap_master",
    name: "Tap Master",
    description: "Tap 1,000 times",
    unlocked: false,
    reward: 5000,
  },
  {
    id: "tap_legend",
    name: "Tap Legend",
    description: "Tap 10,000 times",
    unlocked: false,
    reward: 50000,
  },
  {
    id: "millionaire",
    name: "Millionaire",
    description: "Earn $1,000,000",
    unlocked: false,
    reward: 10000,
  },
  {
    id: "multimillionaire",
    name: "Multi-Millionaire",
    description: "Earn $10,000,000",
    unlocked: false,
    reward: 100000,
  },
  {
    id: "billionaire",
    name: "Billionaire",
    description: "Earn $1,000,000,000",
    unlocked: false,
    reward: 1000000,
  },
  {
    id: "business_tycoon",
    name: "Business Tycoon",
    description: "Own all businesses",
    unlocked: false,
    reward: 50000,
  },
  {
    id: "max_level",
    name: "Maxed Out",
    description: "Get a business to level 25",
    unlocked: false,
    reward: 100000,
  },
  {
    id: "max_level_50",
    name: "Ultra Maxed",
    description: "Get a business to level 50",
    unlocked: false,
    reward: 500000,
  },
  {
    id: "property_mogul",
    name: "Property Mogul",
    description: "Own 5 properties",
    unlocked: false,
    reward: 25000,
  },
  {
    id: "luxury_collector",
    name: "Luxury Collector",
    description: "Own 5 luxury items",
    unlocked: false,
    reward: 75000,
  },
  {
    id: "portfolio_king",
    name: "Portfolio King",
    description: "Own shares in all stocks",
    unlocked: false,
    reward: 200000,
  },
  {
    id: "prestige_master",
    name: "Prestige Master",
    description: "Prestige for the first time",
    unlocked: false,
    reward: 0,
  },
  {
    id: "trading_expert",
    name: "Trading Expert",
    description: "Make $1,000,000 from stock trading",
    unlocked: false,
    reward: 500000,
  },
];

export const TAP_COST_MULTIPLIER = 1.25;
export const MULTIPLIER_COST_MULTIPLIER = 1.35;
export const PRESTIGE_REQUIREMENT = 100000000;
export const PRESTIGE_MULTIPLIER = 0.50;
