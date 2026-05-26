import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  children: React.ReactNode;
}

export default function AppCard({ children }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.card}>{children}</View>;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 18,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
  });