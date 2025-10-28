import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGame } from "@/contexts/GameContext";
import { router } from "expo-router";
import { ShoppingBag } from "lucide-react-native";

export const AdBanner: React.FC = () => {
  const { gameState } = useGame();

  if (gameState.isPremium) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.adContent}>
        <Text style={styles.text}>Ad Space - Get Premium to Remove Ads</Text>
        <Text style={styles.subtext}>320x50 Banner</Text>
      </View>
      <TouchableOpacity
        style={styles.premiumButton}
        onPress={() => router.push("/settings")}
      >
        <ShoppingBag size={16} color="#FFFFFF" />
        <Text style={styles.premiumText}>Go Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    padding: 12,
  },
  adContent: {
    alignItems: "center",
  },
  text: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600" as const,
  },
  subtext: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 4,
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  premiumText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700" as const,
  },
});
