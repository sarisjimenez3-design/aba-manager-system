import prisma from "../lib/prisma";

export const getTrainings = async () => {
  return prisma.training.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createTraining = async (data: {
  title: string;
  day: string;
  hour: string;
  place: string;
  category: string;
  coachName: string;
}) => {
  return prisma.training.create({ data });
};