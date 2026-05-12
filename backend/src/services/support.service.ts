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

export const getMySupportTickets = async (userId: string) => {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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

export const answerSupportTicket = async (
  ticketId: string,
  response: string
) => {
  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      response,
      status: "ANSWERED",
      respondedAt: new Date(),
    },
  });
};

