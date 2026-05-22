import { api } from "../api/axios";
import { Payment, PaymentStatus } from "../types/payment.types";

export const getMyPaymentsRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Payment[];
  }>("/api/payments/me");

  return response.data;
};

export const getAllPaymentsRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Payment[];
  }>("/api/payments");

  return response.data;
};

export const updatePaymentStatusRequest = async (
  id: string,
  status: PaymentStatus
) => {
  const response = await api.patch(`/api/payments/${id}/status`, {
    status,
  });

  return response.data;
};

export const uploadPaymentProofRequest = async (
  paymentId: string,
  imageUri: string
) => {
  const formData = new FormData();

  formData.append("proof", {
    uri: imageUri,
    name: "payment-proof.jpg",
    type: "image/jpeg",
  } as any);

  const response = await api.patch(
    `/api/payments/${paymentId}/proof`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};