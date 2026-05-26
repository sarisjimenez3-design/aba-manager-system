import React from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <Text style={styles.title}>{title}</Text>;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 14,
      marginTop: 10,
    },
  });