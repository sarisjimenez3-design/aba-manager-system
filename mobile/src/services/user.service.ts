import { api } from "../api/axios";
import { ProfileResponse } from "../types/auth.types";

export const getMyProfileRequest = async () => {
  const response = await api.get<ProfileResponse>("/api/users/me");
  return response.data;
};