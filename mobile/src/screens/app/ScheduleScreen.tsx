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
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
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
  const { colors, mode } = useTheme();
  const styles = createStyles(colors);

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
        dotColor: colors.primaryMedium,
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primaryMedium,
      selectedTextColor: "#FFFFFF",
    };

    return marks;
  }, [trainings, selectedDate, colors.primaryMedium]);

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
            key={mode} 
            markedDates={markedDates}
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

        <SectionTitle title={`Entrenamientos del ${selectedDate}`} />

        {loading ? (
          <ActivityIndicator color={colors.primaryMedium} size="large" />
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
    createButtonContainer: {
      marginBottom: 18,
    },
    title: {
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
  });