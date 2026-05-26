import prisma from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { AppError } from "../utils/app-error";
import {
  generateResetToken,
  getResetTokenExpiration,
}  from "../utils/password-reset";
import { sendEmail } from "./email.service";    


export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Ya existe un usuario con ese correo", 400);
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      phone: data.phone,
      role: data.role,
    },
  });

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  /**
   * Por seguridad, no decimos si el correo existe o no.
   * Así evitamos revelar usuarios registrados.
   */
  if (!user) {
    return {
      message:
        "Si el correo existe en el sistema, recibirás instrucciones para recuperar tu contraseña",
    };
  }

  const resetToken = generateResetToken();
  const resetExpires = getResetTokenExpiration();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    },
  });

  const emailText = `
Hola ${user.firstName},

Recibimos una solicitud para recuperar tu contraseña en ABA Manager.

Usa este código/token en la aplicación:

${resetToken}

Este token vence en ${process.env.RESET_TOKEN_EXPIRES_MINUTES || 15} minutos.

Si no solicitaste este cambio, ignora este mensaje.
`;

  await sendEmail(user.email, "Recuperación de contraseña - ABA Manager", emailText);

  return {
    message:
      "Si el correo existe en el sistema, recibirás instrucciones para recuperar tu contraseña",
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Token inválido o expirado", 400);
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return {
    message: "Contraseña actualizada correctamente",
  };
};