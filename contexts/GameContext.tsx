import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  INITIAL_BUSINESSES,
  COST_MULTIPLIER,
  REVENUE_MULTIPLIER,
  AUTO_GENERATE_LEVEL,
  EMPLOYEE_SALARY_PERCENTAGE,
  MAINTENANCE_COST_PERCENTAGE,
  UTILITIES_COST_PERCENTAGE,
  MARKETING_COST_PERCENTAGE,
} from "@/constants/businesses";
import {
  INITIAL_TAP_UPGRADE,
  INITIAL_MULTIPLIERS,
  ACHIEVEMENTS,
  TAP_COST_MULTIPLIER,
  MULTIPLIER_COST_MULTIPLIER,
  PRESTIGE_REQUIREMENT,
  PRESTIGE_MULTIPLIER,
} from "@/constants/upgrades";
import { INITIAL_PROPERTIES, PROPERTY_COST_MULTIPLIER } from "@/constants/properties";
import { INITIAL_LUXURY_ITEMS } from "@/constants/luxury";
import { INITIAL_STOCKS, TRADING_UNLOCK_THRESHOLD } from "@/constants/stocks";
import { GameState, Business } from "@/types/game";

const STORAGE_KEY = "finance_tycoon_game_state_v2";
const AD_COOLDOWN = 300000;
const FORCED_AD_INTERVAL = 180000;
const FREE_UPGRADE_AD_COOLDOWN = 180000;
const INITIAL_WATCH_AD_DELAY = 150000;
const MIN_AD_GAP = 60000;

const getInitialState = (): GameState => ({
  cash: 0,
  businesses: INITIAL_BUSINESSES,
  properties: INITIAL_PROPERTIES,
  luxuryItems: INITIAL_LUXURY_ITEMS,
  stocks: INITIAL_STOCKS,
  totalEarnings: 0,
  totalSpent: 0,
  netWorth: 0,
  lastSaveTime: Date.now(),
  tapPower: INITIAL_TAP_UPGRADE,
  multipliers: INITIAL_MULTIPLIERS,
  lifetimeTaps: 0,
  achievements: ACHIEVEMENTS,
  prestigeLevel: 0,
  prestigeMultiplier: 1,
  tradingUnlocked: false,
  isPremium: false,
  adsWatched: 0,
  lastAdWatchTime: 0,
  lastForcedAdTime: 0,
  userActionsSinceAd: 0,
  freeUpgradeAdsWatched: 0,
  lastFreeUpgradeAdTime: 0,
  lastDoubleEarningsPopup: 0,
  doubleEarningsEndTime: 0,
  sessionStartTime: Date.now(),
  lastFreeUpgradeAvailableTime: 0,
  loans: [],
  totalDebt: 0,
  monthlyExpenses: 0,
  lastExpenseCalculation: Date.now(),
  activeMarketEvents: [],
  isBankrupt: false,
  bankruptcyCount: 0,
});

const calculateUpgradeCost = (baseCost: number, level: number): number => {
  return Math.floor(baseCost * Math.pow(COST_MULTIPLIER, level));
};

const calculateRevenue = (baseRevenue: number, level: number): number => {
  if (level === 0) return 0;
  return Math.floor(baseRevenue * Math.pow(REVENUE_MULTIPLIER, level - 1));
};

const calculateBusinessMetrics = (business: Business, level: number) => {
  const grossRevenue = calculateRevenue(business.baseRevenue, level);
  
  const upgradeMultipliers = business.upgrades.reduce((acc, upgrade) => {
    if (!upgrade.unlocked) return acc;
    return {
      revenue: acc.revenue * (upgrade.revenueMultiplier || 1),
      costReduction: acc.costReduction + (upgrade.costReduction || 0),
      efficiency: acc.efficiency * (upgrade.employeeEfficiency || 1),
    };
  }, { revenue: 1, costReduction: 0, efficiency: 1 });
  
  const finalCostReduction = Math.min(0.85, upgradeMultipliers.costReduction);
  
  const finalRevenue = Math.floor(grossRevenue * upgradeMultipliers.revenue);
  
  const employeeCost = business.maxEmployees > 0 
    ? (finalRevenue * EMPLOYEE_SALARY_PERCENTAGE * (1 - finalCostReduction)) / upgradeMultipliers.efficiency
    : 0;
  
  const maintenanceCost = finalRevenue * MAINTENANCE_COST_PERCENTAGE * (1 - finalCostReduction);
  const utilitiesCost = finalRevenue * UTILITIES_COST_PERCENTAGE * (1 - finalCostReduction);
  const marketingCost = finalRevenue * MARKETING_COST_PERCENTAGE * (1 + business.marketingLevel * 0.1);
  
  const totalCosts = employeeCost + maintenanceCost + utilitiesCost + marketingCost;
  const netIncome = Math.max(0, finalRevenue - totalCosts);
  
  return {
    revenuePerHour: finalRevenue,
    employeeSalaryPerHour: employeeCost,
    maintenanceCostPerHour: maintenanceCost,
    utilitiesCostPerHour: utilitiesCost,
    marketingBudgetPerHour: marketingCost,
    runningCostsPerHour: totalCosts,
    netIncomePerHour: netIncome,
  };
};

