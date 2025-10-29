import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Video, TrendingDown, Users, Wrench, Zap } from "lucide-react-native";
import { Business } from "@/types/game";
import {
  COST_MULTIPLIER,
  REVENUE_MULTIPLIER,
  AUTO_GENERATE_LEVEL,
  SECONDS_PER_HOUR,
} from "@/constants/businesses";

interface BusinessCardProps {
  business: Business;
  canAfford: boolean;
  onUpgrade: () => void;
  onSell?: () => void;
  onUpgradeOperation?: (businessId: string, upgradeId: string) => void;
  onHireEmployee?: (businessId: string) => void;
  onUpgradeMarketing?: (businessId: string) => void;
  canWatchFreeAd?: boolean;
  onWatchFreeAd?: () => void;
  playerCash?: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${Math.floor(num)}`;
};

const calculateUpgradeCost = (baseCost: number, level: number): number => {
  return Math.floor(baseCost * Math.pow(COST_MULTIPLIER, level));
};

const calculateRevenue = (baseRevenue: number, level: number): number => {
  if (level === 0) return 0;
  return Math.floor(baseRevenue * Math.pow(REVENUE_MULTIPLIER, level - 1));
};

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  canAfford,
  onUpgrade,
  onSell,
  onUpgradeOperation,
  onHireEmployee,
  onUpgradeMarketing,
  canWatchFreeAd = false,
  onWatchFreeAd,
  playerCash = 0,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleUpgrade = useCallback(() => {
    if (!canAfford) return;

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onUpgrade();
  }, [canAfford, onUpgrade]);

  const upgradeCost = business.owned
    ? calculateUpgradeCost(business.baseCost, business.level)
    : business.baseCost;

  const revenue = business.owned
    ? calculateRevenue(business.baseRevenue, business.level)
    : business.baseRevenue;

  const baseDepreciation = 0.75;
  const upgradesValue = business.upgrades.filter(u => u.unlocked).length * 0.05;
  const levelBonus = Math.min(business.level * 0.01, 0.15);
  const totalRetention = Math.min(baseDepreciation + upgradesValue + levelBonus, 0.95);
  const saleValue = business.owned ? Math.floor(business.totalInvested * totalRetention) : 0;

  const handleSell = useCallback(() => {
    if (!business.owned || !onSell) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    onSell();
  }, [business.owned, onSell]);

  const handleFreeAdPress = useCallback(() => {
    if (!canWatchFreeAd || !onWatchFreeAd) return;

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onWatchFreeAd();
  }, [canWatchFreeAd, onWatchFreeAd]);

  return (
    <View style={styles.container}>
      {canWatchFreeAd && !canAfford && onWatchFreeAd && business.owned && (
        <View style={styles.adOverlay}>
          <TouchableOpacity
            style={styles.adOverlayButton}
            onPress={handleFreeAdPress}
            activeOpacity={0.8}
          >
            <Video size={32} color="#FFFFFF" />
            <Text style={styles.adOverlayText}>Watch Ad for Free Upgrade</Text>
          </TouchableOpacity>
        </View>
      )}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] },
          !business.owned && styles.cardLocked,
          canWatchFreeAd && !canAfford && styles.cardWithAdOverlay,
        ]}
      >
        {business.imageUrl && (
          <Image
            source={{ uri: business.imageUrl }}
            style={styles.businessImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.tapArea}>
          <View style={styles.leftSection}>
            {!business.imageUrl && (
              <Text style={styles.icon}>{business.icon}</Text>
            )}
            <View style={styles.info}>
              <Text style={styles.name}>{business.name}</Text>
              <Text style={styles.level}>
                {business.owned ? `Level ${business.level}` : "Locked"}
              </Text>
              {business.owned && (
                <>
                  <Text style={styles.revenue}>
                    Revenue: {formatNumber(business.revenuePerHour / SECONDS_PER_HOUR)}/s
                  </Text>
                  {business.autoGenerate && (
                    <>
                      <Text style={styles.costs}>
                        Costs: -{formatNumber(business.runningCostsPerHour / SECONDS_PER_HOUR)}/s
                      </Text>
                      <Text style={[
                        styles.netIncome,
                        business.netIncomePerHour < 0 && styles.netIncomeLoss
                      ]}>
                        Net: {business.netIncomePerHour >= 0 ? '+' : ''}{formatNumber(business.netIncomePerHour / SECONDS_PER_HOUR)}/s
                      </Text>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
          {business.owned && (
            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={() => setShowDetails(!showDetails)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails ? "Hide" : "Details"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {business.owned && showDetails && (
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Employees</Text>
                <Text style={styles.detailValue}>{business.employees}/{business.maxEmployees}</Text>
              </View>
              <View style={styles.detailItem}>
                <Wrench size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Maintenance</Text>
                <Text style={styles.detailValue}>
                  {formatNumber(business.maintenanceCostPerHour / SECONDS_PER_HOUR)}/s
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Zap size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Employee Cost</Text>
                <Text style={styles.detailValue}>
                  {formatNumber(business.employeeSalaryPerHour / SECONDS_PER_HOUR)}/s
                </Text>
              </View>
              <View style={styles.detailItem}>
                <TrendingDown size={16} color="#6B7280" />
                <Text style={styles.detailLabel}>Utilities</Text>
                <Text style={styles.detailValue}>
                  {formatNumber(business.utilitiesCostPerHour / SECONDS_PER_HOUR)}/s
                </Text>
              </View>
            </View>
            
            {business.maxEmployees > 0 && business.employees < business.maxEmployees && onHireEmployee && (
              <TouchableOpacity
                style={[
                  styles.manageButton,
                  playerCash < business.baseCost * 0.1 && styles.manageButtonDisabled,
                ]}
                onPress={() => onHireEmployee(business.id)}
                disabled={playerCash < business.baseCost * 0.1}
                activeOpacity={0.7}
              >
                <Users size={14} color="#FFFFFF" />
                <Text style={styles.manageButtonText}>
                  Hire Employee ({formatNumber(business.baseCost * 0.1)})
                </Text>
              </TouchableOpacity>
            )}
            
            {onUpgradeMarketing && (
              <TouchableOpacity
                style={[
                  styles.manageButton,
                  styles.marketingButton,
                  playerCash < business.baseCost * (0.2 + business.marketingLevel * 0.15) && styles.manageButtonDisabled,
                ]}
                onPress={() => onUpgradeMarketing(business.id)}
                disabled={playerCash < business.baseCost * (0.2 + business.marketingLevel * 0.15)}
                activeOpacity={0.7}
              >
                <TrendingDown size={14} color="#FFFFFF" />
                <Text style={styles.manageButtonText}>
                  Upgrade Marketing Lv.{business.marketingLevel} ({formatNumber(business.baseCost * (0.2 + business.marketingLevel * 0.15))})
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.upgradesSection}>
              <Text style={styles.upgradesTitle}>Business Upgrades</Text>
              {business.upgrades.map((upgrade) => (
                <View
                  key={upgrade.id}
                  style={[
                    styles.upgradeItem,
                    upgrade.unlocked && styles.upgradeItemUnlocked,
                  ]}
                >
                  <View style={styles.upgradeInfo}>
                    <Text style={[
                      styles.upgradeName,
                      upgrade.unlocked && styles.upgradeNameUnlocked,
                    ]}>
                      {upgrade.name}
                    </Text>
                    <Text style={styles.upgradeDescription}>{upgrade.description}</Text>
                  </View>
                  {upgrade.unlocked ? (
                    <View style={styles.upgradeUnlockedBadge}>
                      <Text style={styles.upgradeUnlockedText}>✓</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.businessUpgradeButton,
                        (playerCash < upgrade.cost) && styles.businessUpgradeButtonDisabled,
                      ]}
                      onPress={() => {
                        if (onUpgradeOperation && playerCash >= upgrade.cost) {
                          onUpgradeOperation(business.id, upgrade.id);
                          if (Platform.OS !== 'web') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          }
                        }
                      }}
                      disabled={playerCash < upgrade.cost}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.businessUpgradeButtonText,
                        (playerCash < upgrade.cost) && styles.businessUpgradeButtonTextDisabled,
                      ]}>
                        {formatNumber(upgrade.cost)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.upgradeButton,
              !canAfford && styles.upgradeButtonDisabled,
              business.owned && onSell && styles.upgradeButtonHalf,
            ]}
            onPress={handleUpgrade}
            disabled={!canAfford}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.upgradeCost, !canAfford && styles.upgradeCostDisabled]}
            >
              {formatNumber(upgradeCost)}
            </Text>
            <Text
              style={[
                styles.upgradeLabel,
                !canAfford && styles.upgradeLabelDisabled,
              ]}
            >
              {business.owned ? "Upgrade" : "Buy"}
            </Text>
            {business.level === AUTO_GENERATE_LEVEL - 1 && business.owned && (
              <Text style={styles.autoLabel}>Next: Auto</Text>
            )}
          </TouchableOpacity>
          {business.owned && onSell && (
            <TouchableOpacity
              style={styles.sellButton}
              onPress={handleSell}
              activeOpacity={0.7}
            >
              <Text style={styles.sellCost}>{formatNumber(saleValue)}</Text>
              <Text style={styles.sellLabel}>Sell</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative" as const,
  },
  adOverlay: {
    position: "absolute" as const,
    top: 8,
    left: 16,
    right: 16,
    bottom: 8,
    backgroundColor: "rgba(16, 185, 129, 0.95)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  adOverlayButton: {
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  adOverlayText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textAlign: "center" as const,
  },
  cardWithAdOverlay: {
    opacity: 0.3,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  businessImage: {
    width: "100%",
    height: 180,
  },
  cardLocked: {
    opacity: 0.6,
  },
  tapArea: {
    padding: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 40,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#1A1A1A",
  },
  level: {
    fontSize: 14,
    color: "#666666",
  },
  revenue: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#10B981",
  },
  costs: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#EF4444",
  },
  netIncome: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#059669",
  },
  netIncomeLoss: {
    color: "#DC2626",
  },
  detailsToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  detailsToggleText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  detailsSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  detailLabel: {
    flex: 1,
    fontSize: 10,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  actionRow: {
    flexDirection: "row" as const,
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderRadius: 10,
  },
  upgradeButtonHalf: {
    flex: 1,
  },
  upgradeButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  upgradeCost: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  upgradeCostDisabled: {
    color: "#9CA3AF",
  },
  upgradeLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 2,
  },
  upgradeLabelDisabled: {
    color: "#9CA3AF",
  },
  autoLabel: {
    fontSize: 10,
    color: "#FCD34D",
    marginTop: 4,
    fontWeight: "600" as const,
  },
  sellButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderRadius: 10,
  },
  sellCost: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  sellLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 2,
  },
  manageButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  marketingButton: {
    backgroundColor: "#8B5CF6",
  },
  manageButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  manageButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  upgradesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  upgradesTitle: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase" as const,
  },
  upgradeItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  upgradeItemUnlocked: {
    backgroundColor: "#F0FDF4",
    borderColor: "#10B981",
  },
  upgradeInfo: {
    flex: 1,
    marginRight: 8,
  },
  upgradeName: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 2,
  },
  upgradeNameUnlocked: {
    color: "#10B981",
  },
  upgradeDescription: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  businessUpgradeButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  businessUpgradeButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  businessUpgradeButtonText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  businessUpgradeButtonTextDisabled: {
    color: "#9CA3AF",
  },
  upgradeUnlockedBadge: {
    backgroundColor: "#10B981",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  upgradeUnlockedText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700" as const,
  },
});
