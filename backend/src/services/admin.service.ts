import prisma from "../lib/prisma";

export const getDashboardSummary = async () => {
  const totalUsers = await prisma.user.count();
  const totalAthletes = await prisma.user.count({
    where: { role: "ATHLETE" },
  });
  const pendingPayments = await prisma.payment.count({
    where: { status: "PENDING" },
  });
  const overduePayments = await prisma.payment.count({
    where: { status: "OVERDUE" },
  });

  return {
    totalUsers,
    totalAthletes,
    pendingPayments,
    overduePayments,
  };
};