export const [GameProvider, useGame] = createContextHook(() => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [stockEarnings, setStockEarnings] = useState<number>(0);
  const [shouldShowForcedAd, setShouldShowForcedAd] = useState<boolean>(false);

  const loadGameQuery = useQuery({
    queryKey: ["gameState"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<GameState>;
          const initialState = getInitialState();
          
          const mergedState: GameState = {
            cash: parsed.cash ?? initialState.cash,
            totalEarnings: parsed.totalEarnings ?? initialState.totalEarnings,
            totalSpent: parsed.totalSpent ?? initialState.totalSpent,
            netWorth: parsed.netWorth ?? initialState.netWorth,
            lastSaveTime: parsed.lastSaveTime ?? Date.now(),
            lifetimeTaps: parsed.lifetimeTaps ?? initialState.lifetimeTaps,
            prestigeLevel: parsed.prestigeLevel ?? initialState.prestigeLevel,
            prestigeMultiplier: parsed.prestigeMultiplier ?? initialState.prestigeMultiplier,
            tradingUnlocked: parsed.tradingUnlocked ?? initialState.tradingUnlocked,
            isPremium: parsed.isPremium ?? initialState.isPremium,
            adsWatched: parsed.adsWatched ?? initialState.adsWatched,
            lastAdWatchTime: parsed.lastAdWatchTime ?? initialState.lastAdWatchTime,
            lastForcedAdTime: parsed.lastForcedAdTime ?? initialState.lastForcedAdTime,
            userActionsSinceAd: parsed.userActionsSinceAd ?? initialState.userActionsSinceAd,
            freeUpgradeAdsWatched: parsed.freeUpgradeAdsWatched ?? initialState.freeUpgradeAdsWatched,
            lastFreeUpgradeAdTime: parsed.lastFreeUpgradeAdTime ?? initialState.lastFreeUpgradeAdTime,
            lastDoubleEarningsPopup: parsed.lastDoubleEarningsPopup ?? initialState.lastDoubleEarningsPopup,
            doubleEarningsEndTime: parsed.doubleEarningsEndTime ?? initialState.doubleEarningsEndTime,
            sessionStartTime: Date.now(),
            lastFreeUpgradeAvailableTime: parsed.lastFreeUpgradeAvailableTime ?? initialState.lastFreeUpgradeAvailableTime,
            loans: parsed.loans ?? initialState.loans,
            totalDebt: parsed.totalDebt ?? initialState.totalDebt,
            monthlyExpenses: parsed.monthlyExpenses ?? initialState.monthlyExpenses,
            lastExpenseCalculation: parsed.lastExpenseCalculation ?? initialState.lastExpenseCalculation,
            activeMarketEvents: parsed.activeMarketEvents ?? initialState.activeMarketEvents,
            isBankrupt: parsed.isBankrupt ?? initialState.isBankrupt,
            bankruptcyCount: parsed.bankruptcyCount ?? initialState.bankruptcyCount,
            tapPower: {
              ...initialState.tapPower,
              ...(parsed.tapPower || {}),
            },
            businesses: initialState.businesses.map((initialBusiness) => {
              const savedBusiness = parsed.businesses?.find(
                (b) => b.id === initialBusiness.id
              );
              return {
                ...initialBusiness,
                ...(savedBusiness || {}),
                upgrades: initialBusiness.upgrades.map((initialUpgrade) => {
                  const savedUpgrade = savedBusiness?.upgrades?.find(
                    (u) => u.id === initialUpgrade.id
                  );
                  return savedUpgrade || initialUpgrade;
                }),
              };
            }),
            properties: initialState.properties.map((initialProperty) => {
              const savedProperty = parsed.properties?.find(
                (p) => p.id === initialProperty.id
              );
              return {
                ...initialProperty,
                ...(savedProperty || {}),
              };
            }),
            luxuryItems: initialState.luxuryItems.map((initialItem) => {
              const savedItem = parsed.luxuryItems?.find(
                (l) => l.id === initialItem.id
              );
              return {
                ...initialItem,
                ...(savedItem || {}),
              };
            }),
            stocks: initialState.stocks.map((initialStock) => {
              const savedStock = parsed.stocks?.find(
                (s) => s.id === initialStock.id
              );
              return {
                ...initialStock,
                ...(savedStock || {}),
              };
            }),
            multipliers: initialState.multipliers.map((initialMultiplier) => {
              const savedMultiplier = parsed.multipliers?.find(
                (m) => m.id === initialMultiplier.id
              );
              return {
                ...initialMultiplier,
                ...(savedMultiplier || {}),
              };
            }),
            achievements: initialState.achievements.map((initialAchievement) => {
              const savedAchievement = parsed.achievements?.find(
                (a) => a.id === initialAchievement.id
              );
              return {
                ...initialAchievement,
                ...(savedAchievement || {}),
              };
            }),
          };

          const timeDiff = Date.now() - mergedState.lastSaveTime;
          const secondsPassed = Math.floor(timeDiff / 1000);
          const maxOfflineTime = 14400;
          const cappedSeconds = Math.min(secondsPassed, maxOfflineTime);

          let offlineEarnings = 0;
          mergedState.businesses.forEach((business) => {
            if (business.autoGenerate && business.owned) {
              offlineEarnings += (business.netIncomePerHour / 3600) * cappedSeconds;
            }
          });
          mergedState.properties.forEach((property) => {
            if (property.owned) {
              const propertyIncome = property.rented ? property.rentIncome : property.incomePerHour;
              offlineEarnings += (propertyIncome * property.level / 3600) * cappedSeconds;
            }
          });

          console.log(`Offline for ${secondsPassed}s, earned $${Math.floor(offlineEarnings)}`);

          return {
            ...mergedState,
            cash: mergedState.cash + offlineEarnings,
            totalEarnings: mergedState.totalEarnings + offlineEarnings,
            lastSaveTime: Date.now(),
          };
        } catch (error) {
          console.error("Error loading game state:", error);
          return getInitialState();
        }
      }
      return getInitialState();
    },
  });

  const saveGameMutation = useMutation({
    mutationFn: async (state: GameState) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    },
  });

  const { mutate: saveGame } = saveGameMutation;

  useEffect(() => {
    if (loadGameQuery.data) {
      setGameState(loadGameQuery.data);
    }
  }, [loadGameQuery.data]);

  const calculateLuxuryBonus = useCallback((state: GameState) => {
    return state.luxuryItems.reduce((total, item) => {
      return item.owned ? total + item.multiplierBonus : total;
    }, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        let newCash = prev.cash;
        const luxuryBonus = calculateLuxuryBonus(prev);
        const premiumBonus = prev.isPremium ? 1 : 0;
        
        prev.businesses.forEach((business) => {
          if (business.autoGenerate && business.owned && business.netIncomePerHour > 0) {
            const netIncome = (business.netIncomePerHour / 3600) * prev.prestigeMultiplier * (1 + luxuryBonus + premiumBonus);
            newCash += netIncome;
          }
        });

        prev.properties.forEach((property) => {
          if (property.owned) {
            const propertyIncome = property.rented ? property.rentIncome : property.incomePerHour;
            const earnings = ((propertyIncome * property.level * prev.prestigeMultiplier * (1 + luxuryBonus + premiumBonus)) / 3600);
            newCash += earnings;
          }
        });

        return {
          ...prev,
          cash: newCash,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateLuxuryBonus]);

  useEffect(() => {
    const stockInterval = setInterval(() => {
      setGameState((prev) => {
        if (!prev.tradingUnlocked) return prev;

        const updatedStocks = prev.stocks.map((stock) => {
          const randomChange = (Math.random() - 0.5) * 2 * stock.volatility;
          const newPrice = Math.max(stock.basePrice * 0.1, stock.currentPrice * (1 + randomChange));
          
          const newHistory = [...stock.priceHistory, newPrice];
          if (newHistory.length > 20) {
            newHistory.shift();
          }

          return {
            ...stock,
            currentPrice: newPrice,
            priceHistory: newHistory,
          };
        });

        return {
          ...prev,
          stocks: updatedStocks,
        };
      });
    }, 5000);

    return () => clearInterval(stockInterval);
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setGameState((currentState) => {
        const stateToSave = {
          ...currentState,
          lastSaveTime: Date.now(),
        };
        saveGame(stateToSave);
        return currentState;
      });
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [saveGame]);

  const checkAllAchievements = useCallback(() => {
    setGameState((prev) => {
      const updatedAchievements = prev.achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;
        switch (achievement.id) {
          case "first_business":
            shouldUnlock = prev.businesses.some((b) => b.owned);
            break;
          case "first_property":
            shouldUnlock = prev.properties.some((p) => p.owned);
            break;
          case "first_luxury":
            shouldUnlock = prev.luxuryItems.some((l) => l.owned);
            break;
          case "first_trade":
            shouldUnlock = prev.stocks.some((s) => s.sharesOwned > 0);
            break;
          case "tap_master":
            shouldUnlock = prev.lifetimeTaps >= 1000;
            break;
          case "tap_legend":
            shouldUnlock = prev.lifetimeTaps >= 10000;
            break;
          case "millionaire":
            shouldUnlock = prev.totalEarnings >= 1000000;
            break;
          case "multimillionaire":
            shouldUnlock = prev.totalEarnings >= 10000000;
            break;
          case "billionaire":
            shouldUnlock = prev.totalEarnings >= 1000000000;
            break;
          case "business_tycoon":
            shouldUnlock = prev.businesses.every((b) => b.owned);
            break;
          case "max_level":
            shouldUnlock = prev.businesses.some((b) => b.level >= 25);
            break;
          case "max_level_50":
            shouldUnlock = prev.businesses.some((b) => b.level >= 50);
            break;
          case "property_mogul":
            shouldUnlock = prev.properties.filter((p) => p.owned).length >= 5;
            break;
          case "luxury_collector":
            shouldUnlock = prev.luxuryItems.filter((l) => l.owned).length >= 5;
            break;
          case "portfolio_king":
            shouldUnlock = prev.stocks.every((s) => s.sharesOwned > 0);
            break;
          case "prestige_master":
            shouldUnlock = prev.prestigeLevel >= 1;
            break;
          case "trading_expert":
            shouldUnlock = stockEarnings >= 1000000;
            break;
        }

        if (shouldUnlock) {
          console.log(`Achievement unlocked: ${achievement.name}`);
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });

      const achievementBonus = updatedAchievements
        .filter((a, index) => !prev.achievements[index].unlocked && a.unlocked)
        .reduce((sum, a) => sum + a.reward, 0);

      if (achievementBonus > 0) {
        return {
          ...prev,
          cash: prev.cash + achievementBonus,
          achievements: updatedAchievements,
        };
      }

      return { ...prev, achievements: updatedAchievements };
    });
  }, [stockEarnings]);

  const incrementUserAction = useCallback(() => {
    setGameState((prev) => {
      const newActionCount = prev.userActionsSinceAd + 1;
      const timeSinceSessionStart = Date.now() - prev.sessionStartTime;
      const timeSinceLastAd = Date.now() - prev.lastForcedAdTime;
      const timeSinceLastFreeUpgrade = Date.now() - prev.lastFreeUpgradeAdTime;
      
      const minTimeSinceLastAd = Math.max(
        MIN_AD_GAP,
        timeSinceLastFreeUpgrade < MIN_AD_GAP ? MIN_AD_GAP : 0
      );
      
      if (
        timeSinceSessionStart >= INITIAL_WATCH_AD_DELAY &&
        timeSinceLastAd >= FORCED_AD_INTERVAL &&
        timeSinceLastAd >= minTimeSinceLastAd &&
        newActionCount > 0 &&
        !prev.isPremium
      ) {
        setShouldShowForcedAd(true);
        return {
          ...prev,
          userActionsSinceAd: 0,
          lastForcedAdTime: Date.now(),
        };
      }
      
      return {
        ...prev,
        userActionsSinceAd: newActionCount,
      };
    });
  }, []);

  const closeForcedAd = useCallback(() => {
    setShouldShowForcedAd(false);
  }, []);

  const watchFreeUpgradeAd = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      freeUpgradeAdsWatched: prev.freeUpgradeAdsWatched + 1,
      lastFreeUpgradeAdTime: Date.now(),
      lastFreeUpgradeAvailableTime: Date.now(),
    }));
  }, []);

  const upgradeTapPowerWithAd = useCallback(() => {
    watchFreeUpgradeAd();
    setGameState((prev) => {
      return {
        ...prev,
        tapPower: {
          ...prev.tapPower,
          level: prev.tapPower.level + 1,
          multiplier: prev.tapPower.multiplier + 0.1,
        },
      };
    });
  }, [watchFreeUpgradeAd]);

  const upgradeMultiplierWithAd = useCallback((multiplierId: string) => {
    watchFreeUpgradeAd();
    setGameState((prev) => {
      const multiplierIndex = prev.multipliers.findIndex((m) => m.id === multiplierId);
      if (multiplierIndex === -1) return prev;

      const multiplier = prev.multipliers[multiplierIndex];
      const updatedMultipliers = [...prev.multipliers];
      updatedMultipliers[multiplierIndex] = {
        ...multiplier,
        level: multiplier.level + 1,
      };

      return {
        ...prev,
        multipliers: updatedMultipliers,
      };
    });
  }, [watchFreeUpgradeAd]);

  const upgradeBusinessWithAd = useCallback((businessId: string) => {
    watchFreeUpgradeAd();
    setGameState((prev) => {
      const businessIndex = prev.businesses.findIndex((b) => b.id === businessId);
      if (businessIndex === -1) return prev;

      const business = prev.businesses[businessIndex];
      const newLevel = business.owned ? business.level + 1 : 1;
      const shouldAutoGenerate = newLevel >= AUTO_GENERATE_LEVEL;
      
      const metrics = calculateBusinessMetrics(business, newLevel);

      const updatedBusinesses = [...prev.businesses];
      updatedBusinesses[businessIndex] = {
        ...business,
        level: newLevel,
        owned: true,
        autoGenerate: shouldAutoGenerate,
        ...metrics,
        employees: Math.min(newLevel, business.maxEmployees),
      };

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...prev,
        businesses: updatedBusinesses,
      };
    });
  }, [watchFreeUpgradeAd, checkAllAchievements]);



  const upgradeBusiness = useCallback((businessId: string) => {
    setGameState((prev) => {
      const businessIndex = prev.businesses.findIndex((b) => b.id === businessId);
      if (businessIndex === -1) return prev;

      const business = prev.businesses[businessIndex];
      const cost = business.owned
        ? calculateUpgradeCost(business.baseCost, business.level)
        : business.baseCost;

      if (prev.cash < cost) return prev;

      incrementUserAction();

      const newLevel = business.owned ? business.level + 1 : 1;
      const shouldAutoGenerate = newLevel >= AUTO_GENERATE_LEVEL;
      
      const metrics = calculateBusinessMetrics(business, newLevel);
      
      const updatedBusinesses = [...prev.businesses];
      updatedBusinesses[businessIndex] = {
        ...business,
        level: newLevel,
        owned: true,
        autoGenerate: shouldAutoGenerate,
        ...metrics,
        purchasePrice: !business.owned ? business.baseCost : business.purchasePrice,
        totalInvested: business.totalInvested + cost,
        employees: Math.min(newLevel, business.maxEmployees),
      };

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...prev,
        cash: prev.cash - cost,
        totalSpent: prev.totalSpent + cost,
        businesses: updatedBusinesses,
      };
    });
  }, [checkAllAchievements, incrementUserAction]);

  const upgradeBusinessOperation = useCallback((businessId: string, upgradeId: string) => {
    setGameState((prev) => {
      const businessIndex = prev.businesses.findIndex((b) => b.id === businessId);
      if (businessIndex === -1) return prev;

      const business = prev.businesses[businessIndex];
      if (!business.owned) return prev;

      const upgradeIndex = business.upgrades.findIndex((u) => u.id === upgradeId);
      if (upgradeIndex === -1) return prev;

      const upgrade = business.upgrades[upgradeIndex];
      if (upgrade.unlocked || prev.cash < upgrade.cost) return prev;

      const updatedUpgrades = [...business.upgrades];
      updatedUpgrades[upgradeIndex] = {
        ...upgrade,
        unlocked: true,
      };

      const metrics = calculateBusinessMetrics(
        { ...business, upgrades: updatedUpgrades },
        business.level
      );

      const updatedBusinesses = [...prev.businesses];
      updatedBusinesses[businessIndex] = {
        ...business,
        upgrades: updatedUpgrades,
        ...metrics,
      };

      console.log(`Upgraded ${business.name} with ${upgrade.name}`);

      return {
        ...prev,
        cash: prev.cash - upgrade.cost,
        totalSpent: prev.totalSpent + upgrade.cost,
        businesses: updatedBusinesses,
      };
    });
  }, []);

  const hireEmployee = useCallback((businessId: string) => {
    setGameState((prev) => {
      const businessIndex = prev.businesses.findIndex((b) => b.id === businessId);
      if (businessIndex === -1) return prev;

      const business = prev.businesses[businessIndex];
      if (!business.owned || business.employees >= business.maxEmployees) return prev;

      const hiringCost = business.baseCost * 0.1;
      if (prev.cash < hiringCost) return prev;

      const updatedBusinesses = [...prev.businesses];
      updatedBusinesses[businessIndex] = {
        ...business,
        employees: business.employees + 1,
      };

      return {
        ...prev,
        cash: prev.cash - hiringCost,
        totalSpent: prev.totalSpent + hiringCost,
        businesses: updatedBusinesses,
      };
    });
  }, []);

  const upgradeMarketing = useCallback((businessId: string) => {
    setGameState((prev) => {
      const businessIndex = prev.businesses.findIndex((b) => b.id === businessId);
      if (businessIndex === -1) return prev;

      const business = prev.businesses[businessIndex];
      if (!business.owned) return prev;

      const marketingCost = business.baseCost * (0.2 + business.marketingLevel * 0.15);
      if (prev.cash < marketingCost) return prev;

      const updatedBusinesses = [...prev.businesses];
      updatedBusinesses[businessIndex] = {
        ...business,
        marketingLevel: business.marketingLevel + 1,
      };

      const metrics = calculateBusinessMetrics(updatedBusinesses[businessIndex], business.level);
      updatedBusinesses[businessIndex] = {
        ...updatedBusinesses[businessIndex],
        ...metrics,
      };

      return {
        ...prev,
        cash: prev.cash - marketingCost,
        totalSpent: prev.totalSpent + marketingCost,
        businesses: updatedBusinesses,
      };
    });
  }, []);

  const buyProperty = useCallback((propertyId: string) => {
    setGameState((prev) => {
      const propertyIndex = prev.properties.findIndex((p) => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const property = prev.properties[propertyIndex];
      const cost = property.baseCost;

      if (prev.cash < cost || property.owned) return prev;

      incrementUserAction();

      const updatedProperties = [...prev.properties];
      updatedProperties[propertyIndex] = {
        ...property,
        owned: true,
        level: 1,
        purchasePrice: cost,
        currentMarketValue: cost,
      };

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...prev,
        cash: prev.cash - cost,
        totalSpent: prev.totalSpent + cost,
        properties: updatedProperties,
      };
    });
  }, [checkAllAchievements, incrementUserAction]);

  const upgradeProperty = useCallback((propertyId: string) => {
    setGameState((prev) => {
      const propertyIndex = prev.properties.findIndex((p) => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const property = prev.properties[propertyIndex];
      if (!property.owned) return prev;

      const cost = property.baseCost * Math.pow(PROPERTY_COST_MULTIPLIER, property.level);

      if (prev.cash < cost) return prev;

      incrementUserAction();

      const updatedProperties = [...prev.properties];
      updatedProperties[propertyIndex] = {
        ...property,
        level: property.level + 1,
        currentMarketValue: property.currentMarketValue + (cost * 0.7),
      };

      return {
        ...prev,
        cash: prev.cash - cost,
        totalSpent: prev.totalSpent + cost,
        properties: updatedProperties,
      };
    });
  }, [incrementUserAction]);

  const purchasePropertyCustomization = useCallback((propertyId: string, customizationId: string) => {
    setGameState((prev) => {
      const propertyIndex = prev.properties.findIndex((p) => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const property = prev.properties[propertyIndex];
      if (!property.owned) return prev;

      const customizationIndex = property.customizations.findIndex((c) => c.id === customizationId);
      if (customizationIndex === -1) return prev;

      const customization = property.customizations[customizationIndex];
      if (customization.unlocked || prev.cash < customization.cost) return prev;

      const updatedCustomizations = [...property.customizations];
      updatedCustomizations[customizationIndex] = {
        ...customization,
        unlocked: true,
      };

      const maintenanceReduction = updatedCustomizations
        .filter(c => c.unlocked)
        .reduce((sum, c) => sum + (c.maintenanceReduction || 0), 0);
      
      const incomeBoost = updatedCustomizations
        .filter(c => c.unlocked)
        .reduce((sum, c) => sum + (c.incomeBoost || 0), 0);
      
      const taxReduction = updatedCustomizations
        .filter(c => c.unlocked)
        .reduce((sum, c) => sum + (c.taxReduction || 0), 0);
      
      const insuranceReduction = updatedCustomizations
        .filter(c => c.unlocked)
        .reduce((sum, c) => sum + (c.insuranceReduction || 0), 0);
      
      const valueBoost = updatedCustomizations
        .filter(c => c.unlocked)
        .reduce((sum, c) => sum + (c.valueBoost || 0), 0);

      const newEnergyEfficiency = customization.category === 'eco' 
        ? Math.min(100, property.energyEfficiency + 15) 
        : property.energyEfficiency;
      
      const newSecurityLevel = customization.category === 'security' 
        ? Math.min(100, property.securityLevel + 20) 
        : property.securityLevel;
      
      const newAmenitiesLevel = customization.category === 'luxury' 
        ? Math.min(100, property.amenitiesLevel + 15) 
        : property.amenitiesLevel;

      const updatedProperties = [...prev.properties];
      updatedProperties[propertyIndex] = {
        ...property,
        customizations: updatedCustomizations,
        maintenanceCostPerHour: property.incomePerHour * 0.12 * (1 - maintenanceReduction),
        taxesPerMonth: property.baseCost * 0.0008 * (1 - taxReduction),
        insurancePerMonth: property.baseCost * 0.0004 * (1 - insuranceReduction),
        currentMarketValue: property.currentMarketValue + (property.baseCost * valueBoost),
        energyEfficiency: newEnergyEfficiency,
        securityLevel: newSecurityLevel,
        amenitiesLevel: newAmenitiesLevel,
        conditionScore: Math.min(100, property.conditionScore + 5),
      };

      console.log(`Installed ${customization.name} on ${property.name}`);

      return {
        ...prev,
        cash: prev.cash - customization.cost,
        totalSpent: prev.totalSpent + customization.cost,
        properties: updatedProperties,
      };
    });
  }, []);

  const toggleRentProperty = useCallback((propertyId: string) => {
    setGameState((prev) => {
      const propertyIndex = prev.properties.findIndex((p) => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const property = prev.properties[propertyIndex];
      if (!property.owned) return prev;

      const updatedProperties = [...prev.properties];
      updatedProperties[propertyIndex] = {
        ...property,
        rented: !property.rented,
      };

      console.log(`${property.rented ? 'Stopped renting' : 'Started renting'} ${property.name}`);

      return {
        ...prev,
        properties: updatedProperties,
      };
    });
  }, []);

  const buyLuxuryItem = useCallback((itemId: string) => {
    setGameState((prev) => {
      const itemIndex = prev.luxuryItems.findIndex((l) => l.id === itemId);
      if (itemIndex === -1) return prev;

      const item = prev.luxuryItems[itemIndex];
      if (prev.cash < item.cost || item.owned) return prev;

      incrementUserAction();

      const updatedItems = [...prev.luxuryItems];
      updatedItems[itemIndex] = {
        ...item,
        owned: true,
      };

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...prev,
        cash: prev.cash - item.cost,
        totalSpent: prev.totalSpent + item.cost,
        luxuryItems: updatedItems,
      };
    });
  }, [checkAllAchievements, incrementUserAction]);

  const buyStock = useCallback((stockId: string, shares: number) => {
    setGameState((prev) => {
      const stockIndex = prev.stocks.findIndex((s) => s.id === stockId);
      if (stockIndex === -1) return prev;

      const stock = prev.stocks[stockIndex];
      const cost = stock.currentPrice * shares;

      if (prev.cash < cost) return prev;

      incrementUserAction();

      const updatedStocks = [...prev.stocks];
      updatedStocks[stockIndex] = {
        ...stock,
        sharesOwned: stock.sharesOwned + shares,
      };

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...prev,
        cash: prev.cash - cost,
        totalSpent: prev.totalSpent + cost,
        stocks: updatedStocks,
      };
    });
  }, [checkAllAchievements, incrementUserAction]);

  const sellStock = useCallback((stockId: string, shares: number) => {
    setGameState((prev) => {
      const stockIndex = prev.stocks.findIndex((s) => s.id === stockId);
      if (stockIndex === -1) return prev;

      const stock = prev.stocks[stockIndex];
      if (stock.sharesOwned < shares) return prev;

      const revenue = stock.currentPrice * shares;

      const updatedStocks = [...prev.stocks];
      updatedStocks[stockIndex] = {
        ...stock,
        sharesOwned: stock.sharesOwned - shares,
      };

      setStockEarnings((prev) => prev + revenue);

      return {
        ...prev,
        cash: prev.cash + revenue,
        totalEarnings: prev.totalEarnings + revenue,
        stocks: updatedStocks,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    const initialState = getInitialState();
    setGameState(initialState);
    setStockEarnings(0);
    saveGame(initialState);
  }, [saveGame]);

  const addBonusCash = useCallback((amount: number) => {
    setGameState((prev) => {
      const progressMultiplier = Math.max(1, Math.floor(prev.totalEarnings / 100000));
      const baseAmount = amount * progressMultiplier;
      const finalAmount = prev.isPremium ? baseAmount * 2 : baseAmount;
      
      console.log(`Ad reward: $${finalAmount} (base: $${amount}, multiplier: ${progressMultiplier}x, premium: ${prev.isPremium ? '2x' : '1x'})`);
      
      return {
        ...prev,
        cash: prev.cash + finalAmount,
        totalEarnings: prev.totalEarnings + finalAmount,
        adsWatched: prev.adsWatched + 1,
        lastAdWatchTime: Date.now(),
      };
    });
  }, []);

  const earnFromTap = useCallback(() => {
    incrementUserAction();
    setGameState((prev) => {
      const totalMultiplier = prev.multipliers.reduce((acc, mult) => {
        return mult.level > 0 ? acc * Math.pow(mult.multiplierValue, mult.level) : acc;
      }, 1);

      const luxuryBonus = calculateLuxuryBonus(prev);
      const premiumBonus = prev.isPremium ? 1 : 0;

      const baseEarnings = prev.tapPower.level * prev.tapPower.multiplier * totalMultiplier * prev.prestigeMultiplier * (1 + luxuryBonus + premiumBonus);
      const earnings = Math.max(1, Math.floor(baseEarnings));

      const newTotalEarnings = prev.totalEarnings + earnings;
      const newLifetimeTaps = prev.lifetimeTaps + 1;

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...prev,
        cash: prev.cash + earnings,
        totalEarnings: newTotalEarnings,
        lifetimeTaps: newLifetimeTaps,
        tradingUnlocked: newTotalEarnings >= TRADING_UNLOCK_THRESHOLD,
      };
    });
  }, [calculateLuxuryBonus, checkAllAchievements, incrementUserAction]);

  const upgradeTapPower = useCallback(() => {
    incrementUserAction();
    setGameState((prev) => {
      const cost = Math.floor(
        prev.tapPower.baseCost * Math.pow(TAP_COST_MULTIPLIER, prev.tapPower.level - 1)
      );

      if (prev.cash < cost) return prev;

      return {
        ...prev,
        cash: prev.cash - cost,
        totalSpent: prev.totalSpent + cost,
        tapPower: {
          ...prev.tapPower,
          level: prev.tapPower.level + 1,
          multiplier: prev.tapPower.multiplier + 0.1,
        },
      };
    });
  }, [incrementUserAction]);

  const upgradeMultiplier = useCallback((multiplierId: string) => {
    incrementUserAction();
    setGameState((prev) => {
      const multiplierIndex = prev.multipliers.findIndex((m) => m.id === multiplierId);
      if (multiplierIndex === -1) return prev;

      const multiplier = prev.multipliers[multiplierIndex];
      const cost = Math.floor(
        multiplier.baseCost * Math.pow(MULTIPLIER_COST_MULTIPLIER, multiplier.level)
      );

      if (prev.cash < cost) return prev;

      const updatedMultipliers = [...prev.multipliers];
      updatedMultipliers[multiplierIndex] = {
        ...multiplier,
        level: multiplier.level + 1,
      };

      return {
        ...prev,
        cash: prev.cash - cost,
        totalSpent: prev.totalSpent + cost,
        multipliers: updatedMultipliers,
      };
    });
  }, [incrementUserAction]);

  const prestige = useCallback(() => {
    setGameState((prev) => {
      if (prev.totalEarnings < PRESTIGE_REQUIREMENT) return prev;

      const newPrestigeMultiplier = prev.prestigeMultiplier + PRESTIGE_MULTIPLIER;
      const initialState = getInitialState();

      setTimeout(() => {
        checkAllAchievements();
      }, 100);

      return {
        ...initialState,
        prestigeLevel: prev.prestigeLevel + 1,
        prestigeMultiplier: newPrestigeMultiplier,
        lifetimeTaps: prev.lifetimeTaps,
        achievements: prev.achievements,
        isPremium: prev.isPremium,
        adsWatched: prev.adsWatched,
        luxuryItems: prev.luxuryItems,
      };
    });
  }, [checkAllAchievements]);

  const sellBusiness = useCallback((businessId: string) => {
    setGameState((prev) => {
      const businessIndex = prev.businesses.findIndex((b) => b.id === businessId);
      if (businessIndex === -1) return prev;

      const business = prev.businesses[businessIndex];
      if (!business.owned) return prev;

      const depreciationRate = 0.7;
      const saleValue = Math.floor(business.totalInvested * depreciationRate);

      const updatedBusinesses = [...prev.businesses];
      updatedBusinesses[businessIndex] = {
        ...INITIAL_BUSINESSES.find(b => b.id === businessId)!,
      };

      console.log(`Sold ${business.name} for $${saleValue}`);

      return {
        ...prev,
        cash: prev.cash + saleValue,
        totalEarnings: prev.totalEarnings + saleValue,
        businesses: updatedBusinesses,
      };
    });
  }, []);

  const sellProperty = useCallback((propertyId: string) => {
    setGameState((prev) => {
      const propertyIndex = prev.properties.findIndex((p) => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const property = prev.properties[propertyIndex];
      if (!property.owned) return prev;

      const saleValue = Math.floor(property.currentMarketValue);

      const initialProperty = INITIAL_PROPERTIES.find(p => p.id === propertyId);
      if (!initialProperty) return prev;

      const updatedProperties = [...prev.properties];
      updatedProperties[propertyIndex] = {
        ...initialProperty,
      };

      console.log(`Sold ${property.name} for ${saleValue}`);

      return {
        ...prev,
        cash: prev.cash + saleValue,
        totalEarnings: prev.totalEarnings + saleValue,
        properties: updatedProperties,
      };
    });
  }, []);

  const takeLoan = useCallback((amount: number, months: number) => {
    setGameState((prev) => {
      const interestRate = 0.05 + (amount / 10000000) * 0.02;
      const monthlyInterest = interestRate / 12;
      const monthlyPayment = (amount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
        (Math.pow(1 + monthlyInterest, months) - 1);
      const totalOwed = monthlyPayment * months;

      const newLoan = {
        id: `loan_${Date.now()}`,
        amount,
        interestRate,
        monthlyPayment,
        remainingMonths: months,
        totalOwed,
        takenAt: Date.now(),
      };

      console.log(`Took loan: $${amount} at ${(interestRate * 100).toFixed(2)}% for ${months} months`);

      return {
        ...prev,
        cash: prev.cash + amount,
        loans: [...prev.loans, newLoan],
        totalDebt: prev.totalDebt + totalOwed,
      };
    });
  }, []);

  const payLoan = useCallback((loanId: string) => {
    setGameState((prev) => {
      const loanIndex = prev.loans.findIndex((l) => l.id === loanId);
      if (loanIndex === -1) return prev;

      const loan = prev.loans[loanIndex];
      const payoffAmount = loan.monthlyPayment * loan.remainingMonths;

      if (prev.cash < payoffAmount) return prev;

      const updatedLoans = prev.loans.filter((_, index) => index !== loanIndex);

      console.log(`Paid off loan ${loanId} for $${payoffAmount}`);

      return {
        ...prev,
        cash: prev.cash - payoffAmount,
        loans: updatedLoans,
        totalDebt: prev.totalDebt - payoffAmount,
      };
    });
  }, []);

  const purchasePremium = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPremium: true,
    }));
  }, []);

  const canWatchAd = useMemo(() => {
    return Date.now() - gameState.lastAdWatchTime >= AD_COOLDOWN;
  }, [gameState.lastAdWatchTime]);

  const canShowFreeUpgradeOption = useMemo(() => {
    const timeSinceAvailable = Date.now() - gameState.lastFreeUpgradeAvailableTime;
    return timeSinceAvailable >= 30000;
  }, [gameState.lastFreeUpgradeAvailableTime]);

  const canWatchFreeUpgradeAd = useMemo(() => {
    const timeSinceFreeUpgrade = Date.now() - gameState.lastFreeUpgradeAdTime;
    const timeSinceForcedAd = Date.now() - gameState.lastForcedAdTime;
    const timeSinceSessionStart = Date.now() - gameState.sessionStartTime;
    
    const canUse = timeSinceFreeUpgrade >= FREE_UPGRADE_AD_COOLDOWN;
    const hasMinGap = Math.min(timeSinceForcedAd, timeSinceFreeUpgrade) >= MIN_AD_GAP;
    const sessionReady = timeSinceSessionStart >= INITIAL_WATCH_AD_DELAY;
    
    return canUse && hasMinGap && sessionReady;
  }, [gameState.lastFreeUpgradeAdTime, gameState.lastForcedAdTime, gameState.sessionStartTime]);

  return useMemo(() => ({
    gameState,
    upgradeBusiness,
    upgradeBusinessWithAd,
    upgradeBusinessOperation,
    hireEmployee,
    upgradeMarketing,
    sellBusiness,
    buyProperty,
    upgradeProperty,
    purchasePropertyCustomization,
    toggleRentProperty,
    sellProperty,
    buyLuxuryItem,
    buyStock,
    sellStock,
    resetGame,
    addBonusCash,
    earnFromTap,
    upgradeTapPower,
    upgradeMultiplier,
    upgradeTapPowerWithAd,
    upgradeMultiplierWithAd,
    prestige,
    purchasePremium,
    takeLoan,
    payLoan,
    checkAllAchievements,
    canWatchAd,
    canShowFreeUpgradeOption,
    canWatchFreeUpgradeAd,
    watchFreeUpgradeAd,
    shouldShowForcedAd,
    closeForcedAd,
    isLoading: loadGameQuery.isLoading,
  }), [
    gameState,
    upgradeBusiness,
    upgradeBusinessWithAd,
    upgradeBusinessOperation,
    hireEmployee,
    upgradeMarketing,
    sellBusiness,
    buyProperty,
    upgradeProperty,
    purchasePropertyCustomization,
    toggleRentProperty,
    sellProperty,
    buyLuxuryItem,
    buyStock,
    sellStock,
    resetGame,
    addBonusCash,
    earnFromTap,
    upgradeTapPower,
    upgradeMultiplier,
    upgradeTapPowerWithAd,
    upgradeMultiplierWithAd,
    prestige,
    purchasePremium,
    takeLoan,
    payLoan,
    checkAllAchievements,
    canWatchAd,
    canShowFreeUpgradeOption,
    canWatchFreeUpgradeAd,
    watchFreeUpgradeAd,
    shouldShowForcedAd,
    closeForcedAd,
    loadGameQuery.isLoading,
  ]);
});
