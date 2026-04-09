import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.greeting}>Hola, {user?.firstName}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Novedades del club</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gran práctica del equipo</Text>
          <Text style={styles.cardText}>
            Aquí luego mostraremos publicaciones reales del club, anuncios y
            novedades.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Próximos eventos</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Convocatoria Copa Navideña</Text>
          <Text style={styles.cardText}>
            Esta sección mostrará próximos eventos y actividades del club.
          </Text>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningText}>⚠️ Tienes un pago pendiente</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 120,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  greeting: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "700",
  },
  content: {
    padding: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  cardText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: COLORS.warningSoft,
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  warningText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
});