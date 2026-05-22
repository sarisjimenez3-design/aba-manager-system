import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";

export const saveUserExpoPushToken = async (
  userId: string,
  expoPushToken: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { expoPushToken },
    select: {
      id: true,
      email: true,
      expoPushToken: true,
    },
  });
};

export const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: data || {},
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new AppError("No se pudo enviar la notificación push", 500);
  }

  return response.json();
};

export const notifyUsersByRoles = async (
  roles: ("ADMIN" | "COACH" | "ATHLETE" | "PARENT")[],
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: roles,
      },
      expoPushToken: {
        not: null,
      },
    },
    select: {
      id: true,
      expoPushToken: true,
    },
  });

  const notifications = users
    .filter((user) => !!user.expoPushToken)
    .map((user) =>
      sendPushNotification(user.expoPushToken!, title, body, data)
    );

  await Promise.allSettled(notifications);
};

export const notifyOneUser = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { expoPushToken: true },
  });

  if (!user?.expoPushToken) return;

  await sendPushNotification(user.expoPushToken, title, body, data);
};

export const sendPaymentReminderNotifications = async () => {
  const payments = await prisma.payment.findMany({
    where: {
      status: {
        in: ["PENDING", "OVERDUE"],
      },
      user: {
        expoPushToken: {
          not: null,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          expoPushToken: true,
          firstName: true,
        },
      },
    },
  });

  const notifications = payments.map((payment) => {
    const isOverdue = payment.status === "OVERDUE";

    return sendPushNotification(
      payment.user.expoPushToken!,
      isOverdue ? "Pago en mora" : "Recordatorio de pago",
      isOverdue
        ? "Tienes un pago en mora pendiente por regularizar."
        : "Recuerda que tienes plazo hasta el día 5 para realizar tu pago.",
      {
        type: isOverdue ? "PAYMENT_OVERDUE" : "PAYMENT_REMINDER",
        paymentId: payment.id,
      }
    );
  });

  await Promise.allSettled(notifications);

  return {
    sent: notifications.length,
  };
};