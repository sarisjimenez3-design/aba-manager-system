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
import { useTheme } from "../../hooks/useTheme";
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
  const { colors, mode } = useTheme();
  const styles = createStyles(colors);

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
        error?.response?.data?.message ||
          "No se pudo crear el entrenamiento"
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
              key={mode}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primaryMedium,
                  selectedTextColor: "#FFFFFF",
                },
              }}
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
              }}
              theme={{
                calendarBackground: colors.card,
                selectedDayBackgroundColor: colors.primaryMedium,
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: colors.primaryMedium,
                arrowColor: colors.primaryMedium,
                monthTextColor: colors.textPrimary,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.textSecondary,
                textSectionTitleColor: colors.textSecondary,
                dotColor: colors.primaryMedium,
                selectedDotColor: "#FFFFFF",
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
              placeholderTextColor={colors.inputPlaceholder}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora. Ej: 6:00 PM"
              placeholderTextColor={colors.inputPlaceholder}
              value={hour}
              onChangeText={setHour}
              style={styles.input}
            />

            <TextInput
              placeholder="Sede o lugar"
              placeholderTextColor={colors.inputPlaceholder}
              value={place}
              onChangeText={setPlace}
              style={styles.input}
            />

            <TextInput
              placeholder="Categoría. Ej: Sub15"
              placeholderTextColor={colors.inputPlaceholder}
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />

            <TextInput
              placeholder="Nombre del entrenador"
              placeholderTextColor={colors.inputPlaceholder}
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
    selectedDateText: {
      color: colors.primaryMedium,
      fontWeight: "700",
      marginBottom: 14,
      fontSize: 15,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      color: colors.textPrimary,
    },
    cancelButton: {
      marginTop: 12,
    },
  });