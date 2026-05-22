import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomInput from "../../components/common/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { updateMyProfileRequest } from "../../services/user.service";

export default function EditProfileScreen({ navigation }: any) {
  const { user, refreshProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert("Campos requeridos", "Nombre y apellido son obligatorios.");
        return;
      }

      if (phone.trim() && phone.trim().length < 7) {
        Alert.alert("Teléfono inválido", "El teléfono debe tener mínimo 7 caracteres.");
        return;
      }

      setLoading(true);

      await updateMyProfileRequest({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
      });

      await refreshProfile();

      Keyboard.dismiss();

      Alert.alert("Éxito", "Perfil actualizado correctamente.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
  console.log("EDIT PROFILE ERROR COMPLETO:", error);
  console.log("EDIT PROFILE RESPONSE:", error?.response?.data);
  console.log("EDIT PROFILE STATUS:", error?.response?.status);
  console.log("EDIT PROFILE MESSAGE:", error?.message);

  Alert.alert(
    "Error",
    error?.response?.data?.message || "No se pudo actualizar el perfil"
  );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Editar perfil"
          subtitle="Actualiza tu información personal"
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
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
              placeholder="Teléfono"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
            />

            <PrimaryButton
              title="Guardar cambios"
              onPress={handleSave}
              loading={loading}
            />
          </View>
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
    paddingBottom: 120,
  },
  form: {
    gap: 4,
  },
});