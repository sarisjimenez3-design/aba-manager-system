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
} from "react-native";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import CustomInput from "../../components/common/CustomInput";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
  answerSupportTicketRequest,
  createSupportTicketRequest,
  deleteSupportTicketRequest,
  getMySupportTicketsRequest,
  getSupportTicketsRequest,
} from "../../services/support.service";
import { SupportTicket } from "../../types/support.types";

export default function SupportScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const [sending, setSending] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canViewTickets = user?.role === "ADMIN" || user?.role === "COACH";
  const canCreateTicket = user?.role === "ATHLETE" || user?.role === "PARENT";

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);

      if (canViewTickets) {
        const response = await getSupportTicketsRequest();
        setTickets(response.data);
        return;
      }

      if (canCreateTicket) {
        const response = await getMySupportTicketsRequest();
        setTickets(response.data);
        return;
      }

      setTickets([]);
    } catch (error) {
      console.log("SUPPORT TICKETS ERROR:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user?.role]);

  const handleSend = async () => {
    try {
      if (!subject.trim() || !message.trim()) {
        Alert.alert("Campos requeridos", "Escribe asunto y mensaje.");
        return;
      }

      setSending(true);

      await createSupportTicketRequest({
        subject: subject.trim(),
        message: message.trim(),
      });

      setSubject("");
      setMessage("");
      Keyboard.dismiss();

      await loadTickets();

      Alert.alert(
        "Mensaje enviado",
        "El club responderá tu solicitud lo más pronto posible."
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo enviar el mensaje"
      );
    } finally {
      setSending(false);
    }
  };

  const handleAnswerTicket = async (ticketId: string) => {
    try {
      const ticketResponse = responses[ticketId];

      if (!ticketId || !ticketResponse || !ticketResponse.trim()) {
        Alert.alert("Respuesta requerida", "Escribe una respuesta.");
        return;
      }

      setAnsweringId(ticketId);

      await answerSupportTicketRequest(ticketId, ticketResponse.trim());

      setResponses((prev) => ({
        ...prev,
        [ticketId]: "",
      }));

      Keyboard.dismiss();

      await loadTickets();

      Alert.alert("Éxito", "Solicitud respondida correctamente.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo responder la solicitud"
      );
    } finally {
      setAnsweringId(null);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    Alert.alert(
      "Eliminar solicitud",
      "¿Seguro que deseas eliminar este mensaje de soporte?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(ticketId);

              await deleteSupportTicketRequest(ticketId);
              await loadTickets();

              Alert.alert("Éxito", "Solicitud eliminada correctamente.");
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.response?.data?.message ||
                  "No se pudo eliminar la solicitud"
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Soporte"
          subtitle={
            canViewTickets ? "Solicitudes recibidas" : "Contacta al club"
          }
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {canCreateTicket && (
            <>
              <SectionTitle title="Enviar solicitud" />

              <CustomInput
                placeholder="Asunto"
                value={subject}
                onChangeText={setSubject}
                icon="chatbubble-outline"
              />

              <TextInput
                placeholder="Escribe tu mensaje"
                placeholderTextColor={colors.inputPlaceholder}
                value={message}
                onChangeText={setMessage}
                multiline
                style={styles.textArea}
              />

              <PrimaryButton
                title="Enviar mensaje"
                onPress={handleSend}
                loading={sending}
              />

              <SectionTitle title="Mis solicitudes" />
            </>
          )}

          {canViewTickets && <SectionTitle title="Mensajes de usuarios" />}

          {loadingTickets ? (
            <ActivityIndicator color={colors.primaryMedium} size="large" />
          ) : tickets.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>
                {canViewTickets
                  ? "No hay solicitudes de soporte registradas."
                  : "Aún no has enviado solicitudes de soporte."}
              </Text>
            </AppCard>
          ) : (
            tickets.map((ticket) => (
              <AppCard key={ticket.id}>
                <Text style={styles.title}>{ticket.subject}</Text>

                <Text style={styles.status}>Estado: {ticket.status}</Text>

                {ticket.user ? (
                  <Text style={styles.userInfo}>
                    Usuario: {ticket.user.firstName} {ticket.user.lastName} ·{" "}
                    {ticket.user.role}
                  </Text>
                ) : null}

                <Text style={styles.label}>Mensaje:</Text>
                <Text style={styles.text}>{ticket.message}</Text>

                <Text style={styles.date}>
                  Enviado: {new Date(ticket.createdAt).toLocaleString()}
                </Text>

                {ticket.response ? (
                  <>
                    <Text style={styles.label}>
                      {canViewTickets
                        ? "Respuesta enviada:"
                        : "Respuesta del club:"}
                    </Text>

                    <Text style={styles.response}>{ticket.response}</Text>

                    {ticket.respondedAt ? (
                      <Text style={styles.date}>
                        Respondido:{" "}
                        {new Date(ticket.respondedAt).toLocaleString()}
                      </Text>
                    ) : null}
                  </>
                ) : canViewTickets ? (
                  <>
                    <TextInput
                      placeholder="Escribe una respuesta"
                      placeholderTextColor={colors.inputPlaceholder}
                      value={responses[ticket.id] || ""}
                      onChangeText={(value) =>
                        setResponses((prev) => ({
                          ...prev,
                          [ticket.id]: value,
                        }))
                      }
                      multiline
                      style={styles.answerInput}
                    />

                    <PrimaryButton
                      title="Responder"
                      onPress={() => handleAnswerTicket(ticket.id)}
                      loading={answeringId === ticket.id}
                    />
                  </>
                ) : (
                  <Text style={styles.pendingResponse}>
                    Aún no hay respuesta del club.
                  </Text>
                )}

                {canViewTickets && (
                  <>
                    <Text style={styles.separator}>────────────</Text>

                    <PrimaryButton
                      title="Eliminar solicitud"
                      onPress={() => handleDeleteTicket(ticket.id)}
                      loading={deletingId === ticket.id}
                    />
                  </>
                )}
              </AppCard>
            ))
          )}

          {!canCreateTicket && !canViewTickets && (
            <AppCard>
              <Text style={styles.text}>
                Tu rol no tiene acciones disponibles en soporte.
              </Text>
            </AppCard>
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
    textArea: {
      backgroundColor: colors.inputBackground,
      borderRadius: 14,
      padding: 14,
      height: 130,
      textAlignVertical: "top",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    answerInput: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      padding: 12,
      minHeight: 90,
      textAlignVertical: "top",
      marginTop: 12,
      marginBottom: 12,
      color: colors.textPrimary,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 6,
    },
    status: {
      color: colors.primaryMedium,
      fontWeight: "600",
      marginBottom: 8,
    },
    userInfo: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: 8,
    },
    label: {
      color: colors.textPrimary,
      fontWeight: "700",
      marginTop: 8,
      marginBottom: 4,
    },
    text: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 21,
    },
    response: {
      color: colors.primaryMedium,
      fontWeight: "600",
      fontSize: 15,
      lineHeight: 21,
    },
    pendingResponse: {
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 10,
    },
    separator: {
      color: colors.border,
      textAlign: "center",
      marginVertical: 12,
    },
    date: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 10,
    },
  });