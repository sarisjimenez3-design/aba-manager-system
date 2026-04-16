import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import CustomInput from "../../components/common/CustomInput";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";


export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Campos requeridos", "Debes ingresar correo y contraseña");
        return;
      }

      setLoading(true);
      await signIn(email.trim(), password.trim());
    } catch (error: any) {
      console.log("LOGIN SCREEN ERROR:", error);
      Alert.alert("Error", error.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <View style={styles.screen}>
      <AuthHeader title="Inicio Sesión" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <CustomInput
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />

        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          icon="lock-closed-outline"
          secureTextEntry
        />

        <PrimaryButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
        />

        <View style={{ height: 12 }} />

        

        <TouchableOpacity style={styles.link}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Regístrate
          </Text>
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
  link: {
    marginTop: 18,
    alignItems: "center",
  },
  forgotText: {
    color: COLORS.primaryMedium,
    fontSize: 14,
  },
  divider: {
    marginTop: 20,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  registerText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primaryMedium,
    fontWeight: "600",
  },
});