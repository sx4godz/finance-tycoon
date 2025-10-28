import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, ScrollView, Modal } from "react-native";
import * as Haptics from "expo-haptics";
import { Property, PropertyCustomization } from "@/types/game";
import { ChevronRight, X, Zap, Leaf, Shield, Sparkles, Wrench } from "lucide-react-native";

interface PropertyCardProps {
  property: Property;
  canAfford: boolean;
  onBuy: () => void;
  onUpgrade: () => void;
  onPurchaseCustomization?: (propertyId: string, customizationId: string) => void;
  onToggleRent?: (propertyId: string) => void;
  onSell?: (propertyId: string) => void;
  playerCash?: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${Math.floor(num)}`;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  canAfford,
  onBuy,
  onUpgrade,
  onPurchaseCustomization,
  onToggleRent,
  onSell,
  playerCash = 0,
}) => {
  const [showCustomizations, setShowCustomizations] = useState(false);
  const handleAction = useCallback(() => {
    if (!canAfford) return;

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (property.owned) {
      onUpgrade();
    } else {
      onBuy();
    }
  }, [canAfford, property.owned, onBuy, onUpgrade]);

  const getCategoryColor = () => {
    switch (property.category) {
      case 'residential': return '#10B981';
      case 'commercial': return '#3B82F6';
      case 'luxury': return '#F59E0B';
      case 'exotic': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getCategoryLabel = () => {
    return property.category.charAt(0).toUpperCase() + property.category.slice(1);
  };

  const cost = property.owned 
    ? property.baseCost * Math.pow(1.35, property.level) 
    : property.baseCost;

  const getCategoryIcon = (category: PropertyCustomization['category']) => {
    switch (category) {
      case 'tech': return Zap;
      case 'eco': return Leaf;
      case 'security': return Shield;
      case 'luxury': return Sparkles;
      case 'efficiency': return Wrench;
      default: return Wrench;
    }
  };

  const getIconColor = (category: PropertyCustomization['category']) => {
    switch (category) {
      case 'tech': return '#3B82F6';
      case 'eco': return '#10B981';
      case 'security': return '#EF4444';
      case 'luxury': return '#F59E0B';
      case 'efficiency': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const calculateModifiedStats = () => {
    const unlockedCustomizations = property.customizations.filter(c => c.unlocked);
    
    let maintenanceReduction = 0;
    let incomeBoost = 0;
    let taxReduction = 0;
    let insuranceReduction = 0;
    
    unlockedCustomizations.forEach(c => {
      maintenanceReduction += c.maintenanceReduction || 0;
      incomeBoost += c.incomeBoost || 0;
      taxReduction += c.taxReduction || 0;
      insuranceReduction += c.insuranceReduction || 0;
    });
    
    return {
      maintenanceReduction,
      incomeBoost,
      taxReduction,
      insuranceReduction,
      modifiedIncome: property.incomePerHour * property.level * (1 + incomeBoost),
      modifiedMaintenance: property.maintenanceCostPerHour * (1 - maintenanceReduction),
    };
  };

  const stats = calculateModifiedStats();
  const unlockedCount = property.customizations.filter(c => c.unlocked).length;
  const totalCount = property.customizations.length;

  return (
    <View style={[styles.container, !property.owned && styles.containerLocked]}>
      {property.imageUrl && (
        <Image
          source={{ uri: property.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={styles.name}>{property.name}</Text>
            <View style={styles.categoryBadge}>
              <View style={[styles.categoryDot, { backgroundColor: getCategoryColor() }]} />
              <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
                {getCategoryLabel()}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.level}>
                {property.owned ? `Level ${property.level}` : 'Locked'}
              </Text>
              <Text style={styles.income}>
                {formatNumber(property.incomePerHour * (property.level || 1))}/hr
              </Text>
            </View>
          </View>
        </View>
      </View>

      {property.owned && (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Condition:</Text>
            <Text style={[styles.statValue, { color: property.conditionScore >= 80 ? '#10B981' : property.conditionScore >= 50 ? '#F59E0B' : '#EF4444' }]}>
              {property.conditionScore}%
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Customizations:</Text>
            <Text style={styles.statValue}>{unlockedCount}/{totalCount}</Text>
          </View>
        </View>
      )}

      {property.owned && (
        <TouchableOpacity
          style={styles.customizationsButton}
          onPress={() => setShowCustomizations(true)}
          activeOpacity={0.7}
        >
          <Wrench size={18} color="#3B82F6" />
          <Text style={styles.customizationsButtonText}>Customize Property</Text>
          <ChevronRight size={18} color="#3B82F6" />
        </TouchableOpacity>
      )}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            !canAfford && styles.actionButtonDisabled,
          ]}
          onPress={handleAction}
          disabled={!canAfford}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonCost, !canAfford && styles.buttonCostDisabled]}>
            {formatNumber(cost)}
          </Text>
          <Text style={[styles.buttonLabel, !canAfford && styles.buttonLabelDisabled]}>
            {property.owned ? 'Upgrade' : 'Buy'}
          </Text>
        </TouchableOpacity>

        {property.owned && onToggleRent && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rentButton]}
            onPress={() => onToggleRent(property.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonLabel}>
              {property.rented ? '🏠 Use' : '💰 Rent'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {property.owned && onSell && (
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => onSell(property.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.sellButtonText}>Sell for {formatNumber(property.currentMarketValue)}</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showCustomizations}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCustomizations(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{property.name} - Customizations</Text>
            <TouchableOpacity
              onPress={() => setShowCustomizations(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Income Boost</Text>
              <Text style={styles.statCardValue}>+{(stats.incomeBoost * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Maintenance</Text>
              <Text style={styles.statCardValue}>-{(stats.maintenanceReduction * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Tax Reduction</Text>
              <Text style={styles.statCardValue}>-{(stats.taxReduction * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Insurance</Text>
              <Text style={styles.statCardValue}>-{(stats.insuranceReduction * 100).toFixed(0)}%</Text>
            </View>
          </View>

          <ScrollView style={styles.customizationsList}>
            {property.customizations.map((customization) => {
              const Icon = getCategoryIcon(customization.category);
              const iconColor = getIconColor(customization.category);
              const canPurchase = !customization.unlocked && playerCash >= customization.cost;

              return (
                <View
                  key={customization.id}
                  style={[
                    styles.customizationCard,
                    customization.unlocked && styles.customizationCardUnlocked,
                  ]}
                >
                  <View style={styles.customizationHeader}>
                    <View style={[styles.customizationIcon, { backgroundColor: iconColor + '20' }]}>
                      <Icon size={20} color={iconColor} />
                    </View>
                    <View style={styles.customizationInfo}>
                      <Text style={styles.customizationName}>{customization.name}</Text>
                      <Text style={styles.customizationDescription}>{customization.description}</Text>
                    </View>
                  </View>

                  <View style={styles.customizationBenefits}>
                    {customization.incomeBoost && (
                      <Text style={styles.benefitText}>+{(customization.incomeBoost * 100).toFixed(0)}% Income</Text>
                    )}
                    {customization.maintenanceReduction && (
                      <Text style={styles.benefitText}>-{(customization.maintenanceReduction * 100).toFixed(0)}% Maintenance</Text>
                    )}
                    {customization.taxReduction && (
                      <Text style={styles.benefitText}>-{(customization.taxReduction * 100).toFixed(0)}% Tax</Text>
                    )}
                    {customization.insuranceReduction && (
                      <Text style={styles.benefitText}>-{(customization.insuranceReduction * 100).toFixed(0)}% Insurance</Text>
                    )}
                    {customization.valueBoost && (
                      <Text style={styles.benefitText}>+{(customization.valueBoost * 100).toFixed(0)}% Value</Text>
                    )}
                  </View>

                  {customization.unlocked ? (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>✓ Installed</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.purchaseButton,
                        !canPurchase && styles.purchaseButtonDisabled,
                      ]}
                      onPress={() => {
                        if (canPurchase && onPurchaseCustomization) {
                          onPurchaseCustomization(property.id, customization.id);
                          if (Platform.OS !== 'web') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          }
                        }
                      }}
                      disabled={!canPurchase}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.purchaseButtonText,
                        !canPurchase && styles.purchaseButtonTextDisabled,
                      ]}>
                        {formatNumber(customization.cost)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  image: {
    width: "100%",
    height: 180,
  },
  containerLocked: {
    opacity: 0.6,
  },
  content: {
    padding: 16,
  },
  header: {
    gap: 8,
  },
  info: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  level: {
    fontSize: 13,
    color: "#6B7280",
  },
  income: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#10B981",
  },
  actionButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  buttonCost: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  buttonCostDisabled: {
    color: "#9CA3AF",
  },
  buttonLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 2,
  },
  buttonLabelDisabled: {
    color: "#9CA3AF",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  statRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  customizationsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  customizationsButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#3B82F6",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  rentButton: {
    flex: 0.4,
    backgroundColor: "#10B981",
  },
  sellButton: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  sellButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#92400E",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statCardLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  customizationsList: {
    flex: 1,
    padding: 16,
  },
  customizationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  customizationCardUnlocked: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  customizationHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  customizationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  customizationInfo: {
    flex: 1,
  },
  customizationName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 4,
  },
  customizationDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  customizationBenefits: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#10B981",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlockedBadge: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  unlockedText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  purchaseButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  purchaseButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  purchaseButtonTextDisabled: {
    color: "#9CA3AF",
  },
});
