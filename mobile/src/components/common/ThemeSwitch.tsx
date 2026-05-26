import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeSwitch() {
  const { mode, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  const isDark = mode === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggleTheme}
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
      ]}
    >
      <View
        style={[
          styles.circle,
          isDark ? styles.circleDark : styles.circleLight,
        ]}
      >
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={24}
          color={isDark ? "#FFFFFF" : "#F5B942"}
        />
      </View>

      <Text style={styles.text}>{isDark ? "Modo oscuro" : "Modo claro"}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: 58,
      borderRadius: 30,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    containerLight: {
      backgroundColor: "#EDEDED",
      borderWidth: 1,
      borderColor: colors.border,
    },
    containerDark: {
      backgroundColor: "#2FA866",
      borderWidth: 1,
      borderColor: "#2FA866",
    },
    circle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    circleLight: {
      backgroundColor: "#FFFFFF",
    },
    circleDark: {
      backgroundColor: "#07130D",
    },
    text: {
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginRight: 52,
    },
  });