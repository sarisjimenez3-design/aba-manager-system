import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
  getAllPaymentsRequest,
  getMyPaymentsRequest,
  updatePaymentStatusRequest,
  uploadPaymentProofRequest,
} from "../../services/payment.service";
import { Payment, PaymentStatus } from "../../types/payment.types";
import { PaginationMeta } from "../../types/pagination.types";
import { getImageUrl } from "../../utils/getImageUrl";

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  OVERDUE: "En mora",
};

const statusOptions: { label: string; value: PaymentStatus | "ALL" }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Aprobados", value: "APPROVED" },
  { label: "Mora", value: "OVERDUE" },
  { label: "Rechazados", value: "REJECTED" },
];

export default function PaymentsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">(
    "ALL"
  );

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;
  const isAdmin = user?.role === "ADMIN";

  const loadPayments = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const response = await getAllPaymentsRequest({
          status: selectedStatus === "ALL" ? undefined : selectedStatus,
          search: appliedSearch || undefined,
          page,
          limit,
        });

        setPayments(response.data);
        setMeta(response.meta);
        return;
      }

      const response = await getMyPaymentsRequest();

      setPayments(response.data);
      setMeta(null);
    } catch (error) {
      console.log("PAYMENTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [user?.role, selectedStatus, appliedSearch, page]);

  const handlePickProofImage = async (paymentId: string) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Debes permitir acceso a tus imágenes."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;

      setUploadingId(paymentId);

      await uploadPaymentProofRequest(paymentId, imageUri);

      Alert.alert("Éxito", "Comprobante enviado correctamente.");

      Keyboard.dismiss();

      await loadPayments();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo enviar el comprobante"
      );
    } finally {
      setUploadingId(null);
    }
  };

  const handleChangeStatus = async (paymentId: string, status: PaymentStatus) => {
    try {
      setUpdatingId(paymentId);

      await updatePaymentStatusRequest(paymentId, status);

      Alert.alert("Éxito", `Pago marcado como ${statusLabels[status]}.`);

      await loadPayments();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo actualizar el pago"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleClearFilters = () => {
    setSearch("");
    setAppliedSearch("");
    setSelectedStatus("ALL");
    setPage(1);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title={isAdmin ? "Gestión de pagos" : "Pagos"}
          subtitle={
            isAdmin
              ? "Revisa comprobantes y aprueba pagos"
              : "Estado de mensualidades"
          }
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <SectionTitle title={isAdmin ? "Pagos de usuarios" : "Mis pagos"} />

          {isAdmin && (
            <>
              <TextInput
                placeholder="Buscar por nombre, correo o teléfono"
                placeholderTextColor={colors.inputPlaceholder}
                value={search}
                onChangeText={setSearch}
                style={styles.input}
              />

              <View style={styles.actionsRow}>
                <View style={styles.actionButton}>
                  <PrimaryButton title="Buscar" onPress={handleSearch} />
                </View>

                <View style={styles.actionButton}>
                  <PrimaryButton title="Limpiar" onPress={handleClearFilters} />
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
              >
                {statusOptions.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.filterChip,
                      selectedStatus === item.value &&
                        styles.filterChipActive,
                    ]}
                    onPress={() => {
                      setSelectedStatus(item.value);
                      setPage(1);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedStatus === item.value &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.resultText}>
                Resultados: {meta?.total ?? 0}
              </Text>
            </>
          )}

          {loading ? (
            <ActivityIndicator color={colors.primaryMedium} size="large" />
          ) : payments.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>
                {isAdmin
                  ? "No hay pagos registrados con los filtros seleccionados."
                  : "Aún no tienes pagos pendientes."}
              </Text>
            </AppCard>
          ) : (
            payments.map((payment) => {
              const proofImageUri = getImageUrl(payment.proofUrl);

              return (
                <AppCard key={payment.id}>
                  {isAdmin && payment.user && (
                    <>
                      <Text style={styles.userName}>
                        {payment.user.firstName} {payment.user.lastName}
                      </Text>

                      <Text style={styles.text}>{payment.user.email}</Text>

                      <Text style={styles.text}>Rol: {payment.user.role}</Text>
                    </>
                  )}

                  <Text style={styles.month}>{payment.month}</Text>

                  <Text style={styles.amount}>
                    ${payment.amount.toLocaleString("es-CO")} COP
                  </Text>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {statusLabels[payment.status]}
                    </Text>
                  </View>

                  <Text style={styles.text}>
                    Fecha límite:{" "}
                    {new Date(payment.dueDate).toLocaleDateString("es-CO")}
                  </Text>

                  {proofImageUri ? (
                    <>
                      <Text style={styles.proof}>Comprobante enviado</Text>

                      <Image
                        source={{ uri: proofImageUri }}
                        style={styles.proofImage}
                        resizeMode="cover"
                      />
                    </>
                  ) : (
                    <Text style={styles.noProof}>Sin comprobante enviado</Text>
                  )}

                  {!isAdmin && payment.status !== "APPROVED" && (
                    <PrimaryButton
                      title="Subir imagen del comprobante"
                      onPress={() => handlePickProofImage(payment.id)}
                      loading={uploadingId === payment.id}
                    />
                  )}

                  {isAdmin && payment.status !== "APPROVED" && (
                    <View style={styles.actions}>
                      <PrimaryButton
                        title="Aprobar"
                        onPress={() =>
                          handleChangeStatus(payment.id, "APPROVED")
                        }
                        loading={updatingId === payment.id}
                      />

                      <View style={{ height: 10 }} />

                      <PrimaryButton
                        title="Rechazar"
                        onPress={() =>
                          handleChangeStatus(payment.id, "REJECTED")
                        }
                        loading={updatingId === payment.id}
                      />
                    </View>
                  )}

                  {isAdmin && payment.status === "APPROVED" && (
                    <Text style={styles.approvedText}>
                      Pago aprobado correctamente
                    </Text>
                  )}
                </AppCard>
              );
            })
          )}

          {isAdmin && meta && meta.totalPages > 1 && (
            <View style={styles.pagination}>
              <PrimaryButton
                title="Anterior"
                onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
              />

              <Text style={styles.pageText}>
                Página {meta.page} de {meta.totalPages}
              </Text>

              <PrimaryButton
                title="Siguiente"
                onPress={() =>
                  setPage((prev) =>
                    meta && prev < meta.totalPages ? prev + 1 : prev
                  )
                }
                disabled={page >= meta.totalPages}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 18,
      paddingBottom: 130,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 14,
      padding: 14,
      color: colors.textPrimary,
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
    filtersContainer: {
      marginBottom: 12,
    },
    filterChip: {
      paddingVertical: 9,
      paddingHorizontal: 14,
      backgroundColor: colors.card,
      borderRadius: 18,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.primaryMedium,
      borderColor: colors.primaryMedium,
    },
    filterChipText: {
      color: colors.textSecondary,
      fontWeight: "600",
    },
    filterChipTextActive: {
      color: "#FFFFFF",
    },
    resultText: {
      color: colors.textSecondary,
      fontWeight: "600",
      marginBottom: 12,
    },
    userName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    month: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginTop: 10,
      marginBottom: 6,
    },
    amount: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.primaryMedium,
      marginBottom: 8,
    },
    statusBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.inputBackground,
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    statusBadgeText: {
      color: colors.primaryMedium,
      fontWeight: "700",
    },
    text: {
      color: colors.textSecondary,
      fontSize: 15,
      marginBottom: 4,
    },
    proof: {
      color: colors.primaryMedium,
      fontSize: 14,
      fontWeight: "600",
      marginTop: 8,
      marginBottom: 8,
    },
    proofImage: {
      width: "100%",
      height: 190,
      borderRadius: 16,
      marginBottom: 12,
      backgroundColor: colors.inputBackground,
    },
    noProof: {
      color: colors.textSecondary,
      fontSize: 14,
      fontStyle: "italic",
      marginTop: 8,
      marginBottom: 8,
    },
    actions: {
      marginTop: 12,
    },
    approvedText: {
      color: colors.success,
      fontWeight: "700",
      marginTop: 10,
    },
    pagination: {
      marginTop: 14,
      gap: 10,
    },
    pageText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });