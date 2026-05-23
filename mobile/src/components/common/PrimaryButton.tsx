import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={isDisabled ? styles.disabledWrapper : undefined}
    >
      <LinearGradient
        colors={
          isDisabled
            ? [colors.textSecondary, colors.textSecondary]
            : [colors.primaryLight, colors.primaryDark]
        }
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const createStyles = (_colors: any) =>
  StyleSheet.create({
    button: {
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    disabledWrapper: {
      opacity: 0.7,
    },
  });