import { Property, PropertyCategory } from '@/types/game';

const createProperty = (data: {
  id: string;
  name: string;
  icon: string;
  category: PropertyCategory;
  subtype: string;
  baseCost: number;
  baseIncomePH: number;
  imageUrl?: string;
}): Property => ({
  id: data.id,
  name: data.name,
  icon: data.icon,
  category: data.category,
  subtype: data.subtype,
  baseCost: data.baseCost,
  baseIncomePH: data.baseIncomePH,
  level: 0,
  owned: false,
  upgradeSmartMgmt: 0,
  upgradeRenovation: 0,
  amenities: [],
  tenantQuality: 'B',
  vacancyRate: 0.04,
  value: data.baseCost,
  incomePerHour: 0,
  maintenancePerHour: 0,
  taxesPerSec: 0,
  insurancePerSec: 0,
  netIncomePerHour: 0,
  purchasePrice: 0,
  imageUrl: data.imageUrl,
});

export const INITIAL_PROPERTIES_NEW: Property[] = [
  createProperty({
    id: 'p1',
    name: 'Studio Apartment',
    icon: '🏠',
    category: 'RESIDENTIAL',
    subtype: 'Studio',
    baseCost: 10000,
    baseIncomePH: 120,
  }),
  
  createProperty({
    id: 'p2',
    name: 'Suburban Home',
    icon: '🏡',
    category: 'RESIDENTIAL',
    subtype: 'SuburbanHome',
    baseCost: 35000,
    baseIncomePH: 380,
  }),
  
  createProperty({
    id: 'p3',
    name: 'City Apartment',
    icon: '🏢',
    category: 'RESIDENTIAL',
    subtype: 'Apartment',
    baseCost: 110000,
    baseIncomePH: 1200,
  }),
  
  createProperty({
    id: 'p4',
    name: 'Retail Unit',
    icon: '🏪',
    category: 'COMMERCIAL',
    subtype: 'RetailUnit',
    baseCost: 260000,
    baseIncomePH: 3200,
  }),
  
  createProperty({
    id: 'p5',
    name: 'Penthouse Suite',
    icon: '🌆',
    category: 'RESIDENTIAL',
    subtype: 'Penthouse',
    baseCost: 550000,
    baseIncomePH: 7500,
  }),
  
  createProperty({
    id: 'p6',
    name: 'Office Floor',
    icon: '💼',
    category: 'COMMERCIAL',
    subtype: 'OfficeFloor',
    baseCost: 1200000,
    baseIncomePH: 18000,
  }),
  
  createProperty({
    id: 'p7',
    name: 'Luxury Condo',
    icon: '🏰',
    category: 'LUXURY_DEV',
    subtype: 'LuxuryCondo',
    baseCost: 2800000,
    baseIncomePH: 42000,
  }),
  
  createProperty({
    id: 'p8',
    name: 'Logistics Warehouse',
    icon: '📦',
    category: 'COMMERCIAL',
    subtype: 'LogisticsWarehouse',
    baseCost: 5500000,
    baseIncomePH: 85000,
  }),
  
  createProperty({
    id: 'p9',
    name: 'Boutique Hotel',
    icon: '🏨',
    category: 'LUXURY_DEV',
    subtype: 'Hotel',
    baseCost: 12000000,
    baseIncomePH: 180000,
  }),
  
  createProperty({
    id: 'p10',
    name: 'Beachfront Resort',
    icon: '🏖️',
    category: 'LUXURY_DEV',
    subtype: 'Resort',
    baseCost: 30000000,
    baseIncomePH: 450000,
  }),
];
