import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, Easing } from "react-native";

interface FloatingCashProps {
  amount: string;
  x: number;
  y: number;
  onComplete: () => void;
}

export const FloatingCash: React.FC<FloatingCashProps> = ({
  amount,
  x,
  y,
  onComplete,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const horizontalDrift = (Math.random() - 0.5) * 40;
    const rotationValue = (Math.random() - 0.5) * 8;

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          delay: 400,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          delay: 600,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateY, {
        toValue: -80,
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: horizontalDrift,
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: rotationValue,
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
        }),
    ]).start(() => {
      onComplete();
    });
  }, [translateY, translateX, scale, opacity, rotation, onComplete]);

  const rotate = rotation.interpolate({
    inputRange: [-8, 8],
    outputRange: ['-8deg', '8deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - 50,
          top: y - 30,
          transform: [{ translateY }, { translateX }, { scale }, { rotate }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View style={styles.cashBubble}>
        <Text style={styles.text}>+{amount}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute" as const,
    zIndex: 1000,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  cashBubble: {
    backgroundColor: "rgba(16, 185, 129, 0.95)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: "center" as const,
    letterSpacing: 0.5,
  },
});
