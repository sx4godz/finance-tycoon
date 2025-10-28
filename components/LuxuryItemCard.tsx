import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LuxuryItem } from "@/types/game";
import { Crown, CheckCircle2, Lock } from "lucide-react-native";

interface LuxuryItemCardProps {
  item: LuxuryItem;
  canAfford: boolean;
  onBuy: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${Math.floor(num)}`;
};

export const LuxuryItemCard: React.FC<LuxuryItemCardProps> = ({
  item,
  canAfford,
  onBuy,
}) => {
  const getCategoryColor = () => {
    switch (item.category) {
      case 'vehicle': return '#3B82F6';
      case 'jewelry': return '#F59E0B';
      case 'art': return '#8B5CF6';
      case 'collectible': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, item.owned && styles.containerOwned]}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {item.owned ? (
            <View style={styles.ownedBadge}>
              <CheckCircle2 size={16} color="#FFFFFF" fill="#10B981" />
            </View>
          ) : (
            <View style={styles.lockBadge}>
              <Lock size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Crown size={24} color={getCategoryColor()} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusLabel}>Multiplier Bonus</Text>
          <Text style={styles.bonusValue}>+{(item.multiplierBonus * 100).toFixed(0)}%</Text>
        </View>
      </View>

      {!item.owned && (
        <TouchableOpacity
          style={[
            styles.button,
            canAfford ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={onBuy}
          disabled={!canAfford || item.owned}
        >
          <Text style={[styles.buttonText, !canAfford && styles.buttonTextDisabled]}>
            Buy {formatNumber(item.cost)}
          </Text>
        </TouchableOpacity>
      )}

      {item.owned && (
        <View style={styles.ownedLabel}>
          <CheckCircle2 size={16} color="#10B981" />
          <Text style={styles.ownedText}>Owned</Text>
        </View>
      )}
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
  containerOwned: {
    backgroundColor: "#F0FDF4",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 16,
    paddingBottom: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  icon: {
    fontSize: 32,
  },
  lockBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ownedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  statsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },
  bonusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bonusLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600" as const,
  },
  bonusValue: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#F59E0B",
  },
  button: {
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#F59E0B",
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#9CA3AF",
  },
  ownedLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  ownedText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#10B981",
  },
});
