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
import { createPostRequest, getPostsRequest } from "../../services/post.service";
import { getMyPaymentsRequest } from "../../services/payment.service";
import { Post } from "../../types/post.types";
import { Payment } from "../../types/payment.types";
import { getImageUrl } from "../../utils/getImageUrl";

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [creatingPost, setCreatingPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const pickPostImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a tus imágenes.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
        imageUri: selectedImage || undefined,
      });

      setTitle("");
      setContent("");
      setSelectedImage(null);
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
                      style={
                        activePayment.status === "OVERDUE"
                          ? styles.dangerText
                          : styles.warning
                      }
                    >
                      {activePayment.status === "OVERDUE"
                        ? "En mora"
                        : activePayment.status === "PENDING"
                        ? "Pendiente"
                        : activePayment.status}
                    </Text>

                    <Text style={styles.text}>Mes: {activePayment.month}</Text>

                    <Text style={styles.text}>
                      Valor: ${activePayment.amount.toLocaleString("es-CO")} COP
                    </Text>

                    <Text style={styles.text}>
                      Fecha límite:{" "}
                      {new Date(activePayment.dueDate).toLocaleDateString(
                        "es-CO"
                      )}
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
            </>
          )}

          {isCoach && (
            <>
              <SectionTitle title="Panel entrenador" />

              <AppCard>
                <Text style={styles.cardTitle}>Gestión deportiva</Text>
                <Text style={styles.text}>
                  Puedes crear publicaciones, revisar soporte y gestionar la
                  agenda de entrenamientos.
                </Text>
              </AppCard>
            </>
          )}

          {isAdmin && (
            <>
              <SectionTitle title="Resumen administrativo" />

              <AppCard>
                <Text style={styles.cardTitle}>Panel administrativo</Text>
                <Text style={styles.text}>
                  Puedes gestionar pagos, soporte, publicaciones, deportistas y
                  entrenamientos desde las secciones principales.
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
                  placeholderTextColor={colors.inputPlaceholder}
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Contenido"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  style={styles.textArea}
                />

                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : null}

                <PrimaryButton
                  title={selectedImage ? "Cambiar imagen" : "Agregar imagen"}
                  onPress={pickPostImage}
                />

                <View style={styles.buttonSpacing} />

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
            <ActivityIndicator color={colors.primaryMedium} size="large" />
          ) : posts.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>Aún no hay publicaciones.</Text>
            </AppCard>
          ) : (
            posts.map((post) => {
              const imageUri = getImageUrl(post.imageUrl);

              return (
                <AppCard key={post.id}>
                  <View style={styles.postHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {post.author?.firstName?.charAt(0).toUpperCase() ||
                          "A"}
                      </Text>
                    </View>

                    <View style={styles.postHeaderInfo}>
                      <Text style={styles.authorName}>
                        {post.author
                          ? `${post.author.firstName} ${post.author.lastName}`
                          : "Club ABA"}
                      </Text>

                      <Text style={styles.postDate}>
                        {new Date(post.createdAt).toLocaleDateString(
                          "es-CO"
                        )}{" "}
                        · {post.author?.role || "CLUB"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent}>{post.content}</Text>

                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  ) : null}
                </AppCard>
              );
            })
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
    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    text: {
      color: colors.textSecondary,
      fontSize: 15,
      marginBottom: 4,
      lineHeight: 21,
    },
    warning: {
      color: colors.warning,
      fontWeight: "700",
      fontSize: 16,
      marginBottom: 8,
    },
    dangerText: {
      color: colors.danger,
      fontWeight: "700",
      fontSize: 16,
      marginBottom: 8,
    },
    successText: {
      color: colors.success,
      fontWeight: "700",
      fontSize: 16,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      color: colors.textPrimary,
    },
    textArea: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 14,
      height: 100,
      textAlignVertical: "top",
      color: colors.textPrimary,
    },
    previewImage: {
      width: "100%",
      height: 180,
      borderRadius: 14,
      marginBottom: 12,
    },
    buttonSpacing: {
      height: 10,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primaryDark,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    avatarText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 18,
    },
    postHeaderInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    postDate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    postTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    postContent: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 21,
      marginBottom: 12,
    },
    postImage: {
      width: "100%",
      height: 220,
      borderRadius: 16,
      marginTop: 6,
    },
  });