import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Stock } from "@/types/game";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react-native";

interface StockCardProps {
  stock: Stock;
  cash: number;
  onBuy: (shares: number) => void;
  onSell: (shares: number) => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${Math.floor(num)}`;
};

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  cash,
  onBuy,
  onSell,
}) => {
  const [shares, setShares] = useState<string>("1");

  const priceChange = stock.priceHistory.length > 1
    ? ((stock.currentPrice - stock.priceHistory[stock.priceHistory.length - 2]) / stock.priceHistory[stock.priceHistory.length - 2]) * 100
    : 0;

  const isPositive = priceChange >= 0;
  const maxSharesCanBuy = Math.floor(cash / stock.currentPrice);
  const sharesNum = parseInt(shares) || 0;
  const totalCost = sharesNum * stock.currentPrice;
  const totalValue = stock.sharesOwned * stock.currentPrice;

  const handleBuy = () => {
    if (sharesNum > 0 && sharesNum <= maxSharesCanBuy) {
      onBuy(sharesNum);
      setShares("1");
    }
  };

  const handleSell = () => {
    if (sharesNum > 0 && sharesNum <= stock.sharesOwned) {
      onSell(sharesNum);
      setShares("1");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name}>{stock.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${stock.currentPrice.toFixed(2)}</Text>
          <View style={[styles.changeBadge, isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative]}>
            {isPositive ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF4444" />}
            <Text style={[styles.changeText, isPositive ? styles.changeTextPositive : styles.changeTextNegative]}>
              {priceChange.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {stock.sharesOwned > 0 && (
        <View style={styles.positionContainer}>
          <View style={styles.positionRow}>
            <Text style={styles.positionLabel}>Shares Owned:</Text>
            <Text style={styles.positionValue}>{stock.sharesOwned.toLocaleString()}</Text>
          </View>
          <View style={styles.positionRow}>
            <Text style={styles.positionLabel}>Total Value:</Text>
            <Text style={styles.positionValueHighlight}>{formatNumber(totalValue)}</Text>
          </View>
        </View>
      )}

      <View style={styles.volatilityContainer}>
        <Text style={styles.volatilityLabel}>Volatility:</Text>
        <View style={styles.volatilityBar}>
          <View style={[styles.volatilityFill, { width: `${stock.volatility * 100}%` }]} />
        </View>
        <Text style={styles.volatilityText}>{(stock.volatility * 100).toFixed(0)}%</Text>
      </View>

      <View style={styles.tradingContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Shares:</Text>
          <TextInput
            style={styles.input}
            value={shares}
            onChangeText={setShares}
            keyboardType="number-pad"
            placeholder="0"
          />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton, (sharesNum <= 0 || sharesNum > maxSharesCanBuy) && styles.buttonDisabled]}
            onPress={handleBuy}
            disabled={sharesNum <= 0 || sharesNum > maxSharesCanBuy}
          >
            <DollarSign size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Buy {formatNumber(totalCost)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.sellButton, (sharesNum <= 0 || sharesNum > stock.sharesOwned) && styles.buttonDisabled]}
            onPress={handleSell}
            disabled={sharesNum <= 0 || sharesNum > stock.sharesOwned}
          >
            <DollarSign size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Sell {formatNumber(totalCost)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setShares(Math.floor(maxSharesCanBuy / 4).toString())}
          >
            <Text style={styles.quickButtonText}>25%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setShares(Math.floor(maxSharesCanBuy / 2).toString())}
          >
            <Text style={styles.quickButtonText}>50%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setShares(maxSharesCanBuy.toString())}
          >
            <Text style={styles.quickButtonText}>MAX</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 4,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeBadgePositive: {
    backgroundColor: "#D1FAE5",
  },
  changeBadgeNegative: {
    backgroundColor: "#FEE2E2",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  changeTextPositive: {
    color: "#10B981",
  },
  changeTextNegative: {
    color: "#EF4444",
  },
  positionContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  positionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  positionLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600" as const,
  },
  positionValue: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "700" as const,
  },
  positionValueHighlight: {
    fontSize: 15,
    color: "#10B981",
    fontWeight: "800" as const,
  },
  volatilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  volatilityLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600" as const,
  },
  volatilityBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  volatilityFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
  },
  volatilityText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "700" as const,
  },
  tradingContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyButton: {
    backgroundColor: "#10B981",
  },
  sellButton: {
    backgroundColor: "#EF4444",
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#6B7280",
  },
});
