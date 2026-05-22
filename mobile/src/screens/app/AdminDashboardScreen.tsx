import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AppCard from "../../components/common/AppCard";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { COLORS } from "../../constants/colors";
import { getAdminDashboardRequest } from "../../services/admin.service";
import { AdminDashboard } from "../../types/admin.types";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { sendPaymentRemindersRequest } from "../../services/notification.service";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { TouchableOpacity } from "react-native";

export default function AdminDashboardScreen({ navigation }: any) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReminders, setSendingReminders] = useState(false);

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

 const handleSendReminders = async () => {
  try {
    setSendingReminders(true);

    const response = await sendPaymentRemindersRequest();

    Alert.alert(
      "Recordatorios enviados",
      `Se enviaron ${response.data.sent} notificaciones.`
    );
  } catch (error: any) {
    Alert.alert(
      "Error",
      error?.response?.data?.message || "No se pudieron enviar recordatorios"
    );
  } finally {
    setSendingReminders(false);
  }
};

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Admin" subtitle="Resumen real del club" />

      <View style={styles.content}>
        <SectionTitle title="Indicadores reales" />

        {loading ? (
          <ActivityIndicator color={COLORS.primaryMedium} size="large" />
        ) : (
          <>
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

            <View style={styles.grid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {dashboard?.pendingPayments ?? 0}
                </Text>
                <Text style={styles.metricText}>Pagos pendientes</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>
                  {dashboard?.overduePayments ?? 0}
                </Text>
                <Text style={styles.metricText}>Pagos en mora</Text>
              </View>
            </View>

            <AppCard>
              <Text style={styles.title}>Ingresos aprobados</Text>
              <Text style={styles.amount}>
                ${dashboard?.totalApprovedAmount ?? 0} COP
              </Text>
              <Text style={styles.text}>
                Este valor se calcula únicamente con pagos aprobados.
              </Text>
              <PrimaryButton
                title="Enviar recordatorios de pago"
                onPress={handleSendReminders}  
                loading={sendingReminders} 
              />
            </AppCard>
          </>
        )}
      </View>
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
  },
  metricNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.primaryMedium,
  },
  metricText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primaryMedium,
    marginBottom: 8,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  tapText: {
    color: COLORS.primaryMedium,
    fontSize: 11,
    marginTop: 4,
  },
});