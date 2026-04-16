import { api } from "../api/axios";
import { LoginResponse, UserRole } from "../types/auth.types";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });

  console.log("AXIOS LOGIN RAW:", response.data);
  return response.data;
};

export const registerRequest = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}) => {
  const response = await api.post("/api/auth/register", payload);

  console.log("AXIOS REGISTER RAW:", response.data);
  return response.data;
};