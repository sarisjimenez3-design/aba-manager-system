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
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { createPostRequest, getPostsRequest } from "../../services/post.service";
import { getMyPaymentsRequest } from "../../services/payment.service";
import { Post } from "../../types/post.types";
import { Payment } from "../../types/payment.types";

export default function HomeScreen() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);

  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isCoach = user?.role === "COACH";
  const isAdmin = user?.role === "ADMIN";
  const isPublicUser = user?.role === "ATHLETE" || user?.role === "PARENT";
  const canCreatePost = isAdmin || isCoach;

  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await getPostsRequest();
      setPosts(response.data);
    } catch (error) {
      console.log("HOME POSTS ERROR:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadActivePayment = async () => {
    try {
      if (!isPublicUser) return;

      setLoadingPayment(true);

      const response = await getMyPaymentsRequest();
      setActivePayment(response.data[0] || null);
    } catch (error) {
      console.log("HOME PAYMENT ERROR:", error);
    } finally {
      setLoadingPayment(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadActivePayment();
  }, [user?.role]);

  const handleCreatePost = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        Alert.alert("Campos requeridos", "Escribe título y contenido.");
        return;
      }

      setCreatingPost(true);

      await createPostRequest({
        title: title.trim(),
        content: content.trim(),
      });

      setTitle("");
      setContent("");
      Keyboard.dismiss();

      await loadPosts();

      Alert.alert("Éxito", "Publicación creada correctamente");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo crear la publicación"
      );
    } finally {
      setCreatingPost(false);
    }
  };

  const getPaymentStatusLabel = () => {
    if (!activePayment) return "";

    if (activePayment.status === "OVERDUE") return "En mora";
    if (activePayment.status === "PENDING") return "Pendiente";
    if (activePayment.status === "REJECTED") return "Rechazado";
    if (activePayment.status === "APPROVED") return "Aprobado";

    return activePayment.status;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title={`Hola, ${user?.firstName || "ABA"}`}
          subtitle="Bienvenido a ABA Manager"
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {isPublicUser && (
            <>
              <SectionTitle title="Resumen" />

              <AppCard>
                <Text style={styles.cardTitle}>Estado de pago</Text>

                {loadingPayment ? (
                  <Text style={styles.text}>Cargando estado de pago...</Text>
                ) : activePayment ? (
                  <>
                    <Text
                      style={[
                        styles.paymentStatus,
                        activePayment.status === "OVERDUE" &&
                          styles.paymentOverdue,
                        activePayment.status === "REJECTED" &&
                          styles.paymentRejected,
                      ]}
                    >
                      {getPaymentStatusLabel()}
                    </Text>

                    <Text style={styles.text}>Mes: {activePayment.month}</Text>
                    <Text style={styles.text}>
                      Valor: ${activePayment.amount} COP
                    </Text>
                    <Text style={styles.text}>
                      Fecha límite:{" "}
                      {new Date(activePayment.dueDate).toLocaleDateString()}
                    </Text>

                    {activePayment.proofUrl ? (
                      <Text style={styles.text}>
                        Comprobante enviado, pendiente de aprobación.
                      </Text>
                    ) : (
                      <Text style={styles.text}>
                        Recuerda subir tu comprobante en la sección Pagos.
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.successText}>
                      No tienes pagos pendientes
                    </Text>
                    <Text style={styles.text}>Tu mensualidad está al día.</Text>
                  </>
                )}
              </AppCard>

              <AppCard>
                <Text style={styles.cardTitle}>Próximo entrenamiento</Text>
                <Text style={styles.text}>
                  Revisa la sección Agenda para consultar los horarios activos.
                </Text>
              </AppCard>
            </>
          )}

          {isCoach && (
            <>
              <SectionTitle title="Panel entrenador" />

              <AppCard>
                <Text style={styles.cardTitle}>Gestión deportiva</Text>
                <Text style={styles.text}>
                  Puedes revisar la agenda, crear entrenamientos y publicar
                  novedades para los deportistas.
                </Text>
              </AppCard>
            </>
          )}

          {isAdmin && (
            <>
              <SectionTitle title="Panel administrativo" />

              <AppCard>
                <Text style={styles.cardTitle}>Resumen general</Text>
                <Text style={styles.text}>
                  Revisa el panel Admin para ver usuarios, pagos pendientes,
                  pagos aprobados e ingresos reales del club.
                </Text>
              </AppCard>
            </>
          )}

          {canCreatePost && (
            <>
              <SectionTitle title="Crear publicación" />

              <AppCard>
                <TextInput
                  placeholder="Título"
                  placeholderTextColor={COLORS.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Contenido"
                  placeholderTextColor={COLORS.textSecondary}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  style={styles.textArea}
                />

                <PrimaryButton
                  title="Publicar"
                  onPress={handleCreatePost}
                  loading={creatingPost}
                />
              </AppCard>
            </>
          )}

          <SectionTitle title="Publicaciones del club" />

          {loadingPosts ? (
            <ActivityIndicator color={COLORS.primaryMedium} size="large" />
          ) : posts.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>Aún no hay publicaciones.</Text>
            </AppCard>
          ) : (
            posts.map((post) => (
              <AppCard key={post.id}>
                <Text style={styles.cardTitle}>{post.title}</Text>

                <Text style={styles.meta}>
                  {post.author
                    ? `${post.author.firstName} ${post.author.lastName} · ${post.author.role}`
                    : "Club ABA"}
                </Text>

                <Text style={styles.text}>{post.content}</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 4,
    lineHeight: 21,
  },
  paymentStatus: {
    color: COLORS.warning,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  paymentOverdue: {
    color: COLORS.danger,
  },
  paymentRejected: {
    color: COLORS.danger,
  },
  successText: {
    color: COLORS.success,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    height: 100,
    textAlignVertical: "top",
    color: COLORS.textPrimary,
  },
  meta: {
    color: COLORS.primaryMedium,
    fontSize: 13,
    marginBottom: 8,
  },
});