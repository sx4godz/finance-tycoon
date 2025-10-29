import { Stock, StockSector, GameState } from '@/types/game';
import { GAME_CONFIG, getStockPhaseBias, gaussian } from '@/constants/gameConfig';

export const tickStockPrice = (stock: Stock, gameState: GameState): number => {
  const volatilityConfig = GAME_CONFIG.STOCKS.VOLATILITY;
  const sigma = volatilityConfig[stock.volatility];
  
  const phaseBias = getStockPhaseBias(gameState.economicPhase.phase);
  
  let eventBias = 0;
  gameState.activeMarketEvents.forEach(event => {
    if (!event.active) return;
    
    if (event.affectedSectors && event.affectedSectors.includes(stock.sector)) {
      if (event.type === 'boom') {
        eventBias += GAME_CONFIG.STOCKS.PRICE_MODEL.EVENT_BIAS.BOOM_SECTOR;
      } else if (event.type === 'crash') {
        eventBias += GAME_CONFIG.STOCKS.PRICE_MODEL.EVENT_BIAS.CRASH_GLOBAL;
      }
    }
  });
  
  const drift = GAME_CONFIG.STOCKS.PRICE_MODEL.DRIFT_DAILY / (24 * 3600 / GAME_CONFIG.STOCKS.TICK_INTERVAL_SEC);
  const totalDrift = drift + phaseBias + eventBias;
  
  const rand = gaussian(0, sigma);
  
  const nextPrice = stock.currentPrice * (1 + totalDrift + rand);
  
  const floor = stock.basePrice * GAME_CONFIG.STOCKS.PRICE_MODEL.FLOOR_MULTIPLE_OF_BASE;
  
  return Math.max(floor, nextPrice);
};

export const calculateStockValue = (stock: Stock): number => {
  return stock.currentPrice * stock.sharesOwned;
};

export const calculatePortfolioValue = (stocks: Stock[]): number => {
  return stocks.reduce((sum, stock) => sum + calculateStockValue(stock), 0);
};

export const calculateRealizedProfit = (
  stock: Stock,
  sellPrice: number,
  sharesSold: number
): number => {
  const buyPrice = stock.averageBuyPrice ?? stock.basePrice;
  return (sellPrice - buyPrice) * sharesSold;
};

export const shouldTriggerStopLoss = (stock: Stock): boolean => {
  if (!stock.stopLoss || stock.sharesOwned === 0) return false;
  return stock.currentPrice <= stock.stopLoss;
};

export const shouldTriggerTakeProfit = (stock: Stock): boolean => {
  if (!stock.takeProfit || stock.sharesOwned === 0) return false;
  return stock.currentPrice >= stock.takeProfit;
};

export const getCategoryLeadingBonus = (
  sector: StockSector,
  gameState: GameState
): number => {
  const categoryMap: Record<StockSector, string> = {
    Food: 'FOOD_BEV',
    Retail: 'RETAIL_SERVICES',
    Tech: 'TECH_APPS',
    Industrial: 'INDUSTRIAL',
    RealEstate: 'REAL_ESTATE_SERVICES',
    Services: 'FINANCE_SERVICES',
    Tourism: 'LUXURY_DEV',
    Energy: 'INDUSTRIAL',
  };
  
  const category = categoryMap[sector];
  if (!category) return 0;
  
  const dominance = gameState.categoryDominance[category as keyof typeof gameState.categoryDominance];
  
  if (dominance >= 0.50) {
    return GAME_CONFIG.STOCKS.GAMEPLAY_LINKS.CATEGORY_LEADING_BONUS;
  }
  
  return 0;
};

export const updateAverageBuyPrice = (
  currentAverage: number | undefined,
  currentShares: number,
  newShares: number,
  newPrice: number
): number => {
  if (currentShares === 0) return newPrice;
  
  const totalCost = (currentAverage ?? newPrice) * currentShares + newPrice * newShares;
  const totalShares = currentShares + newShares;
  
  return totalCost / totalShares;
};
