import React from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ScreenHeader({ title, subtitle }: Props) {
  return (
    <LinearGradient
      colors={[COLORS.primaryLight, COLORS.primaryDark]}
      style={styles.header}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 125,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 4,
  },
});