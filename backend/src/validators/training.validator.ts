export interface CreateTrainingInput {
  title: string;
  day: string;
  hour: string;
  place: string;
  category: string;
  coachName: string;
  trainingDate: string;
}

export const validateCreateTrainingInput = (
  body: any
): { isValid: boolean; message?: string; data?: CreateTrainingInput } => {
  const { title, day, hour, place, category, coachName, trainingDate } = body;

  if (
    !title ||
    !day ||
    !hour ||
    !place ||
    !category ||
    !coachName ||
    !trainingDate
  ) {
    return {
      isValid: false,
      message:
        "Los campos title, day, hour, place, category, coachName y trainingDate son obligatorios",
    };
  }

  if (
    typeof title !== "string" ||
    typeof day !== "string" ||
    typeof hour !== "string" ||
    typeof place !== "string" ||
    typeof category !== "string" ||
    typeof coachName !== "string" ||
    typeof trainingDate !== "string"
  ) {
    return {
      isValid: false,
      message: "Los campos enviados tienen un formato inválido",
    };
  }

  const parsedDate = new Date(trainingDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      isValid: false,
      message: "La fecha del entrenamiento no es válida",
    };
  }

  return {
    isValid: true,
    data: {
      title: title.trim(),
      day: day.trim(),
      hour: hour.trim(),
      place: place.trim(),
      category: category.trim(),
      coachName: coachName.trim(),
      trainingDate,
    },
  };
};