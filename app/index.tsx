import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Settings, TrendingUp, Trophy, Sparkles, CreditCard, Building2, Home, Crown, LineChart, Lock, X } from "lucide-react-native";
import { useGame } from "@/contexts/GameContext";
import { BusinessCard } from "@/components/BusinessCard";
import { PropertyCard } from "@/components/PropertyCard";
import { LuxuryItemCard } from "@/components/LuxuryItemCard";
import { StockCard } from "@/components/StockCard";
import { FloatingCash } from "@/components/FloatingCash";
import { TapButton } from "@/components/TapButton";
import { UpgradeCard } from "@/components/UpgradeCard";
import { AdBanner } from "@/components/AdBanner";
import {
  TAP_COST_MULTIPLIER,
  MULTIPLIER_COST_MULTIPLIER,
  PRESTIGE_REQUIREMENT,
} from "@/constants/upgrades";
import { TRADING_UNLOCK_THRESHOLD } from "@/constants/stocks";

interface FloatingCashItem {
  id: string;
  amount: string;
  x: number;
  y: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${Math.floor(num)}`;
};

type TabType = "card" | "businesses" | "properties" | "luxury" | "trading" | "upgrades";

export default function GameScreen() {
  const {
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
    earnFromTap,
    upgradeTapPower,
    upgradeMultiplier,
    upgradeTapPowerWithAd,
    upgradeMultiplierWithAd,
    addBonusCash,
    prestige,
    canWatchAd,
    canShowFreeUpgradeOption,
    canWatchFreeUpgradeAd,
    shouldShowForcedAd,
    closeForcedAd,
    isLoading,
  } = useGame();
  const [floatingCash, setFloatingCash] = useState<FloatingCashItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("card");
  const [freeCashCountdown, setFreeCashCountdown] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, 300000 - (Date.now() - gameState.lastAdWatchTime));
      setFreeCashCountdown(Math.ceil(timeLeft / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.lastAdWatchTime]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 0);
  }, []);

  const handleTap = useCallback(() => {
    const totalMultiplier = gameState.multipliers.reduce((acc, mult) => {
      return mult.level > 0 ? acc * Math.pow(mult.multiplierValue, mult.level) : acc;
    }, 1);

    const luxuryBonus = gameState.luxuryItems.reduce((total, item) => {
      return item.owned ? total + item.multiplierBonus : total;
    }, 0);

    const premiumBonus = gameState.isPremium ? 1 : 0;

    const baseEarnings = gameState.tapPower.level *
        gameState.tapPower.multiplier *
        totalMultiplier *
        gameState.prestigeMultiplier *
        (1 + luxuryBonus + premiumBonus);
    const earnings = Math.max(1, Math.floor(baseEarnings));

    const x = Math.random() * 200 + 100;
    const y = 400;

    setFloatingCash((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        amount: formatNumber(earnings),
        x,
        y,
      },
    ]);

    earnFromTap();
  }, [earnFromTap, gameState.tapPower, gameState.multipliers, gameState.prestigeMultiplier, gameState.luxuryItems, gameState.isPremium]);



  const handleUpgrade = useCallback(
    (businessId: string) => {
      upgradeBusiness(businessId);
    },
    [upgradeBusiness]
  );

  const handleSellBusiness = useCallback(
    (businessId: string) => {
      const business = gameState.businesses.find((b) => b.id === businessId);
      if (!business || !business.owned) return;

      const saleValue = Math.floor(business.purchasePrice * 0.65);

      if (Platform.OS === "web") {
        const confirmed = window.confirm(
          `Sell ${business.name} for ${formatNumber(saleValue)}? This cannot be undone.`
        );
        if (confirmed) {
          sellBusiness(businessId);
        }
      } else {
        Alert.alert(
          "Sell Business",
          `Sell ${business.name} for ${formatNumber(saleValue)}? This cannot be undone.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sell",
              style: "destructive",
              onPress: () => {
                sellBusiness(businessId);
              },
            },
          ]
        );
      }
    },
    [gameState.businesses, sellBusiness]
  );

  const removeFloatingCash = useCallback((id: string) => {
    setFloatingCash((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleWatchRewardedAd = useCallback(() => {
    if (!canWatchAd) {
      if (Platform.OS === "web") {
        alert("Please wait before watching another ad!");
      } else {
        Alert.alert("Wait", "Please wait before watching another ad!");
      }
      return;
    }

    const totalMultiplier = gameState.multipliers.reduce((acc, mult) => {
      return mult.level > 0 ? acc * Math.pow(mult.multiplierValue, mult.level) : acc;
    }, 1);
    const baseTapEarnings = gameState.tapPower.level * gameState.tapPower.multiplier * totalMultiplier * gameState.prestigeMultiplier;
    const scaledBonus = Math.max(5000, Math.floor(baseTapEarnings * 1000));
    const bonusMultiplier = Math.max(1, gameState.prestigeLevel);
    const bonusAmount = scaledBonus * bonusMultiplier;

    if (gameState.isPremium) {
      addBonusCash(bonusAmount);
      if (Platform.OS === "web") {
        alert(`Premium Bonus! You earned ${formatNumber(bonusAmount)}!`);
      } else {
        Alert.alert("Premium Bonus!", `You earned ${formatNumber(bonusAmount)} instantly!`);
      }
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Watch a rewarded ad to earn ${formatNumber(bonusAmount)} bonus cash?`
      );
      if (confirmed) {
        addBonusCash(bonusAmount);
        alert(`You earned ${formatNumber(bonusAmount)}!`);
      }
    } else {
      Alert.alert(
        "Watch Ad",
        `Watch a rewarded ad to earn ${formatNumber(bonusAmount)} bonus cash?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Watch",
            onPress: () => {
              addBonusCash(bonusAmount);
              Alert.alert("Success!", `You earned ${formatNumber(bonusAmount)} bonus cash!`);
            },
          },
        ]
      );
    }
  }, [addBonusCash, gameState.prestigeLevel, gameState.isPremium, gameState.multipliers, gameState.prestigeMultiplier, gameState.tapPower.level, gameState.tapPower.multiplier, canWatchAd]);

  const handlePrestige = useCallback(() => {
    if (gameState.totalEarnings < PRESTIGE_REQUIREMENT) {
      if (Platform.OS === "web") {
        alert(`You need to earn ${formatNumber(PRESTIGE_REQUIREMENT)} to prestige!`);
      } else {
        Alert.alert(
          "Not Ready",
          `You need to earn ${formatNumber(PRESTIGE_REQUIREMENT)} to prestige!`
        );
      }
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Prestige will reset your progress but give you a permanent 15% multiplier. Continue?"
      );
      if (confirmed) {
        prestige();
      }
    } else {
      Alert.alert(
        "Prestige",
        "Prestige will reset your progress but give you a permanent 15% multiplier. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Prestige",
            style: "destructive",
            onPress: () => {
              prestige();
            },
          },
        ]
      );
    }
  }, [gameState.totalEarnings, prestige]);

  const getTapUpgradeCost = () => {
    return Math.floor(
      gameState.tapPower.baseCost *
        Math.pow(TAP_COST_MULTIPLIER, gameState.tapPower.level - 1)
    );
  };

  const getMultiplierCost = (multiplier: typeof gameState.multipliers[0]) => {
    return Math.floor(
      multiplier.baseCost * Math.pow(MULTIPLIER_COST_MULTIPLIER, multiplier.level)
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const revenuePerSecond = gameState.businesses.reduce((sum, b) => {
    return b.autoGenerate && b.owned ? sum + (b.netIncomePerHour / 3600) : sum;
  }, 0);

  const propertyIncomePerHour = gameState.properties.reduce((sum, p) => {
    return p.owned ? sum + p.incomePerHour * p.level : sum;
  }, 0);

  const totalIncomePerSecond = revenuePerSecond + (propertyIncomePerHour / 3600);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <LinearGradient
          colors={["#1E3A8A", "#1E40AF", "#3B82F6"]}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TrendingUp color="#60A5FA" size={28} />
              <View>
                <Text style={styles.headerTitle}>Finance Empire</Text>
                {gameState.prestigeLevel > 0 && (
                  <View style={styles.prestigeBadge}>
                    <Sparkles size={12} color="#FBBF24" />
                    <Text style={styles.prestigeText}>
                      Prestige Lv.{gameState.prestigeLevel}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push("/settings")}
            >
              <Settings color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.cashContainer}>
            <Text style={styles.cashAmount}>{formatNumber(gameState.cash)}</Text>
            {totalIncomePerSecond > 0 && (
              <Text style={styles.cashRate}>
                +{formatNumber(totalIncomePerSecond)}/s
              </Text>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {formatNumber(gameState.totalEarnings)}
              </Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{gameState.lifetimeTaps}</Text>
              <Text style={styles.statLabel}>Swipes</Text>
            </View>
            <TouchableOpacity style={styles.stat} onPress={handlePrestige}>
              <Trophy
                color={
                  gameState.totalEarnings >= PRESTIGE_REQUIREMENT
                    ? "#FBBF24"
                    : "#94A3B8"
                }
                size={20}
              />
              <Text
                style={[
                  styles.statLabel,
                  gameState.totalEarnings >= PRESTIGE_REQUIREMENT &&
                    styles.statLabelActive,
                ]}
              >
                Prestige
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabBarScroll}
            contentContainerStyle={styles.tabBar}
          >
            <TouchableOpacity
              style={[styles.tab, activeTab === "card" && styles.tabActive]}
              onPress={() => handleTabChange("card")}
            >
              <CreditCard size={20} color={activeTab === "card" ? "#1E40AF" : "#FFFFFF"} />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "card" && styles.tabTextActive,
                ]}
              >
                Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "businesses" && styles.tabActive]}
              onPress={() => handleTabChange("businesses")}
            >
              <Building2 size={20} color={activeTab === "businesses" ? "#1E40AF" : "#FFFFFF"} />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "businesses" && styles.tabTextActive,
                ]}
              >
                Businesses
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "properties" && styles.tabActive]}
              onPress={() => handleTabChange("properties")}
            >
              <Home size={20} color={activeTab === "properties" ? "#1E40AF" : "#FFFFFF"} />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "properties" && styles.tabTextActive,
                ]}
              >
                Properties
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "luxury" && styles.tabActive]}
              onPress={() => handleTabChange("luxury")}
            >
              <Crown size={20} color={activeTab === "luxury" ? "#1E40AF" : "#FFFFFF"} />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "luxury" && styles.tabTextActive,
                ]}
              >
                Luxury
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "trading" && styles.tabActive, !gameState.tradingUnlocked && styles.tabLocked]}
              onPress={() => gameState.tradingUnlocked ? handleTabChange("trading") : handleTabChange("trading")}
            >
              {!gameState.tradingUnlocked && <Lock size={16} color="#FFFFFF" />}
              <LineChart size={20} color={activeTab === "trading" ? "#1E40AF" : "#FFFFFF"} />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "trading" && styles.tabTextActive,
                ]}
              >
                Trading
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "upgrades" && styles.tabActive]}
              onPress={() => handleTabChange("upgrades")}
            >
              <Sparkles size={20} color={activeTab === "upgrades" ? "#1E40AF" : "#FFFFFF"} />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "upgrades" && styles.tabTextActive,
                ]}
              >
                Upgrades
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "card" && (
            <>
              <TapButton
                tapPower={Math.max(1, Math.floor(
                  gameState.tapPower.level *
                    gameState.tapPower.multiplier *
                    gameState.multipliers.reduce((acc, mult) => {
                      return mult.level > 0
                        ? acc * Math.pow(mult.multiplierValue, mult.level)
                        : acc;
                    }, 1) *
                    gameState.prestigeMultiplier *
                    (1 + gameState.luxuryItems.reduce((total, item) => {
                      return item.owned ? total + item.multiplierBonus : total;
                    }, 0) + (gameState.isPremium ? 1 : 0))
                ))}
                onTap={handleTap}
              />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Boosts</Text>
                <UpgradeCard
                  title="Credit Limit"
                  description={`Level ${gameState.tapPower.level} → ${gameState.tapPower.level + 1}`}
                  level={gameState.tapPower.level}
                  cost={getTapUpgradeCost()}
                  canAfford={gameState.cash >= getTapUpgradeCost()}
                  onUpgrade={upgradeTapPower}
                  type="tap"
                  icon="credit-card"
                  canWatchFreeAd={canShowFreeUpgradeOption && canWatchFreeUpgradeAd && gameState.cash < getTapUpgradeCost()}
                  onWatchFreeAd={() => {
                    if (gameState.isPremium) {
                      upgradeTapPowerWithAd();
                    } else {
                      if (Platform.OS === "web") {
                        const confirmed = window.confirm("Watch an ad to get this upgrade for free?");
                        if (confirmed) {
                          upgradeTapPowerWithAd();
                        }
                      } else {
                        Alert.alert(
                          "Free Upgrade",
                          "Watch an ad to get this upgrade for free?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Watch",
                              onPress: () => {
                                upgradeTapPowerWithAd();
                              },
                            },
                          ]
                        );
                      }
                    }
                  }}
                />
                <UpgradeCard
                  title={gameState.isPremium ? "Premium Bonus Cash" : "Watch Ad for Cash"}
                  description={
                    canWatchAd 
                      ? `${gameState.isPremium ? "Instant: " : ""}Get ${formatNumber(
                          Math.max(5000, Math.floor(
                            gameState.tapPower.level * 
                            gameState.tapPower.multiplier * 
                            gameState.multipliers.reduce((acc, mult) => {
                              return mult.level > 0 ? acc * Math.pow(mult.multiplierValue, mult.level) : acc;
                            }, 1) * 
                            gameState.prestigeMultiplier * 1000
                          )) * Math.max(1, gameState.prestigeLevel)
                        )} bonus cash` 
                      : `Next in ${Math.floor(freeCashCountdown / 60)}:${String(freeCashCountdown % 60).padStart(2, '0')}`
                  }
                  level={0}
                  cost={0}
                  canAfford={canWatchAd}
                  onUpgrade={handleWatchRewardedAd}
                  type="ad"
                  icon={gameState.isPremium ? "crown" : "video"}
                />
              </View>
            </>
          )}

          {activeTab === "businesses" && (
            <View style={styles.businessesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Financial Businesses</Text>
                <Text style={styles.sectionSubtitle}>
                  Passive income generators - {formatNumber(revenuePerSecond)}/s
                </Text>
              </View>
              {gameState.businesses.map((business) => {
                const upgradeCost = business.owned
                  ? business.baseCost * Math.pow(1.45, business.level)
                  : business.baseCost;
                const canAfford = gameState.cash >= upgradeCost;
                
                return (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    canAfford={canAfford}
                    onUpgrade={() => handleUpgrade(business.id)}
                    onSell={() => handleSellBusiness(business.id)}
                    onUpgradeOperation={upgradeBusinessOperation}
                    onHireEmployee={hireEmployee}
                    onUpgradeMarketing={upgradeMarketing}
                    playerCash={gameState.cash}
                    canWatchFreeAd={canShowFreeUpgradeOption && canWatchFreeUpgradeAd && !canAfford && business.owned}
                    onWatchFreeAd={() => {
                      if (gameState.isPremium) {
                        upgradeBusinessWithAd(business.id);
                      } else {
                        if (Platform.OS === "web") {
                          const confirmed = window.confirm("Watch an ad to get this upgrade for free?");
                          if (confirmed) {
                            upgradeBusinessWithAd(business.id);
                          }
                        } else {
                          Alert.alert(
                            "Free Upgrade",
                            "Watch an ad to get this upgrade for free?",
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Watch",
                                onPress: () => {
                                  upgradeBusinessWithAd(business.id);
                                },
                              },
                            ]
                          );
                        }
                      }
                    }}
                  />
                );
              })}
            </View>
          )}

          {activeTab === "properties" && (
            <View style={styles.propertiesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Real Estate Portfolio</Text>
                <Text style={styles.sectionSubtitle}>
                  Generating {formatNumber(propertyIncomePerHour)}/hr
                </Text>
              </View>
              {gameState.properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  canAfford={
                    gameState.cash >=
                    (property.owned
                      ? property.baseCost * Math.pow(1.35, property.level)
                      : property.baseCost)
                  }
                  onBuy={() => buyProperty(property.id)}
                  onUpgrade={() => upgradeProperty(property.id)}
                  onPurchaseCustomization={purchasePropertyCustomization}
                  onToggleRent={toggleRentProperty}
                  onSell={sellProperty}
                  playerCash={gameState.cash}
                />
              ))}
            </View>
          )}

          {activeTab === "luxury" && (
            <View style={styles.luxuryContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Luxury Collection</Text>
                <Text style={styles.sectionSubtitle}>
                  Total Bonus: +{(gameState.luxuryItems.reduce((total, item) => {
                    return item.owned ? total + item.multiplierBonus : total;
                  }, 0) * 100).toFixed(0)}%
                </Text>
              </View>
              {gameState.luxuryItems.map((item) => (
                <LuxuryItemCard
                  key={item.id}
                  item={item}
                  canAfford={gameState.cash >= item.cost}
                  onBuy={() => buyLuxuryItem(item.id)}
                />
              ))}
            </View>
          )}

          {activeTab === "trading" && (
            <View style={styles.tradingContainer}>
              {!gameState.tradingUnlocked && (
                <View style={styles.lockedOverlay}>
                  <View style={styles.lockedOverlayContent}>
                    <Lock size={64} color="#1E40AF" />
                    <Text style={styles.lockedOverlayTitle}>Trading Locked</Text>
                    <Text style={styles.lockedOverlayDescription}>
                      Reach {formatNumber(TRADING_UNLOCK_THRESHOLD)} total earnings to unlock!
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { width: `${Math.min((gameState.totalEarnings / TRADING_UNLOCK_THRESHOLD) * 100, 100)}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.lockedProgress}>
                      {formatNumber(gameState.totalEarnings)} / {formatNumber(TRADING_UNLOCK_THRESHOLD)}
                    </Text>
                  </View>
                </View>
              )}
              <View style={[styles.tradingContent, !gameState.tradingUnlocked && styles.blurredContent]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Stock Market</Text>
                  <Text style={styles.sectionSubtitle}>
                    Prices update every 5 seconds
                  </Text>
                </View>
                <View style={styles.warningBanner}>
                  <Text style={styles.warningText}>
                    ⚠️ High risk: Prices are volatile and unpredictable!
                  </Text>
                </View>
                {gameState.stocks.map((stock) => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    cash={gameState.cash}
                    onBuy={(shares) => buyStock(stock.id, shares)}
                    onSell={(shares) => sellStock(stock.id, shares)}
                  />
                ))}
              </View>
            </View>
          )}

          {activeTab === "upgrades" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Income Multipliers</Text>
              {gameState.multipliers.map((multiplier) => (
                <UpgradeCard
                  key={multiplier.id}
                  title={multiplier.name}
                  description={multiplier.description}
                  level={multiplier.level}
                  cost={getMultiplierCost(multiplier)}
                  canAfford={gameState.cash >= getMultiplierCost(multiplier)}
                  onUpgrade={() => upgradeMultiplier(multiplier.id)}
                  type="multiplier"
                  icon="sparkles"
                  imageUrl={multiplier.imageUrl}
                  canWatchFreeAd={false}
                  onWatchFreeAd={() => {
                    if (gameState.isPremium) {
                      upgradeMultiplierWithAd(multiplier.id);
                    } else {
                      if (Platform.OS === "web") {
                        const confirmed = window.confirm("Watch an ad to get this upgrade for free?");
                        if (confirmed) {
                          upgradeMultiplierWithAd(multiplier.id);
                        }
                      } else {
                        Alert.alert(
                          "Free Upgrade",
                          "Watch an ad to get this upgrade for free?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Watch",
                              onPress: () => {
                                upgradeMultiplierWithAd(multiplier.id);
                              },
                            },
                          ]
                        );
                      }
                    }
                  }}
                />
              ))}

              <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
                Achievements
              </Text>
              {gameState.achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    achievement.unlocked && styles.achievementUnlocked,
                  ]}
                >
                  <Trophy
                    color={achievement.unlocked ? "#FBBF24" : "#9CA3AF"}
                    size={24}
                  />
                  <View style={styles.achievementContent}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        achievement.unlocked && styles.achievementTitleUnlocked,
                      ]}
                    >
                      {achievement.name}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.achievementReward,
                      achievement.unlocked && styles.achievementRewardUnlocked,
                    ]}
                  >
                    {achievement.unlocked ? "✓" : formatNumber(achievement.reward)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <AdBanner />
        </ScrollView>

        {floatingCash.map((item) => (
          <FloatingCash
            key={item.id}
            amount={item.amount}
            x={item.x}
            y={item.y}
            onComplete={() => removeFloatingCash(item.id)}
          />
        ))}

        <Modal
          visible={shouldShowForcedAd}
          animationType="fade"
          transparent
          onRequestClose={closeForcedAd}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeForcedAd}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Ad Break</Text>
              <View style={styles.adPlaceholder}>
                <Text style={styles.adPlaceholderText}>
                  {gameState.isPremium ? "Premium members see no ads!" : "Simulated Ad (3 seconds)"}
                </Text>
              </View>
              <Text style={styles.modalSubtext}>
                {gameState.isPremium 
                  ? "Thank you for supporting the game!" 
                  : "Ads help keep the game free for everyone"}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeForcedAd}
              >
                <Text style={styles.modalButtonText}>Continue Playing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    fontSize: 18,
    color: "#666666",
  },
  header: {
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  prestigeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  prestigeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FBBF24",
  },
  settingsButton: {
    padding: 8,
  },
  cashContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  cashAmount: {
    fontSize: 48,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cashRate: {
    fontSize: 16,
    color: "#10B981",
    marginTop: 4,
    fontWeight: "700" as const,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    color: "#94A3B8",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  statLabelActive: {
    color: "#FBBF24",
  },
  tabBarScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
  },
  tabLocked: {
    opacity: 0.6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  tabTextActive: {
    color: "#1E40AF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 100,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#6B7280",
    marginHorizontal: 16,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#10B981",
    marginTop: 4,
  },
  businessesContainer: {
    gap: 0,
  },
  propertiesContainer: {
    gap: 0,
  },
  luxuryContainer: {
    gap: 0,
  },
  tradingContainer: {
    position: "relative" as const,
    minHeight: 600,
  },
  tradingContent: {
    gap: 0,
  },
  blurredContent: {
    opacity: 0.3,
  },
  lockedOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    paddingHorizontal: 20,
  },
  lockedOverlayContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    maxWidth: 400,
    width: "100%",
  },
  lockedOverlayTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 12,
  },
  lockedOverlayDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center" as const,
    marginBottom: 24,
    lineHeight: 24,
  },
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  lockedDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center" as const,
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  progressBarContainer: {
    width: "80%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  lockedProgress: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#3B82F6",
    marginBottom: 12,
  },
  lockedHint: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center" as const,
    fontStyle: "italic" as const,
  },
  warningBanner: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  warningText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#92400E",
  },
  achievementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    opacity: 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: "#FEF3C7",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  achievementTitleUnlocked: {
    color: "#1A1A1A",
  },
  achievementDescription: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  achievementReward: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#D1D5DB",
  },
  achievementRewardUnlocked: {
    fontSize: 20,
    color: "#10B981",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute" as const,
    top: 16,
    right: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#1F2937",
    marginBottom: 20,
  },
  adPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed" as const,
  },
  adPlaceholderText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600" as const,
  },
  modalSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center" as const,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textAlign: "center" as const,
  },
});
