import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

interface ChartItem {
  label: string;
  value: number;
}

interface Props {
  data: ChartItem[];
}

export default function SimpleBarChart({ data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.container}>
      {data.map((item) => {
        const widthPercent = `${(item.value / maxValue) * 100}%`;

        return (
          <View key={item.label} style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{item.label}</Text>
            </View>

            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: widthPercent as any }]} />
            </View>

            <Text style={styles.value}>{item.value}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelContainer: {
    width: 85,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: COLORS.primaryMedium,
    borderRadius: 10,
  },
  value: {
    width: 28,
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "right",
  },
});