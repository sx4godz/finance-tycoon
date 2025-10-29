import { Stock, GameState, EconomicPhaseType } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';

const gaussianRandom = (): number => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const calculateStockPriceTick = (
  stock: Stock,
  phase: EconomicPhaseType,
  activeEvents: GameState['activeMarketEvents']
): number => {
  const volatilitySigma = GAME_CONFIG.STOCKS.VOLATILITY[stock.volatility];
  
  let drift = GAME_CONFIG.STOCKS.DRIFT_DAILY;
  
  const phaseDriftAdjustment = GAME_CONFIG.STOCKS.PHASE_DRIFT_ADJUSTMENT[phase] || 0;
  drift += phaseDriftAdjustment;
  
  activeEvents.forEach(event => {
    if (!event.active) return;
    
    if (event.affectedSectors?.includes(stock.sector)) {
      if (event.type === 'boom') {
        drift += 0.01;
      } else if (event.type === 'crash') {
        drift -= 0.01;
      }
    }
    
    if (event.type === 'crash' && !event.affectedSectors) {
      drift -= 0.01;
    }
  });
  
  const randomNoise = gaussianRandom() * volatilitySigma;
  
  const priceChange = drift + randomNoise;
  const nextPrice = stock.currentPrice * (1 + priceChange);
  
  const floor = stock.basePrice * GAME_CONFIG.STOCKS.FLOOR_MULTIPLE;
  
  return Math.max(floor, nextPrice);
};

export const updateStockHistory = (stock: Stock, newPrice: number): number[] => {
  const newHistory = [...stock.priceHistory, newPrice];
  
  if (newHistory.length > GAME_CONFIG.STOCKS.HISTORY_LENGTH) {
    newHistory.shift();
  }
  
  return newHistory;
};

export const calculateStockPortfolioValue = (stocks: Stock[]): number => {
  return stocks.reduce((total, stock) => {
    return total + (stock.currentPrice * stock.sharesOwned);
  }, 0);
};

export const calculateStockProfitLoss = (
  stock: Stock,
  purchasePrice: number,
  shares: number
): number => {
  return (stock.currentPrice - purchasePrice) * shares;
};
