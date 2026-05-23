import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar, DateData } from "react-native-calendars";
import AppCard from "../../components/common/AppCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionTitle from "../../components/common/SectionTitle";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { getTrainingsRequest } from "../../services/training.service";
import { Training } from "../../types/training.types";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getDateKey = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

export default function ScheduleScreen({ navigation }: any) {
  const { user } = useAuth();

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(true);

  const canCreateTraining = user?.role === "ADMIN" || user?.role === "COACH";

  const loadTrainings = async () => {
    try {
      setLoading(true);

      const response = await getTrainingsRequest();
      setTrainings(response.data);
    } catch (error) {
      console.log("TRAININGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrainings();
    }, [])
  );

  const trainingsForSelectedDate = trainings.filter((training) => {
    if (!training.trainingDate) return false;

    return getDateKey(training.trainingDate) === selectedDate;
  });

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    trainings.forEach((training) => {
      if (!training.trainingDate) return;

      const dateKey = getDateKey(training.trainingDate);

      marks[dateKey] = {
        marked: true,
        dotColor: COLORS.primaryMedium,
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: COLORS.primaryMedium,
      selectedTextColor: COLORS.white,
    };

    return marks;
  }, [trainings, selectedDate]);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Agenda" subtitle="Calendario de entrenamientos" />

      <ScrollView contentContainerStyle={styles.content}>
        {canCreateTraining && (
          <View style={styles.createButtonContainer}>
            <PrimaryButton
              title="Crear entrenamiento"
              onPress={() => navigation.navigate("CreateTraining")}
            />
          </View>
        )}

        <SectionTitle title="Calendario" />

        <AppCard>
          <Calendar
            markedDates={markedDates}
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

        <SectionTitle title={`Entrenamientos del ${selectedDate}`} />

        {loading ? (
          <ActivityIndicator color={COLORS.primaryMedium} size="large" />
        ) : trainingsForSelectedDate.length === 0 ? (
          <AppCard>
            <Text style={styles.text}>
              No hay entrenamientos programados para esta fecha.
            </Text>
          </AppCard>
        ) : (
          trainingsForSelectedDate.map((training) => (
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
    </View>
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
  createButtonContainer: {
    marginBottom: 18,
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