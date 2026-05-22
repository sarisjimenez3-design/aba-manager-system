export const validateExpoPushTokenInput = (
  body: any
): { isValid: boolean; message?: string; data?: { expoPushToken: string } } => {
  const { expoPushToken } = body;

  if (!expoPushToken) {
    return {
      isValid: false,
      message: "El token de notificación es obligatorio",
    };
  }

  if (typeof expoPushToken !== "string") {
    return {
      isValid: false,
      message: "El token de notificación debe ser texto",
    };
  }

  if (!expoPushToken.startsWith("ExponentPushToken")) {
    return {
      isValid: false,
      message: "El token de notificación no tiene un formato válido",
    };
  }

  return {
    isValid: true,
    data: {
      expoPushToken,
    },
  };
};