import { UserRole } from "@prisma/client";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = (
  body: any
): { isValid: boolean; message?: string; data?: RegisterInput } => {
  const { firstName, lastName, email, password, phone, role } = body;

  if (!firstName || !lastName || !email || !password || !role) {
    return {
      isValid: false,
      message:
        "Los campos firstName, lastName, email, password y role son obligatorios",
    };
  }

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string"
  ) {
    return {
      isValid: false,
      message: "Los campos enviados tienen un formato inválido",
    };
  }

  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const normalizedRole = role.trim().toUpperCase();

  const normalizedPhone =
    phone !== undefined && phone !== null ? String(phone).trim() : undefined;

  if (normalizedFirstName.length < 2) {
    return {
      isValid: false,
      message: "El nombre debe tener mínimo 2 caracteres",
    };
  }

  if (normalizedLastName.length < 2) {
    return {
      isValid: false,
      message: "El apellido debe tener mínimo 2 caracteres",
    };
  }

  if (!emailRegex.test(normalizedEmail)) {
    return {
      isValid: false,
      message: "El correo electrónico no es válido",
    };
  }

  if (normalizedPassword.length < 6) {
    return {
      isValid: false,
      message: "La contraseña debe tener mínimo 6 caracteres",
    };
  }

const publicRoles: UserRole[] = [UserRole.ATHLETE, UserRole.PARENT];

if (!publicRoles.includes(normalizedRole as UserRole)) {
  return {
    isValid: false,
    message:
      "El registro público solo permite deportistas o padres de familia",
  };
}
  if (normalizedPhone && normalizedPhone.length < 7) {
    return {
      isValid: false,
      message: "El teléfono no es válido",
    };
  }

  return {
    isValid: true,
    data: {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      password: normalizedPassword,
      phone: normalizedPhone,
      role: normalizedRole as UserRole,
    },
  };
};

export const validateLoginInput = (
  body: any
): { isValid: boolean; message?: string; data?: LoginInput } => {
  const { email, password } = body;

  if (!email || !password) {
    return {
      isValid: false,
      message: "El email y la contraseña son obligatorios",
    };
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      isValid: false,
      message: "El email o la contraseña tienen un formato inválido",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!emailRegex.test(normalizedEmail)) {
    return {
      isValid: false,
      message: "El correo electrónico no es válido",
    };
  }

  if (normalizedPassword.length < 6) {
    return {
      isValid: false,
      message: "La contraseña debe tener mínimo 6 caracteres",
    };
  }

  return {
    isValid: true,
    data: {
      email: normalizedEmail,
      password: normalizedPassword,
    },
  };
};