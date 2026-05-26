import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ScreenHeader({ title, subtitle }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      paddingTop: 70,
      paddingHorizontal: 26,
      paddingBottom: 30,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    title: {
      fontSize: 34,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    subtitle: {
      color: "#FFFFFF",
      opacity: 0.9,
      fontSize: 16,
      marginTop: 8,
    },
  });