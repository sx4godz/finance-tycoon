import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Trophy } from "lucide-react-native";

interface AchievementPopupProps {
  name: string;
  reward: number;
  onComplete: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  name,
  reward,
  onComplete,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2500),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, [translateY, opacity, onComplete]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${Math.floor(num)}`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Trophy color="#FBBF24" size={24} fill="#FBBF24" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Achievement Unlocked!</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.reward}>+{formatNumber(reward)}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 2000,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#FBBF24",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1A1A1A",
    marginTop: 2,
  },
  reward: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#10B981",
    marginTop: 2,
  },
});
