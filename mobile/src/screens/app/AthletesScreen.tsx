import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppCard from "../../components/common/AppCard";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { COLORS } from "../../constants/colors";
import { getAthletesRequest } from "../../services/user.service";
import { Athlete } from "../../types/user.types";

export default function AthletesScreen() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAthletes = async () => {
    try {
      setLoading(true);

      const response = await getAthletesRequest();
      setAthletes(response.data);
    } catch (error) {
      console.log("ATHLETES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Deportistas"
        subtitle="Listado de deportistas registrados"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle title={`Total deportistas: ${athletes.length}`} />

        {loading ? (
          <ActivityIndicator color={COLORS.primaryMedium} size="large" />
        ) : athletes.length === 0 ? (
          <AppCard>
            <Text style={styles.text}>No hay deportistas registrados.</Text>
          </AppCard>
        ) : (
          athletes.map((athlete) => (
            <AppCard key={athlete.id}>
              <Text style={styles.name}>
                {athlete.firstName} {athlete.lastName}
              </Text>

              <Text style={styles.text}>Correo: {athlete.email}</Text>

              <Text style={styles.text}>
                Teléfono: {athlete.phone || "No registrado"}
              </Text>

              <Text style={styles.text}>
                Estado: {athlete.isActive ? "Activo" : "Inactivo"}
              </Text>

              <Text style={styles.date}>
                Registrado: {new Date(athlete.createdAt).toLocaleDateString()}
              </Text>
            </AppCard>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  name: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 5,
  },
  date: {
    color: COLORS.primaryMedium,
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },
});