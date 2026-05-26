import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma";
import { AppError } from "../utils/app-error";
import { hashPassword } from "../utils/hash";
import { CreateInternalUserInput } from "../validators/internal-user.validator";
import { UpdateProfileInput } from "../validators/user.validator";

interface CreateUserByAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

const userPublicSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userPublicSelect,
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
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: userPublicSelect,
  });

  return updatedUser;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: userPublicSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
};

export const createUserByAdmin = async (data: CreateUserByAdminInput) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError("Ya existe un usuario con ese correo", 400);
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: data.phone?.trim(),
      role: data.role,
    },
    select: userPublicSelect,
  });

  return user;
};

export const createInternalUser = async (data: CreateInternalUserInput) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError("Ya existe un usuario con ese correo", 400);
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: data.phone?.trim(),
      role: data.role,
    },
    select: userPublicSelect,
  });

  return user;
};

export const getAthletes = async (params: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const search = params.search?.trim();

  const where = {
    role: "ATHLETE" as const,
    ...(search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [athletes, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);

  return {
    data: athletes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};