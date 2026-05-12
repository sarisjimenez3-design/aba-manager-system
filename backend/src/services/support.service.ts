import prisma from "../lib/prisma";

export const createSupportTicket = async (
  userId: string,
  data: { subject: string; message: string }
) => {
  return prisma.supportTicket.create({
    data: {
      userId,
      subject: data.subject,
      message: data.message,
    },
  });
};

export const getSupportTickets = async () => {
  return prisma.supportTicket.findMany({
    include: {
      user: {
        select: {
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