import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import CustomInput from "../../components/common/CustomInput";
import { COLORS } from "../../constants/colors";
import { registerRequest } from "../../services/auth.service";
import { UserRole } from "../../types/auth.types";

const availableRoles: UserRole[] = ["ATHLETE", "PARENT"];

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("ATHLETE");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        Alert.alert(
          "Campos requeridos",
          "Completa todos los campos obligatorios"
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Contraseña", "Las contraseñas no coinciden");
        return;
      }

      setLoading(true);

      await registerRequest({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
        role,
      });

      Alert.alert("Éxito", "Usuario registrado correctamente", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo registrar el usuario";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AuthHeader title="Crear Cuenta" />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomInput
          placeholder="Nombre"
          value={firstName}
          onChangeText={setFirstName}
          icon="person-outline"
        />

        <CustomInput
          placeholder="Apellido"
          value={lastName}
          onChangeText={setLastName}
          icon="person-outline"
        />

        <CustomInput
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />

        <CustomInput
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
          icon="call-outline"
        />

        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
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

        <Text style={styles.roleLabel}>Selecciona el tipo de cuenta</Text>

        <View style={styles.rolesContainer}>
          {availableRoles.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.roleChip,
                role === item && styles.roleChipSelected,
              ]}
              onPress={() => setRole(item)}
            >
              <Text
                style={[
                  styles.roleChipText,
                  role === item && styles.roleChipTextSelected,
                ]}
              >
                {item === "ATHLETE" ? "Deportista" : "Padre de familia"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title="Registrarse"
          onPress={handleRegister}
          loading={loading}
        />

        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            Iniciar Sesión
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  roleChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  roleChipSelected: {
    backgroundColor: COLORS.primaryMedium,
    borderColor: COLORS.primaryMedium,
  },
  roleChipText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  roleChipTextSelected: {
    color: COLORS.white,
  },
  loginText: {
    textAlign: "center",
    marginTop: 22,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primaryMedium,
    fontWeight: "600",
  },
});