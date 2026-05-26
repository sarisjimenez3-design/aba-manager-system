import { NextFunction, Request, Response } from "express";
import { saveUserExpoPushToken } from "../services/notification.service";
import { validateExpoPushTokenInput } from "../validators/notification.validator";
import { sendPaymentReminderNotifications } from "../services/notification.service";
import { AppError } from "../utils/app-error";

export const saveExpoPushTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const validation = validateExpoPushTokenInput(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.message || "Datos inválidos", 400);
    }

    const user = await saveUserExpoPushToken(
      req.user.userId,
      validation.data!.expoPushToken
    );

    res.json({
      success: true,
      message: "Token de notificación guardado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const sendPaymentRemindersController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await sendPaymentReminderNotifications();

    res.json({
      success: true,
      message: "Recordatorios enviados correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};