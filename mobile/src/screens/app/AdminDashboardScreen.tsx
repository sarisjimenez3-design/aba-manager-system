import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppCard from "../../components/common/AppCard";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import SimpleBarChart from "../../components/common/SimpleBarChart";
import { COLORS } from "../../constants/colors";
import { getAdminDashboardRequest } from "../../services/admin.service";
import { AdminDashboard } from "../../types/admin.types";

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString("es-CO")} COP`;
};

export default function AdminDashboardScreen({ navigation }: any) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboardRequest();
      setDashboard(response.data);
    } catch (error) {
      console.log("ADMIN DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Admin" subtitle="Panel administrativo del club" />

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={COLORS.primaryMedium} size="large" />
        ) : (
          <>
            <SectionTitle title="Resumen financiero" />

            <AppCard>
              <Text style={styles.cardLabel}>Ingresos del mes</Text>
              <Text style={styles.money}>
                {formatCurrency(dashboard?.monthlyIncome ?? 0)}
              </Text>
              <Text style={styles.text}>
                Calculado con pagos aprobados durante el mes actual.
              </Text>
            </AppCard>

            <View style={styles.grid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {dashboard?.approvedToday ?? 0}
                </Text>
                <Text style={styles.metricText}>Pagos aprobados hoy</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {formatCurrency(dashboard?.approvedTodayAmount ?? 0)}
                </Text>
                <Text style={styles.metricText}>Ingresos de hoy</Text>
              </View>
            </View>

            <SectionTitle title="Usuarios" />

            <View style={styles.grid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {dashboard?.totalUsers ?? 0}
                </Text>
                <Text style={styles.metricText}>Usuarios</Text>
              </View>

              <TouchableOpacity
                style={styles.metricCard}
                onPress={() => navigation.navigate("Athletes")}
              >
                <Text style={styles.metricNumber}>
                  {dashboard?.totalAthletes ?? 0}
                </Text>
                <Text style={styles.metricText}>Deportistas</Text>
                <Text style={styles.tapText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {dashboard?.totalParents ?? 0}
                </Text>
                <Text style={styles.metricText}>Padres</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {dashboard?.totalCoaches ?? 0}
                </Text>
                <Text style={styles.metricText}>Entrenadores</Text>
              </View>
            </View>

            <SectionTitle title="Estado de pagos" />

            <AppCard>
              <SimpleBarChart data={dashboard?.paymentStatusChart ?? []} />
            </AppCard>

            <SectionTitle title="Usuarios por rol" />

            <AppCard>
              <SimpleBarChart data={dashboard?.userRoleChart ?? []} />
            </AppCard>

            <SectionTitle title="Últimos usuarios registrados" />

            {dashboard?.latestUsers && dashboard.latestUsers.length > 0 ? (
              dashboard.latestUsers.map((user) => (
                <AppCard key={user.id}>
                  <Text style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.text}>{user.email}</Text>
                  <Text style={styles.roleText}>Rol: {user.role}</Text>
                  <Text style={styles.dateText}>
                    Registrado:{" "}
                    {new Date(user.createdAt).toLocaleDateString("es-CO")}
                  </Text>
                </AppCard>
              ))
            ) : (
              <AppCard>
                <Text style={styles.text}>
                  No hay usuarios registrados recientemente.
                </Text>
              </AppCard>
            )}
          </>
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
    paddingBottom: 130,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 105,
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primaryMedium,
    textAlign: "center",
  },
  metricText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
  tapText: {
    color: COLORS.primaryMedium,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  cardLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  money: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primaryMedium,
    marginBottom: 8,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  roleText: {
    color: COLORS.primaryMedium,
    fontWeight: "600",
    marginTop: 6,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
});