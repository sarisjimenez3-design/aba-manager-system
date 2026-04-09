export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePhoto?: string;
}

export const validateUpdateProfileInput = (
  body: any
): { isValid: boolean; message?: string; data?: UpdateProfileInput } => {
  const { firstName, lastName, phone, profilePhoto } = body;

  if (
    firstName === undefined &&
    lastName === undefined &&
    phone === undefined &&
    profilePhoto === undefined
  ) {
    return {
      isValid: false,
      message: "Debes enviar al menos un campo para actualizar",
    };
  }

  if (firstName !== undefined && typeof firstName !== "string") {
    return {
      isValid: false,
      message: "El nombre debe ser texto",
    };
  }

  if (lastName !== undefined && typeof lastName !== "string") {
    return {
      isValid: false,
      message: "El apellido debe ser texto",
    };
  }

  if (phone !== undefined && typeof phone !== "string") {
    return {
      isValid: false,
      message: "El teléfono debe ser texto",
    };
  }

  if (profilePhoto !== undefined && typeof profilePhoto !== "string") {
    return {
      isValid: false,
      message: "La foto de perfil debe ser texto",
    };
  }

  const cleanData: UpdateProfileInput = {};

  if (firstName !== undefined) {
    const value = firstName.trim();
    if (value.length < 2) {
      return {
        isValid: false,
        message: "El nombre debe tener mínimo 2 caracteres",
      };
    }
    cleanData.firstName = value;
  }

  if (lastName !== undefined) {
    const value = lastName.trim();
    if (value.length < 2) {
      return {
        isValid: false,
        message: "El apellido debe tener mínimo 2 caracteres",
      };
    }
    cleanData.lastName = value;
  }

  if (phone !== undefined) {
    const value = phone.trim();
    if (value.length < 7) {
      return {
        isValid: false,
        message: "El teléfono no es válido",
      };
    }
    cleanData.phone = value;
  }

  if (profilePhoto !== undefined) {
    cleanData.profilePhoto = profilePhoto.trim();
  }

  return {
    isValid: true,
    data: cleanData,
  };
};