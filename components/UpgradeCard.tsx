import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from "react-native";
import * as Haptics from "expo-haptics";
import {
  TrendingUp,
  Sparkles,
  Zap,
  Crown,
  Video,
  CreditCard,
} from "lucide-react-native";

interface UpgradeCardProps {
  title: string;
  description: string;
  level: number;
  cost: number;
  canAfford: boolean;
  onUpgrade: () => void;
  type: "tap" | "multiplier" | "ad";
  icon?: "trending" | "sparkles" | "zap" | "crown" | "video" | "credit-card";
  canWatchFreeAd?: boolean;
  onWatchFreeAd?: () => void;
  imageUrl?: string;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  title,
  description,
  level,
  cost,
  canAfford,
  onUpgrade,
  type,
  icon = "trending",
  canWatchFreeAd = false,
  onWatchFreeAd,
  imageUrl,
}) => {
  const handlePress = () => {
    if (!canAfford) return;
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    onUpgrade();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${Math.floor(num)}`;
  };

  const getIcon = () => {
    const iconProps = { size: 28, color: canAfford ? "#FFFFFF" : "#9CA3AF" };
    switch (icon) {
      case "sparkles":
        return <Sparkles {...iconProps} />;
      case "zap":
        return <Zap {...iconProps} />;
      case "crown":
        return <Crown {...iconProps} />;
      case "video":
        return <Video {...iconProps} />;
      case "credit-card":
        return <CreditCard {...iconProps} />;
      default:
        return <TrendingUp {...iconProps} />;
    }
  };

  const getGradientColors = () => {
    if (!canAfford) return ["#E5E7EB", "#E5E7EB"];
    
    switch (type) {
      case "tap":
        return ["#2563EB", "#1E40AF"];
      case "multiplier":
        return ["#8B5CF6", "#7C3AED"];
      case "ad":
        return ["#10B981", "#059669"];
      default:
        return ["#3B82F6", "#1D4ED8"];
    }
  };

  const handleFreeAdPress = () => {
    if (!canWatchFreeAd || !onWatchFreeAd) return;
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    onWatchFreeAd();
  };

  return (
    <View style={styles.container}>
      {canWatchFreeAd && !canAfford && onWatchFreeAd && (
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
      <View style={[styles.card, (!canAfford && !canWatchFreeAd) && styles.cardDisabled, canWatchFreeAd && !canAfford && styles.cardWithAdOverlay]}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.upgradeImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.contentArea}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: canAfford
                  ? getGradientColors()[0]
                  : "#E5E7EB",
              },
            ]}
          >
            {getIcon()}
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, !canAfford && !canWatchFreeAd && styles.titleDisabled]}>
                {title}
              </Text>
              {level > 0 && (
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv.{level}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.description, !canAfford && !canWatchFreeAd && styles.descriptionDisabled]}>
              {description}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            canAfford ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handlePress}
          disabled={!canAfford && !canWatchFreeAd}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, !canAfford && styles.buttonTextDisabled]}>
            {type === "ad" ? "FREE" : formatNumber(cost)}
          </Text>
          <Text style={[styles.buttonLabel, !canAfford && styles.buttonLabelDisabled]}>
            {type === "ad" ? "Watch Ad" : "Upgrade"}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 15,
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
  upgradeImage: {
    width: "100%",
    height: 180,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  contentArea: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  titleDisabled: {
    color: "#9CA3AF",
  },
  levelBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#92400E",
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  descriptionDisabled: {
    color: "#D1D5DB",
  },
  button: {
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#3B82F6",
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
  buttonLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 2,
  },
  buttonLabelDisabled: {
    color: "#9CA3AF",
  },
});
