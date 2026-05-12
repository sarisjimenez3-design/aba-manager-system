import { api } from "../api/axios";
import { Training } from "../types/training.types";

export const getTrainingsRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Training[];
  }>("/api/trainings");

  return response.data;
};

export const createTrainingRequest = async (payload: {
  title: string;
  day: string;
  hour: string;
  place: string;
  category: string;
  coachName: string;
}) => {
  const response = await api.post("/api/trainings", payload);
  return response.data;
};