import prisma from "../lib/prisma";

export const getDashboardSummary = async () => {
  const totalUsers = await prisma.user.count();

  const totalAthletes = await prisma.user.count({
    where: { role: "ATHLETE" },
  });

  const totalParents = await prisma.user.count({
    where: { role: "PARENT" },
  });

  const totalCoaches = await prisma.user.count({
    where: { role: "COACH" },
  });

  const pendingPayments = await prisma.payment.count({
    where: { status: "PENDING" },
  });

  const overduePayments = await prisma.payment.count({
    where: { status: "OVERDUE" },
  });

  const approvedPayments = await prisma.payment.count({
    where: { status: "APPROVED" },
  });

  const totalApprovedAmount = await prisma.payment.aggregate({
    where: { status: "APPROVED" },
    _sum: {
      amount: true,
    },
  });

  return {
    totalUsers,
    totalAthletes,
    totalParents,
    totalCoaches,
    pendingPayments,
    overduePayments,
    approvedPayments,
    totalApprovedAmount: totalApprovedAmount._sum.amount || 0,
  };
};