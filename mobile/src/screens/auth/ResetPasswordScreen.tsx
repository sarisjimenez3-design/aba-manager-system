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
import { resetPasswordRequest } from "../../services/auth.service";

export default function ResetPasswordScreen({ navigation }: any) {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      if (!token.trim() || !newPassword.trim() || !confirmPassword.trim()) {
        Alert.alert("Campos requeridos", "Completa todos los campos.");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("Contraseña", "Las contraseñas no coinciden.");
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert("Contraseña", "La contraseña debe tener mínimo 6 caracteres.");
        return;
      }

      setLoading(true);

      const response = await resetPasswordRequest(token.trim(), newPassword.trim());

      Alert.alert("Éxito", response.message, [
        {
          text: "Iniciar sesión",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo restablecer la contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AuthHeader title="Nueva clave" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <Text style={styles.description}>
          Copia el token que recibiste en tu correo y escribe tu nueva
          contraseña.
        </Text>

        <CustomInput
          placeholder="Token de recuperación"
          value={token}
          onChangeText={setToken}
          icon="key-outline"
        />

        <CustomInput
          placeholder="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          icon="lock-closed-outline"
          secureTextEntry
        />

        <CustomInput
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          icon="lock-closed-outline"
          secureTextEntry
        />

        <PrimaryButton
          title="Restablecer contraseña"
          onPress={handleResetPassword}
          loading={loading}
        />

        <Text
          style={styles.link}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Solicitar otro token
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