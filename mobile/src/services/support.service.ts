import { api } from "../api/axios";
import { SupportTicket } from "../types/support.types";

export const createSupportTicketRequest = async (payload: {
  subject: string;
  message: string;
}) => {
  const response = await api.post("/api/support", payload);
  return response.data;
};

export const getMySupportTicketsRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: SupportTicket[];
  }>("/api/support/me");

  return response.data;
};

export const getSupportTicketsRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: SupportTicket[];
  }>("/api/support");

  return response.data;
};

export const answerSupportTicketRequest = async (
  id: string,
  response: string
) => {
  const result = await api.patch(`/api/support/${id}/answer`, {
    response,
  });

  return result.data;
};

export const deleteSupportTicketRequest = async (id: string) => {
  const response = await api.delete(`/api/support/${id}`);
  return response.data;
};