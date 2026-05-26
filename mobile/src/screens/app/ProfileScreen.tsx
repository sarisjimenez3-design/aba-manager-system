import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/common/PrimaryButton";
import ThemeSwitch from "../../components/common/ThemeSwitch";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut, refreshProfile } = useAuth();
  const { colors } = useTheme();

  const styles = createStyles(colors);

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
        <ActivityIndicator size="large" color={colors.primaryMedium} />

        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

            <Text style={styles.infoValue}>
              {user?.phone || "No registrado"}
            </Text>
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

            <ThemeSwitch />

            <PrimaryButton title="Cerrar sesión" onPress={signOut} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 150,
      justifyContent: "center",
    },

    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },

    loadingText: {
      marginTop: 12,
      color: colors.textSecondary,
      fontSize: 14,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 22,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },

    avatar: {
      width: 78,
      height: 78,
      borderRadius: 39,
      backgroundColor: colors.primaryDark,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginBottom: 14,
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "700",
    },

    name: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    email: {
      textAlign: "center",
      color: colors.textSecondary,
      marginTop: 6,
      marginBottom: 8,
    },

    role: {
      textAlign: "center",
      color: colors.primaryMedium,
      fontWeight: "600",
      marginBottom: 16,
    },

    infoBox: {
      backgroundColor: colors.inputBackground,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
    },

    infoLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
    },

    infoValue: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "500",
    },

    buttonContainer: {
      gap: 12,
      marginTop: 16,
    },
  });