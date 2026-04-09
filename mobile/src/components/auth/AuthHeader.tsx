import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

interface Props {
  title: string;
}

export default function AuthHeader({ title }: Props) {
  return (
    <LinearGradient
      colors={[COLORS.primaryLight, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>ABA</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.white,
  },
});