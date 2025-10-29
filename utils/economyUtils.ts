import { EconomicPhase, EconomicPhaseType, RegionalModifiers } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';

export const getNextEconomicPhase = (currentPhase: EconomicPhase): EconomicPhase => {
  const phases = GAME_CONFIG.ECONOMIC_CYCLE.PHASES;
  const currentIndex = phases.findIndex(p => p.name === currentPhase.phase);
  const nextIndex = (currentIndex + 1) % phases.length;
  const nextPhaseConfig = phases[nextIndex];
  
  return {
    phase: nextPhaseConfig.name,
    duration: nextPhaseConfig.minutes * 60 * 1000,
    startTime: Date.now(),
    multiplier: nextPhaseConfig.mult,
  };
};

export const updateMarketSentiment = (
  currentSentiment: number,
  deltaTime: number
): number => {
  const targetSentiment = GAME_CONFIG.SENTIMENT.STARTING;
  const meanRevertStrength = GAME_CONFIG.SENTIMENT.MEAN_REVERT_STRENGTH;
  
  const randomWalk = (Math.random() - 0.5) * 2;
  
  const meanReversion = (targetSentiment - currentSentiment) * meanRevertStrength;
  
  let newSentiment = currentSentiment + randomWalk + meanReversion;
  
  return Math.max(
    GAME_CONFIG.SENTIMENT.MIN,
    Math.min(GAME_CONFIG.SENTIMENT.MAX, newSentiment)
  );
};

export const updateEfficiencyMultiplier = (
  currentEfficiency: number,
  deltaTime: number
): number => {
  const target = GAME_CONFIG.EFFICIENCY.MEAN_REVERT_TO;
  const volatility = GAME_CONFIG.EFFICIENCY.VOLATILITY;
  
  const randomChange = (Math.random() - 0.5) * volatility * 2;
  
  const meanReversion = (target - currentEfficiency) * 0.01;
  
  let newEfficiency = currentEfficiency + randomChange + meanReversion;
  
  return Math.max(0.5, Math.min(GAME_CONFIG.EFFICIENCY.BASE_CAP, newEfficiency));
};

export const updateRegionalModifiers = (
  current: RegionalModifiers,
  phase: EconomicPhaseType
): RegionalModifiers => {
  let housingChange = 0;
  let tourismChange = 0;
  let businessChange = 0;
  
  switch (phase) {
    case 'expansion':
    case 'peak':
      housingChange = 0.002;
      tourismChange = 0.003;
      businessChange = 0.0025;
      break;
    case 'recession':
    case 'trough':
      housingChange = -0.002;
      tourismChange = -0.003;
      businessChange = -0.0025;
      break;
    case 'recovery':
      housingChange = 0.001;
      tourismChange = 0.0015;
      businessChange = 0.001;
      break;
  }
  
  housingChange += (Math.random() - 0.5) * 0.002;
  tourismChange += (Math.random() - 0.5) * 0.004;
  businessChange += (Math.random() - 0.5) * 0.003;
  
  return {
    housingPriceIndex: Math.max(0.5, Math.min(2.0, current.housingPriceIndex + housingChange)),
    tourismIndex: Math.max(0.5, Math.min(2.0, current.tourismIndex + tourismChange)),
    businessRentDemand: Math.max(0.5, Math.min(2.0, current.businessRentDemand + businessChange)),
  };
};

export const calculateBrandInfluenceScore = (luxuryItems: { owned: boolean; brandScore: number }[]): number => {
  return luxuryItems.reduce((sum, item) => {
    return item.owned ? sum + item.brandScore : sum;
  }, 0);
};

export const getBrandInfluenceBonus = (brandScore: number): number => {
  const thresholds = GAME_CONFIG.LUXURY.BRAND_INFLUENCE.THRESHOLDS;
  
  let bonus = 0;
  for (const threshold of thresholds) {
    if (brandScore >= threshold.score) {
      bonus = threshold.bonus;
    }
  }
  
  return bonus;
};
