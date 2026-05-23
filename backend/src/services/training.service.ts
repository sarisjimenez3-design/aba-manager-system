import prisma from "../lib/prisma";

export const getTrainings = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const where =
    params?.startDate && params?.endDate
      ? {
          trainingDate: {
            gte: new Date(params.startDate),
            lte: new Date(params.endDate),
          },
        }
      : {};

  return prisma.training.findMany({
    where,
    orderBy: {
      trainingDate: "asc",
    },
  });
};

export const createTraining = async (data: {
  title: string;
  day: string;
  hour: string;
  place: string;
  category: string;
  coachName: string;
  trainingDate: string;
}) => {
  return prisma.training.create({
    data: {
      title: data.title,
      day: data.day,
      hour: data.hour,
      place: data.place,
      category: data.category,
      coachName: data.coachName,
      trainingDate: new Date(data.trainingDate),
    },
  });
};