import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";

const MONTHLY_AMOUNT = 150000;

const getCurrentMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const getCurrentMonthDueDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 5, 23, 59, 59);
};

export const ensureCurrentMonthPayment = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (user.role !== "ATHLETE" && user.role !== "PARENT") {
    return null;
  }

  const month = getCurrentMonthKey();
  const dueDate = getCurrentMonthDueDate();

  const existingPayment = await prisma.payment.findFirst({
    where: {
      userId,
      month,
    },
  });

  if (!existingPayment) {
    return prisma.payment.create({
      data: {
        userId,
        amount: MONTHLY_AMOUNT,
        month,
        dueDate,
        status: new Date() > dueDate ? "OVERDUE" : "PENDING",
      },
    });
  }

  if (
    existingPayment.status === "PENDING" &&
    !existingPayment.proofUrl &&
    new Date() > existingPayment.dueDate
  ) {
    return prisma.payment.update({
      where: { id: existingPayment.id },
      data: { status: "OVERDUE" },
    });
  }

  return existingPayment;
};

export const getMyPayments = async (userId: string) => {
  await ensureCurrentMonthPayment(userId);

  return prisma.payment.findMany({
    where: {
      userId,
      status: {
        not: "APPROVED",
      },
    },
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
          phone: true,
          role: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
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

  if (payment.status === "APPROVED") {
    throw new AppError("Este pago ya fue aprobado y no puede modificarse", 400);
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: { status },
  });
};

export const uploadPaymentProof = async (
  paymentId: string,
  userId: string,
  proofUrl: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new AppError("Pago no encontrado", 404);
  }

  if (payment.userId !== userId) {
    throw new AppError("No puedes subir comprobante para este pago", 403);
  }

  if (payment.status === "APPROVED") {
    throw new AppError("Este pago ya fue aprobado", 400);
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      proofUrl,
      status: "PENDING",
    },
  });
};