import * as ImagePicker from "expo-image-picker";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { API_BASE_URL } from "../../constants/env";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import {
  getAllPaymentsRequest,
  getMyPaymentsRequest,
  updatePaymentStatusRequest,
  uploadPaymentProofRequest,
} from "../../services/payment.service";
import { Payment, PaymentStatus } from "../../types/payment.types";

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  OVERDUE: "En mora",
};

export default function PaymentsScreen() {
  const { user } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  const loadPayments = async () => {
    try {
      setLoading(true);

      const response = isAdmin
        ? await getAllPaymentsRequest()
        : await getMyPaymentsRequest();

      setPayments(response.data);
    } catch (error) {
      console.log("PAYMENTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [user?.role]);

  const getProofImageUrl = (proofUrl?: string) => {
    if (!proofUrl) return null;

    if (proofUrl.startsWith("http")) {
      return proofUrl;
    }

    return `${API_BASE_URL}${proofUrl}`;
  };

  const pickProofImage = async (paymentId: string) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Debes permitir acceso a tus imágenes para subir el comprobante."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleChangeStatus = async (
    paymentId: string,
    status: PaymentStatus
  ) => {
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

          {loading ? (
            <ActivityIndicator color={COLORS.primaryMedium} size="large" />
          ) : payments.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>
                {isAdmin
                  ? "No hay pagos registrados en el sistema."
                  : "No tienes pagos pendientes. Tu mensualidad está al día."}
              </Text>
            </AppCard>
          ) : (
            payments.map((payment) => {
              const proofImageUrl = getProofImageUrl(payment.proofUrl);

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
                  <Text style={styles.amount}>${payment.amount} COP</Text>

                  <Text style={styles.text}>
                    Estado: {statusLabels[payment.status]}
                  </Text>

                  <Text style={styles.text}>
                    Fecha límite:{" "}
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </Text>

                  {proofImageUrl ? (
                    <>
                      <Text style={styles.proof}>Comprobante enviado:</Text>

                      <Image
                        source={{ uri: proofImageUrl }}
                        style={styles.proofImage}
                        resizeMode="cover"
                      />
                    </>
                  ) : (
                    <Text style={styles.noProof}>
                      Sin comprobante enviado
                    </Text>
                  )}

                  {!isAdmin && payment.status !== "APPROVED" && (
                    <PrimaryButton
                      title={
                        proofImageUrl
                          ? "Cambiar comprobante"
                          : "Subir imagen del comprobante"
                      }
                      onPress={() => pickProofImage(payment.id)}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  month: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 6,
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
    marginBottom: 4,
  },
  proof: {
    color: COLORS.primaryMedium,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 8,
  },
  proofImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: COLORS.background,
  },
  noProof: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 8,
    marginBottom: 12,
  },
  actions: {
    marginTop: 12,
  },
  approvedText: {
    color: COLORS.success,
    fontWeight: "700",
    marginTop: 10,
  },
});