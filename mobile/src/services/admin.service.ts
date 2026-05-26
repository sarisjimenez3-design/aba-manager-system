import { api } from "../api/axios";
import { AdminDashboard } from "../types/admin.types";

export const getAdminDashboardRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: AdminDashboard;
  }>("/api/admin/dashboard");

  return response.data;
};