import { UserRole } from "@prisma/client";

export interface CreateInternalUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCreateInternalUserInput = (
  body: any
): { isValid: boolean; message?: string; data?: CreateInternalUserInput } => {
  const { firstName, lastName, email, password, phone, role } = body;

  if (!firstName || !lastName || !email || !password || !role) {
    return {
      isValid: false,
      message: "Todos los campos obligatorios deben ser enviados",
    };
  }

  const normalizedRole = String(role).trim().toUpperCase();

  const internalRoles: UserRole[] = [UserRole.ADMIN, UserRole.COACH];

  if (!internalRoles.includes(normalizedRole as UserRole)) {
    return {
      isValid: false,
      message: "Solo se pueden crear usuarios internos ADMIN o COACH",
    };
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) {
    return {
      isValid: false,
      message: "El correo electrónico no es válido",
    };
  }

  if (String(password).trim().length < 6) {
    return {
      isValid: false,
      message: "La contraseña debe tener mínimo 6 caracteres",
    };
  }

  return {
    isValid: true,
    data: {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      password: String(password).trim(),
      phone: phone ? String(phone).trim() : undefined,
      role: normalizedRole as UserRole,
    },
  };
};