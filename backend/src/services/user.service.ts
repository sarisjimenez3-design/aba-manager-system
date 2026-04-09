import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";
import { UpdateProfileInput } from "../validators/user.validator";

export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profilePhoto: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
};

export const updateMyProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profilePhoto: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profilePhoto: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profilePhoto: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
};