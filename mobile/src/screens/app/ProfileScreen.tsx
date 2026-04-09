import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../components/common/PrimaryButton";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>

        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>Rol: {user?.role}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoValue}>{user?.phone || "No registrado"}</Text>
        </View>

        <PrimaryButton title="Cerrar sesión" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  email: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 8,
  },
  role: {
    textAlign: "center",
    color: COLORS.primaryMedium,
    fontWeight: "600",
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
});