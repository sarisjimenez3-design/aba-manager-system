import { NextFunction, Request, Response } from "express";
import {
  createSupportTicket,
  getSupportTickets,
} from "../services/support.service";
import { AppError } from "../utils/app-error";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Usuario no autenticado", 401);

    const { subject, message } = req.body;

    if (!subject || !message) {
      throw new AppError("Asunto y mensaje son obligatorios", 400);
    }

    const ticket = await createSupportTicket(req.user.userId, {
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Solicitud enviada correctamente",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tickets = await getSupportTickets();

    res.json({
      success: true,
      message: "Solicitudes obtenidas correctamente",
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};