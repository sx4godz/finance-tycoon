import { Achievement } from "@/types/game";

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'earnings' | 'businesses' | 'properties' | 'stocks' | 'luxury' | 'prestige' | 'trading' | 'efficiency';
  target: number;
  reward: number;
  rewardType: 'cash' | 'multiplier' | 'unlock' | 'prestige';
  unlocked: boolean;
  completed: boolean;
  category: 'daily' | 'weekly' | 'monthly' | 'lifetime' | 'prestige';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  requirements?: {
    minPrestige?: number;
    minNetWorth?: number;
    minBusinesses?: number;
  };
}

export const DAILY_GOALS: Goal[] = [
  {
    id: "daily_earnings_1k",
    title: "Daily Earnings",
    description: "Earn $1,000 in a single day",
    type: 'earnings',
    target: 1000,
    reward: 500,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'daily',
    difficulty: 'easy',
  },
  {
    id: "daily_business_upgrade",
    title: "Business Growth",
    description: "Upgrade any business 3 times",
    type: 'businesses',
    target: 3,
    reward: 1000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'daily',
    difficulty: 'easy',
  },
  {
    id: "daily_stock_trade",
    title: "Active Trader",
    description: "Complete 5 stock trades",
    type: 'trading',
    target: 5,
    reward: 2000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'daily',
    difficulty: 'medium',
  },
  {
    id: "daily_efficiency",
    title: "Efficiency Expert",
    description: "Achieve 80% efficiency on any business",
    type: 'efficiency',
    target: 80,
    reward: 3000,
    rewardType: 'multiplier',
    unlocked: true,
    completed: false,
    category: 'daily',
    difficulty: 'hard',
  },
];

export const WEEKLY_GOALS: Goal[] = [
  {
    id: "weekly_earnings_100k",
    title: "Weekly Millionaire",
    description: "Earn $100,000 in a week",
    type: 'earnings',
    target: 100000,
    reward: 25000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'weekly',
    difficulty: 'medium',
  },
  {
    id: "weekly_business_master",
    title: "Business Master",
    description: "Own 10 businesses at level 10+",
    type: 'businesses',
    target: 10,
    reward: 50000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'weekly',
    difficulty: 'hard',
  },
  {
    id: "weekly_property_mogul",
    title: "Property Mogul",
    description: "Own 5 properties generating $10,000/hour",
    type: 'properties',
    target: 10000,
    reward: 75000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'weekly',
    difficulty: 'hard',
  },
  {
    id: "weekly_stock_king",
    title: "Stock Market King",
    description: "Make $50,000 profit from stock trading",
    type: 'trading',
    target: 50000,
    reward: 100000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'weekly',
    difficulty: 'extreme',
  },
];

export const MONTHLY_GOALS: Goal[] = [
  {
    id: "monthly_billionaire",
    title: "Monthly Billionaire",
    description: "Earn $1,000,000 in a month",
    type: 'earnings',
    target: 1000000,
    reward: 500000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'monthly',
    difficulty: 'extreme',
  },
  {
    id: "monthly_empire",
    title: "Business Empire",
    description: "Own all businesses at max level",
    type: 'businesses',
    target: 50,
    reward: 1000000,
    rewardType: 'prestige',
    unlocked: true,
    completed: false,
    category: 'monthly',
    difficulty: 'extreme',
  },
  {
    id: "monthly_real_estate_tycoon",
    title: "Real Estate Tycoon",
    description: "Own $100,000,000 in property value",
    type: 'properties',
    target: 100000000,
    reward: 2000000,
    rewardType: 'cash',
    unlocked: true,
    completed: false,
    category: 'monthly',
    difficulty: 'extreme',
  },
];

export const PRESTIGE_GOALS: Goal[] = [
  {
    id: "prestige_1",
    title: "First Prestige",
    description: "Complete your first prestige",
    type: 'prestige',
    target: 1,
    reward: 0,
    rewardType: 'prestige',
    unlocked: true,
    completed: false,
    category: 'prestige',
    difficulty: 'medium',
  },
  {
    id: "prestige_5",
    title: "Prestige Master",
    description: "Reach prestige level 5",
    type: 'prestige',
    target: 5,
    reward: 0,
    rewardType: 'prestige',
    unlocked: false,
    completed: false,
    category: 'prestige',
    difficulty: 'hard',
    requirements: { minPrestige: 1 },
  },
  {
    id: "prestige_10",
    title: "Prestige Legend",
    description: "Reach prestige level 10",
    type: 'prestige',
    target: 10,
    reward: 0,
    rewardType: 'prestige',
    unlocked: false,
    completed: false,
    category: 'prestige',
    difficulty: 'extreme',
    requirements: { minPrestige: 5 },
  },
];

export const ALL_GOALS = [
  ...DAILY_GOALS,
  ...WEEKLY_GOALS,
  ...MONTHLY_GOALS,
  ...PRESTIGE_GOALS,
];

export const GOAL_REWARDS = {
  cash: (amount: number) => ({ type: 'cash', amount }),
  multiplier: (amount: number) => ({ type: 'multiplier', amount }),
  unlock: (item: string) => ({ type: 'unlock', item }),
  prestige: () => ({ type: 'prestige' }),
};
