import React from "react";
import { Image, StyleSheet, Text } from "react-native";
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
      <Image
        source={require("../../assets/logo-aba.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  logo: {
    width: 115,
    height: 115,
    marginBottom: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.white,
  },
});