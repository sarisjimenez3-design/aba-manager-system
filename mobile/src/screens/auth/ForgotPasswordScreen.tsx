import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import CustomInput from "../../components/common/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { COLORS } from "../../constants/colors";
import { forgotPasswordRequest } from "../../services/auth.service";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      if (!email.trim()) {
        Alert.alert("Campo requerido", "Ingresa tu correo electrónico.");
        return;
      }

      setLoading(true);

      const response = await forgotPasswordRequest(email.trim().toLowerCase());

      Alert.alert("Revisa tu correo", response.message, [
        {
          text: "Continuar",
          onPress: () => navigation.navigate("ResetPassword"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo solicitar la recuperación"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AuthHeader title="Recuperar" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <Text style={styles.description}>
          Escribe el correo asociado a tu cuenta. Te enviaremos un token para
          restablecer tu contraseña.
        </Text>

        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />

        <PrimaryButton
          title="Enviar instrucciones"
          onPress={handleForgotPassword}
          loading={loading}
        />

        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Volver al inicio de sesión
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  link: {
    color: COLORS.primaryMedium,
    textAlign: "center",
    marginTop: 22,
    fontWeight: "600",
  },
});