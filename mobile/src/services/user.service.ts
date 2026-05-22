import { api } from "../api/axios";
import { ProfileResponse } from "../types/auth.types";
import { Athlete } from "../types/user.types";

export const getMyProfileRequest = async () => {
  const response = await api.get<ProfileResponse>("/api/users/me");
  return response.data;
};

export const getAthletesRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Athlete[];
  }>("/api/users/athletes");

  return response.data;
};