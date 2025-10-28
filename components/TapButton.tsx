import React, { useCallback, useRef, useLayoutEffect } from "react";
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

interface TapButtonProps {
  tapPower: number;
  onTap: () => void;
}

export const TapButton: React.FC<TapButtonProps> = ({ tapPower, onTap }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleTap = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    onTap();
  }, [onTap, scaleAnim]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return `${Math.floor(num)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelTop}>
        <Text style={styles.labelTopText}>SWIPE TO EARN</Text>
        <Text style={styles.amountTop}>+${formatNumber(tapPower)}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleTap}
        style={styles.touchable}
      >
        <Animated.View
          style={[
            styles.cardButton,
            {
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: "https://r2-pub.rork.com/generated-images/c2231af3-8124-47cb-a253-21bdac64220d.png" }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardChip} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  labelTop: {
    alignItems: "center",
    gap: 6,
  },
  labelTopText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#6B7280",
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  amountTop: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: "#2563EB",
  },
  touchable: {
    width: "100%",
  },
  cardButton: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    backgroundColor: "#1E40AF",
    overflow: "hidden",
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
    position: "relative" as const,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    top: 0,
    left: 0,
  },
  cardChip: {
    position: "absolute" as const,
    top: 30,
    left: 30,
    width: 50,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#FCD34D",
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
});
