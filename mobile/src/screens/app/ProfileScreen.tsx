import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../components/common/PrimaryButton";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen({navigation}: any) {
  const { user, signOut, refreshProfile } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await refreshProfile();
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryMedium} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0) || ""}
            {user?.lastName?.charAt(0) || ""}
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

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Estado</Text>
          <Text style={styles.infoValue}>
            {user?.isActive ? "Activo" : "No disponible"}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
  <PrimaryButton
    title="Editar perfil"
    onPress={() => navigation.navigate("EditProfile")}
  />

  <PrimaryButton
    title="Cerrar sesión"
    onPress={signOut}
  />
</View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
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
    marginBottom: 14,
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
  buttonContainer: {
    gap: 14,
    marginTop: 18,
  },
});