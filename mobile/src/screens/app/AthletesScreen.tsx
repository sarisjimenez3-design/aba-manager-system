import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { COLORS } from "../../constants/colors";
import { getAthletesRequest } from "../../services/user.service";
import { PaginationMeta } from "../../types/pagination.types";
import { Athlete } from "../../types/user.types";

export default function AthletesScreen() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 5;

  const loadAthletes = async () => {
    try {
      setLoading(true);

      const response = await getAthletesRequest({
        search: appliedSearch || undefined,
        page,
        limit,
      });

      setAthletes(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.log("ATHLETES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, [page, appliedSearch]);

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleClear = () => {
    setSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Deportistas"
        subtitle="Listado de deportistas registrados"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle title="Buscar deportista" />

        <TextInput
          placeholder="Buscar por nombre, correo o teléfono"
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        <View style={styles.actionsRow}>
          <View style={styles.actionButton}>
            <PrimaryButton title="Buscar" onPress={handleSearch} />
          </View>

          <View style={styles.actionButton}>
            <PrimaryButton title="Limpiar" onPress={handleClear} />
          </View>
        </View>

        <SectionTitle title={`Total encontrados: ${meta?.total ?? 0}`} />

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

        <View style={styles.pagination}>
          <PrimaryButton
            title="Anterior"
            onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page <= 1}
          />

          <Text style={styles.pageText}>
            Página {meta?.page ?? page} de {meta?.totalPages ?? 1}
          </Text>

          <PrimaryButton
            title="Siguiente"
            onPress={() =>
              setPage((prev) =>
                meta && prev < meta.totalPages ? prev + 1 : prev
              )
            }
            disabled={!meta || page >= meta.totalPages}
          />
        </View>
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
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
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
  pagination: {
    marginTop: 14,
    gap: 10,
  },
  pageText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});