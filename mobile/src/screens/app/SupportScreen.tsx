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
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import {
  answerSupportTicketRequest,
  createSupportTicketRequest,
  getMySupportTicketsRequest,
  getSupportTicketsRequest,
} from "../../services/support.service";
import { SupportTicket } from "../../types/support.types";

export default function SupportScreen() {
  const { user } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const [sending, setSending] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [answeringId, setAnsweringId] = useState<string | null>(null);

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
                placeholderTextColor={COLORS.textSecondary}
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
            <ActivityIndicator color={COLORS.primaryMedium} size="large" />
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
                      placeholderTextColor={COLORS.textSecondary}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 18,
    paddingBottom: 130,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    height: 130,
    textAlignVertical: "top",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  answerInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
    marginTop: 12,
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  status: {
    color: COLORS.primaryMedium,
    fontWeight: "600",
    marginBottom: 8,
  },
  label: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  response: {
    color: COLORS.primaryMedium,
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 21,
  },
  pendingResponse: {
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 10,
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 10,
  },
});