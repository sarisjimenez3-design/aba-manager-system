import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";

export const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createPayment = async (
  userId: string,
  data: {
    amount: number;
    month: string;
    proofUrl?: string;
    dueDate: Date;
  }
) => {
  return prisma.payment.create({
    data: {
      userId,
      amount: data.amount,
      month: data.month,
      proofUrl: data.proofUrl,
      dueDate: data.dueDate,
      status: "PENDING",
    },
  });
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "OVERDUE"
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new AppError("Pago no encontrado", 404);
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: { status },
  });
};