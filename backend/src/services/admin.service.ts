import prisma from "../lib/prisma";

export const getDashboardSummary = async () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

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

  const totalAdmins = await prisma.user.count({
    where: { role: "ADMIN" },
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

  const rejectedPayments = await prisma.payment.count({
    where: { status: "REJECTED" },
  });

  const totalApprovedAmount = await prisma.payment.aggregate({
    where: { status: "APPROVED" },
    _sum: {
      amount: true,
    },
  });

  const monthlyIncome = await prisma.payment.aggregate({
    where: {
      status: "APPROVED",
      updatedAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const approvedToday = await prisma.payment.count({
    where: {
      status: "APPROVED",
      updatedAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  const approvedTodayAmount = await prisma.payment.aggregate({
    where: {
      status: "APPROVED",
      updatedAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const latestUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return {
    totalUsers,
    totalAthletes,
    totalParents,
    totalCoaches,
    totalAdmins,

    pendingPayments,
    overduePayments,
    approvedPayments,
    rejectedPayments,

    totalApprovedAmount: totalApprovedAmount._sum.amount || 0,
    monthlyIncome: monthlyIncome._sum.amount || 0,
    approvedToday,
    approvedTodayAmount: approvedTodayAmount._sum.amount || 0,

    paymentStatusChart: [
      {
        label: "Pendientes",
        value: pendingPayments,
      },
      {
        label: "Aprobados",
        value: approvedPayments,
      },
      {
        label: "Mora",
        value: overduePayments,
      },
      {
        label: "Rechazados",
        value: rejectedPayments,
      },
    ],

    userRoleChart: [
      {
        label: "Deportistas",
        value: totalAthletes,
      },
      {
        label: "Padres",
        value: totalParents,
      },
      {
        label: "Coaches",
        value: totalCoaches,
      },
      {
        label: "Admins",
        value: totalAdmins,
      },
    ],

    latestUsers,
  };
};