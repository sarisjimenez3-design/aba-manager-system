import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
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

  const [proofValues, setProofValues] = useState<Record<string, string>>({});
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

  const handleUploadProof = async (paymentId: string) => {
    try {
      const proofUrl = proofValues[paymentId];

      if (!proofUrl || !proofUrl.trim()) {
        Alert.alert(
          "Comprobante requerido",
          "Escribe una referencia o URL del comprobante."
        );
        return;
      }

      setUploadingId(paymentId);

      await uploadPaymentProofRequest(paymentId, proofUrl.trim());

      Alert.alert("Éxito", "Comprobante enviado correctamente.");

      setProofValues((prev) => ({
        ...prev,
        [paymentId]: "",
      }));

      Keyboard.dismiss();

      await loadPayments();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo enviar el comprobante"
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

      Alert.alert(
        "Éxito",
        `Pago marcado como ${statusLabels[status]}.`
      );

      await loadPayments();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo actualizar el pago"
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
          <SectionTitle
            title={isAdmin ? "Pagos de usuarios" : "Mis pagos"}
          />

          {loading ? (
            <ActivityIndicator
              color={COLORS.primaryMedium}
              size="large"
            />
          ) : payments.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>
                {isAdmin
                  ? "No hay pagos registrados en el sistema."
                  : "Aún no tienes pagos registrados."}
              </Text>
            </AppCard>
          ) : (
            payments.map((payment) => (
              <AppCard key={payment.id}>
                {isAdmin && payment.user && (
                  <>
                    <Text style={styles.userName}>
                      {payment.user.firstName}{" "}
                      {payment.user.lastName}
                    </Text>

                    <Text style={styles.text}>
                      {payment.user.email}
                    </Text>

                    <Text style={styles.text}>
                      Rol: {payment.user.role}
                    </Text>
                  </>
                )}

                <Text style={styles.month}>{payment.month}</Text>

                <Text style={styles.amount}>
                  ${payment.amount} COP
                </Text>

                <Text style={styles.text}>
                  Estado: {statusLabels[payment.status]}
                </Text>

                <Text style={styles.text}>
                  Fecha límite:{" "}
                  {new Date(payment.dueDate).toLocaleDateString()}
                </Text>

                {payment.proofUrl ? (
                  <Text style={styles.proof}>
                    Comprobante: {payment.proofUrl}
                  </Text>
                ) : (
                  <Text style={styles.noProof}>
                    Sin comprobante enviado
                  </Text>
                )}

                {!isAdmin &&
                  payment.status !== "APPROVED" && (
                    <>
                      <TextInput
                        placeholder="Referencia o URL del comprobante"
                        placeholderTextColor={
                          COLORS.textSecondary
                        }
                        value={proofValues[payment.id] || ""}
                        onChangeText={(value) =>
                          setProofValues((prev) => ({
                            ...prev,
                            [payment.id]: value,
                          }))
                        }
                        style={styles.input}
                      />

                      <PrimaryButton
                        title="Enviar comprobante"
                        onPress={() =>
                          handleUploadProof(payment.id)
                        }
                        loading={
                          uploadingId === payment.id
                        }
                      />
                    </>
                  )}

                {isAdmin &&
                  payment.status !== "APPROVED" && (
                    <View style={styles.actions}>
                      <PrimaryButton
                        title="Aprobar"
                        onPress={() =>
                          handleChangeStatus(
                            payment.id,
                            "APPROVED"
                          )
                        }
                        loading={
                          updatingId === payment.id
                        }
                      />

                      <View style={{ height: 10 }} />

                      <PrimaryButton
                        title="Rechazar"
                        onPress={() =>
                          handleChangeStatus(
                            payment.id,
                            "REJECTED"
                          )
                        }
                        loading={
                          updatingId === payment.id
                        }
                      />
                    </View>
                  )}

                {isAdmin &&
                  payment.status === "APPROVED" && (
                    <Text style={styles.approvedText}>
                      Pago aprobado correctamente
                    </Text>
                  )}
              </AppCard>
            ))
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

  noProof: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 8,
    marginBottom: 8,
  },

  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    color: COLORS.textPrimary,
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