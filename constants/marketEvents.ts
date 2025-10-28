import { MarketEvent } from "@/types/game";

export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: "tech_boom",
    type: "boom",
    title: "Tech Boom",
    description: "Technology sector experiencing massive growth",
    effect: "Tech businesses get +50% revenue, tech stocks +30%",
    duration: 300000, // 5 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "market_crash",
    type: "crash",
    title: "Market Crash",
    description: "Economic downturn affecting all sectors",
    effect: "All businesses -25% revenue, stocks -40%",
    duration: 600000, // 10 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "energy_crisis",
    type: "emergency",
    title: "Energy Crisis",
    description: "Energy costs skyrocketing",
    effect: "All businesses +100% utility costs, energy stocks +60%",
    duration: 450000, // 7.5 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "tax_holiday",
    type: "bonus",
    title: "Tax Holiday",
    description: "Government announces tax breaks for businesses",
    effect: "All businesses -50% operating costs, +20% revenue",
    duration: 900000, // 15 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "real_estate_boom",
    type: "boom",
    title: "Real Estate Boom",
    description: "Property values surging across the market",
    effect: "Properties +75% income, property stocks +50%",
    duration: 600000, // 10 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "crypto_crash",
    type: "crash",
    title: "Crypto Crash",
    description: "Cryptocurrency market collapses",
    effect: "Crypto stocks -70%, tech stocks -20%",
    duration: 450000, // 7.5 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "pandemic_impact",
    type: "emergency",
    title: "Pandemic Impact",
    description: "Health crisis affects all businesses",
    effect: "All businesses -40% revenue, pharma stocks +100%",
    duration: 1200000, // 20 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "golden_age",
    type: "bonus",
    title: "Golden Age",
    description: "Perfect economic conditions",
    effect: "All income sources +100%, all costs -25%",
    duration: 1800000, // 30 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "inflation_surge",
    type: "emergency",
    title: "Inflation Surge",
    description: "Rapid inflation affects all prices",
    effect: "All costs +50%, luxury items +200% value",
    duration: 900000, // 15 minutes
    startTime: 0,
    active: false,
  },
  {
    id: "innovation_wave",
    type: "boom",
    title: "Innovation Wave",
    description: "Breakthrough technologies emerge",
    effect: "Tech businesses +100% revenue, AI stocks +150%",
    duration: 750000, // 12.5 minutes
    startTime: 0,
    active: false,
  },
];

export const MARKET_EVENT_CHANCES = {
  boom: 0.25,
  crash: 0.20,
  emergency: 0.15,
  bonus: 0.10,
};

export const MARKET_EVENT_COOLDOWN = 300000; // 5 minutes between events
export const MARKET_EVENT_MIN_INTERVAL = 600000; // 10 minutes minimum between same type
