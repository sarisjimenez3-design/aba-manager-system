import React, { useState } from "react";
import {
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
import { Calendar, DateData } from "react-native-calendars";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { COLORS } from "../../constants/colors";
import { createTrainingRequest } from "../../services/training.service";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getDayName = (dateString: string) => {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("es-CO", {
    weekday: "long",
  });
};

export default function CreateTrainingScreen({ navigation }: any) {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [title, setTitle] = useState("");
  const [hour, setHour] = useState("");
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState("");
  const [coachName, setCoachName] = useState("");

  const [creating, setCreating] = useState(false);

  const handleCreateTraining = async () => {
    try {
      if (
        !title.trim() ||
        !hour.trim() ||
        !place.trim() ||
        !category.trim() ||
        !coachName.trim()
      ) {
        Alert.alert("Campos requeridos", "Completa todos los campos.");
        return;
      }

      setCreating(true);

      const dayName = getDayName(selectedDate);

      await createTrainingRequest({
        title: title.trim(),
        day: dayName,
        hour: hour.trim(),
        place: place.trim(),
        category: category.trim(),
        coachName: coachName.trim(),
        trainingDate: `${selectedDate}T12:00:00.000Z`,
      });

      Keyboard.dismiss();

      Alert.alert("Éxito", "Entrenamiento creado correctamente.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
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
        <ScreenHeader
          title="Crear entrenamiento"
          subtitle="Programa una nueva sesión"
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <SectionTitle title="Selecciona la fecha" />

          <AppCard>
            <Calendar
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: COLORS.primaryMedium,
                  selectedTextColor: COLORS.white,
                },
              }}
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
              }}
              theme={{
                selectedDayBackgroundColor: COLORS.primaryMedium,
                selectedDayTextColor: COLORS.white,
                todayTextColor: COLORS.primaryMedium,
                arrowColor: COLORS.primaryMedium,
                monthTextColor: COLORS.textPrimary,
                textMonthFontWeight: "700",
                textDayFontWeight: "500",
                textDayHeaderFontWeight: "700",
              }}
            />
          </AppCard>

          <SectionTitle title="Datos del entrenamiento" />

          <AppCard>
            <Text style={styles.selectedDateText}>
              Fecha seleccionada: {selectedDate}
            </Text>

            <TextInput
              placeholder="Título del entrenamiento"
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora. Ej: 6:00 PM"
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
              placeholder="Categoría. Ej: Sub15"
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

            <View style={styles.cancelButton}>
              <PrimaryButton
                title="Cancelar"
                onPress={() => navigation.goBack()}
                disabled={creating}
              />
            </View>
          </AppCard>
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
  selectedDateText: {
    color: COLORS.primaryMedium,
    fontWeight: "700",
    marginBottom: 14,
    fontSize: 15,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  cancelButton: {
    marginTop: 12,
  },
});