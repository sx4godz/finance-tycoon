import { Stock, StockSector, VolatilityTier } from '@/types/game';

const createStock = (data: {
  id: string;
  name: string;
  symbol: string;
  sector: StockSector;
  volatility: VolatilityTier;
  basePrice: number;
}): Stock => ({
  id: data.id,
  name: data.name,
  symbol: data.symbol,
  sector: data.sector,
  volatility: data.volatility,
  basePrice: data.basePrice,
  currentPrice: data.basePrice,
  sharesOwned: 0,
  priceHistory: [data.basePrice],
});

export const INITIAL_STOCKS_NEW: Stock[] = [
  createStock({
    id: 's1',
    name: 'FoodCorp Global',
    symbol: 'FOOD',
    sector: 'Food',
    volatility: 'LOW',
    basePrice: 50,
  }),
  
  createStock({
    id: 's2',
    name: 'RetailMart Inc',
    symbol: 'RETL',
    sector: 'Retail',
    volatility: 'MED',
    basePrice: 75,
  }),
  
  createStock({
    id: 's3',
    name: 'TechGiant Systems',
    symbol: 'TECH',
    sector: 'Tech',
    volatility: 'HIGH',
    basePrice: 200,
  }),
  
  createStock({
    id: 's4',
    name: 'Industrial Motors',
    symbol: 'IMOT',
    sector: 'Industrial',
    volatility: 'MED',
    basePrice: 120,
  }),
  
  createStock({
    id: 's5',
    name: 'PropertyDev Ltd',
    symbol: 'PROP',
    sector: 'RealEstate',
    volatility: 'LOW',
    basePrice: 180,
  }),
  
  createStock({
    id: 's6',
    name: 'ServicePro Group',
    symbol: 'SERV',
    sector: 'Services',
    volatility: 'LOW',
    basePrice: 90,
  }),
  
  createStock({
    id: 's7',
    name: 'Tourism Holdings',
    symbol: 'TOUR',
    sector: 'Tourism',
    volatility: 'HIGH',
    basePrice: 65,
  }),
  
  createStock({
    id: 's8',
    name: 'Energy Solutions',
    symbol: 'ENGY',
    sector: 'Energy',
    volatility: 'HIGH',
    basePrice: 250,
  }),
];

export const TRADING_UNLOCK_THRESHOLD = 250000;
