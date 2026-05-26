import { api } from "../api/axios";

export const saveExpoPushTokenRequest = async (expoPushToken: string) => {
  const response = await api.post("/api/notifications/token", {
    expoPushToken,
  });

  return response.data;
};
export const sendPaymentRemindersRequest = async () => {
  const response = await api.post("/api/notifications/payment-reminders");
  return response.data;
};