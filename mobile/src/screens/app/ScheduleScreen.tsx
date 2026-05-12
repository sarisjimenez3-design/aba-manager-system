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
  createTrainingRequest,
  getTrainingsRequest,
} from "../../services/training.service";
import { Training } from "../../types/training.types";

export default function ScheduleScreen() {
  const { user } = useAuth();

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState("");
  const [coachName, setCoachName] = useState("");

  const canCreateTraining = user?.role === "ADMIN" || user?.role === "COACH";

  const loadTrainings = async () => {
    try {
      const response = await getTrainingsRequest();
      setTrainings(response.data);
    } catch (error) {
      console.log("TRAININGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const handleCreateTraining = async () => {
    try {
      if (
        !title.trim() ||
        !day.trim() ||
        !hour.trim() ||
        !place.trim() ||
        !category.trim() ||
        !coachName.trim()
      ) {
        Alert.alert("Campos requeridos", "Completa todos los campos.");
        return;
      }

      setCreating(true);

      await createTrainingRequest({
        title: title.trim(),
        day: day.trim(),
        hour: hour.trim(),
        place: place.trim(),
        category: category.trim(),
        coachName: coachName.trim(),
      });

      setTitle("");
      setDay("");
      setHour("");
      setPlace("");
      setCategory("");
      setCoachName("");
      Keyboard.dismiss();

      await loadTrainings();

      Alert.alert("Éxito", "Entrenamiento creado correctamente.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo crear el entrenamiento"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Agenda" subtitle="Entrenamientos programados" />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {canCreateTraining && (
            <>
              <SectionTitle title="Crear entrenamiento" />

              <AppCard>
                <TextInput
                  placeholder="Título del entrenamiento"
                  placeholderTextColor={COLORS.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Día o frecuencia"
                  placeholderTextColor={COLORS.textSecondary}
                  value={day}
                  onChangeText={setDay}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Hora"
                  placeholderTextColor={COLORS.textSecondary}
                  value={hour}
                  onChangeText={setHour}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Sede o lugar"
                  placeholderTextColor={COLORS.textSecondary}
                  value={place}
                  onChangeText={setPlace}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Categoría"
                  placeholderTextColor={COLORS.textSecondary}
                  value={category}
                  onChangeText={setCategory}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Nombre del entrenador"
                  placeholderTextColor={COLORS.textSecondary}
                  value={coachName}
                  onChangeText={setCoachName}
                  style={styles.input}
                />

                <PrimaryButton
                  title="Guardar entrenamiento"
                  onPress={handleCreateTraining}
                  loading={creating}
                />
              </AppCard>
            </>
          )}

          <SectionTitle title="Próximos entrenamientos" />

          {loading ? (
            <ActivityIndicator color={COLORS.primaryMedium} size="large" />
          ) : trainings.length === 0 ? (
            <AppCard>
              <Text style={styles.text}>
                Aún no hay entrenamientos registrados.
              </Text>
            </AppCard>
          ) : (
            trainings.map((training) => (
              <AppCard key={training.id}>
                <Text style={styles.title}>{training.title}</Text>
                <Text style={styles.text}>Día: {training.day}</Text>
                <Text style={styles.text}>Hora: {training.hour}</Text>
                <Text style={styles.text}>Sede: {training.place}</Text>
                <Text style={styles.text}>Categoría: {training.category}</Text>
                <Text style={styles.text}>
                  Entrenador: {training.coachName}
                </Text>
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
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  title: {
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
});