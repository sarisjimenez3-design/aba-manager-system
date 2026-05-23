import { api } from "../api/axios";
import { ProfileResponse } from "../types/auth.types";
import { Athlete } from "../types/user.types";
import { User } from "../types/auth.types";
import { PaginationMeta } from "../types/pagination.types";



export const getMyProfileRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: User;
  }>("/api/users/me");

  return response.data;
};

export const updateMyProfileRequest = async (payload: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: User;
  }>("/api/users/me", payload);

  return response.data;
};

export const getAthletesRequest = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Athlete[];
    meta: PaginationMeta;
  }>("/api/users/athletes", {
    params,
  });

  return response.data;
};