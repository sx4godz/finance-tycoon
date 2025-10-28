import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Stack, router } from "expo-router";
import { useGame } from "@/contexts/GameContext";
import { Trash2, DollarSign, Info, Sparkles, Trophy, Crown, Check, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return `${Math.floor(num)}`;
};

export default function SettingsScreen() {
  const { resetGame, addBonusCash, gameState, purchasePremium, canWatchAd } = useGame();
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  const handleReset = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to reset all game progress?",
      );
      if (confirmed) {
        resetGame();
        router.push("/");
      }
    } else {
      Alert.alert(
        "Reset Game",
        "Are you sure you want to reset all game progress?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset",
            style: "destructive",
            onPress: () => {
              resetGame();
              router.push("/");
            },
          },
        ],
      );
    }
  };

  const handleWatchRewardedAd = () => {
    if (!canWatchAd) {
      if (Platform.OS === "web") {
        alert("Please wait before watching another ad!");
      } else {
        Alert.alert("Wait", "Please wait before watching another ad!");
      }
      return;
    }

    const bonusMultiplier = Math.max(1, gameState.prestigeLevel);
    const bonusAmount = 10000 * bonusMultiplier;

    if (gameState.isPremium) {
      addBonusCash(bonusAmount);
      if (Platform.OS === "web") {
        alert(`Premium Bonus! You earned ${formatNumber(bonusAmount)} instantly!`);
      } else {
        Alert.alert("Premium Bonus!", `You earned ${formatNumber(bonusAmount)} instantly!`);
      }
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Watch a rewarded ad to earn ${formatNumber(bonusAmount)} bonus cash?`,
      );
      if (confirmed) {
        addBonusCash(bonusAmount);
        alert(`Bonus cash added: ${formatNumber(bonusAmount)}!`);
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
        ],
      );
    }
  };

  const handlePurchasePremium = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Purchase Premium for $9.99 to remove all ads and get exclusive bonuses?",
      );
      if (confirmed) {
        purchasePremium();
        setShowPremiumModal(false);
        alert("Thank you for going Premium! Ads have been removed.");
      }
    } else {
      Alert.alert(
        "Purchase Premium",
        "Purchase Premium for $9.99 to remove all ads and get exclusive bonuses?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Purchase",
            onPress: () => {
              purchasePremium();
              setShowPremiumModal(false);
              Alert.alert("Success!", "Thank you for going Premium! Ads have been removed.");
            },
          },
        ],
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#FFFFFF",
        }}
      />
      <ScrollView style={styles.container}>
        {!gameState.isPremium && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.premiumBanner}
              onPress={() => setShowPremiumModal(true)}
            >
              <LinearGradient
                colors={["#FBBF24", "#F59E0B", "#D97706"]}
                style={styles.premiumGradient}
              >
                <Crown size={32} color="#FFFFFF" />
                <View style={styles.premiumContent}>
                  <Text style={styles.premiumTitle}>Go Premium</Text>
                  <Text style={styles.premiumSubtitle}>
                    Remove all ads • Exclusive bonuses • Support development
                  </Text>
                </View>
                <Text style={styles.premiumPrice}>$9.99</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {gameState.isPremium && (
          <View style={styles.section}>
            <View style={styles.premiumActiveCard}>
              <Crown size={24} color="#FBBF24" />
              <View style={styles.premiumActiveContent}>
                <Text style={styles.premiumActiveTitle}>Premium Active</Text>
                <Text style={styles.premiumActiveSubtitle}>
                  Thank you for supporting the game!
                </Text>
              </View>
              <Check size={24} color="#10B981" />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Stats</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Cash:</Text>
              <Text style={styles.statValue}>{formatNumber(gameState.cash)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Earned:</Text>
              <Text style={styles.statValue}>{formatNumber(gameState.totalEarnings)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Lifetime Taps:</Text>
              <Text style={styles.statValue}>{gameState.lifetimeTaps}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Businesses Owned:</Text>
              <Text style={styles.statValue}>
                {gameState.businesses.filter(b => b.owned).length}/{gameState.businesses.length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Properties Owned:</Text>
              <Text style={styles.statValue}>
                {gameState.properties.filter(p => p.owned).length}/{gameState.properties.length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Luxury Items:</Text>
              <Text style={styles.statValue}>
                {gameState.luxuryItems.filter(l => l.owned).length}/{gameState.luxuryItems.length}
              </Text>
            </View>
            {gameState.prestigeLevel > 0 && (
              <View style={styles.statRow}>
                <View style={styles.prestigeRow}>
                  <Sparkles color="#FBBF24" size={16} />
                  <Text style={styles.statLabel}>Prestige Level:</Text>
                </View>
                <Text style={[styles.statValue, styles.prestigeValue]}>
                  {gameState.prestigeLevel}
                </Text>
              </View>
            )}
            {gameState.achievements.filter(a => a.unlocked).length > 0 && (
              <View style={styles.statRow}>
                <View style={styles.prestigeRow}>
                  <Trophy color="#FBBF24" size={16} />
                  <Text style={styles.statLabel}>Achievements:</Text>
                </View>
                <Text style={[styles.statValue, styles.prestigeValue]}>
                  {gameState.achievements.filter(a => a.unlocked).length}/{gameState.achievements.length}
                </Text>
              </View>
            )}
            {!gameState.isPremium && gameState.adsWatched > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Ads Watched:</Text>
                <Text style={styles.statValue}>{gameState.adsWatched}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{gameState.isPremium ? "Premium Rewards" : "Ads & Rewards"}</Text>
          <TouchableOpacity
            style={[styles.button, !canWatchAd && styles.buttonDisabled]}
            onPress={handleWatchRewardedAd}
            disabled={!canWatchAd}
          >
            {gameState.isPremium ? (
              <Crown color={canWatchAd ? "#FBBF24" : "#9CA3AF"} size={24} />
            ) : (
              <DollarSign color={canWatchAd ? "#10B981" : "#9CA3AF"} size={24} />
            )}
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, !canWatchAd && styles.buttonTitleDisabled]}>
                {gameState.isPremium ? "Premium Instant Cash" : "Watch Rewarded Ad"}
              </Text>
              <Text style={styles.buttonSubtitle}>
                {canWatchAd
                  ? `${gameState.isPremium ? "Instant: " : ""}Earn ${formatNumber(10000 * Math.max(1, gameState.prestigeLevel))} bonus cash`
                  : "Available every 5 minutes"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Info</Text>
          <View style={styles.infoCard}>
            <Info color="#3B82F6" size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How to Play</Text>
              <Text style={styles.infoText}>
                • Swipe the credit card to earn money{"\n"}
                • Upgrade credit limit for bigger earnings{"\n"}
                • Buy and upgrade businesses{"\n"}
                • Auto-generate at level 15{"\n"}
                • Invest in real estate properties{"\n"}
                • Buy luxury items for global multipliers{"\n"}
                • Unlock stock trading at $500K earned{"\n"}
                • Purchase global income multipliers{"\n"}
                • Unlock achievements for bonuses{"\n"}
                • Prestige at $100M for permanent boost
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleReset}
          >
            <Trash2 color="#EF4444" size={24} />
            <View style={styles.buttonContent}>
              <Text style={[styles.buttonTitle, styles.dangerText]}>
                Reset Game
              </Text>
              <Text style={styles.buttonSubtitle}>
                This will delete all progress
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Finance Empire v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for mobile gamers</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showPremiumModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowPremiumModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>

            <LinearGradient
              colors={["#FBBF24", "#F59E0B"]}
              style={styles.modalHeader}
            >
              <Crown size={48} color="#FFFFFF" />
              <Text style={styles.modalTitle}>Go Premium</Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <Text style={styles.modalPrice}>$9.99 USD</Text>
              <Text style={styles.modalSubtext}>One-time purchase • Lifetime access</Text>

              <View style={styles.featuresList}>
                <View style={styles.feature}>
                  <Check size={20} color="#10B981" />
                  <Text style={styles.featureText}>Remove all pop-up ads</Text>
                </View>
                <View style={styles.feature}>
                  <Check size={20} color="#10B981" />
                  <Text style={styles.featureText}>100% additional income boost</Text>
                </View>
                <View style={styles.feature}>
                  <Check size={20} color="#10B981" />
                  <Text style={styles.featureText}>2x ad watch rewards</Text>
                </View>
                <View style={styles.feature}>
                  <Check size={20} color="#10B981" />
                  <Text style={styles.featureText}>Support game development</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={handlePurchasePremium}
              >
                <LinearGradient
                  colors={["#FBBF24", "#F59E0B"]}
                  style={styles.purchaseGradient}
                >
                  <Crown size={20} color="#FFFFFF" />
                  <Text style={styles.purchaseText}>Purchase Premium</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                Simulated purchase for demo purposes
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  premiumBanner: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  premiumPrice: {
    fontSize: 24,
    fontWeight: "900" as const,
    color: "#FFFFFF",
  },
  premiumActiveCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#FEF3C7",
  },
  premiumActiveContent: {
    flex: 1,
  },
  premiumActiveTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1A1A1A",
    marginBottom: 2,
  },
  premiumActiveSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  buttonTitleDisabled: {
    color: "#9CA3AF",
  },
  buttonSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  dangerText: {
    color: "#EF4444",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1A1A1A",
  },
  prestigeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  prestigeValue: {
    color: "#FBBF24",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600" as const,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#D1D5DB",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 8,
  },
  modalHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    marginTop: 12,
  },
  modalBody: {
    padding: 24,
  },
  modalPrice: {
    fontSize: 36,
    fontWeight: "900" as const,
    color: "#1A1A1A",
    textAlign: "center",
  },
  modalSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  featuresList: {
    gap: 16,
    marginBottom: 24,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500" as const,
  },
  purchaseButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  purchaseText: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
  },
});
