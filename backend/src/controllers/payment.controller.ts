import { NextFunction, Request, Response } from "express";
import {
  getAllPayments,
  createPayment,
  getMyPayments,
  updatePaymentStatus,
  uploadPaymentProof
} from "../services/payment.service";
import { AppError } from "../utils/app-error";

export const getMyPaymentList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const payments = await getMyPayments(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Pagos obtenidos correctamente",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const { amount, month, proofUrl, dueDate } = req.body;

    if (!amount || !month || !dueDate) {
      throw new AppError(
        "amount, month y dueDate son obligatorios",
        400
      );
    }

    const payment = await createPayment(req.user.userId, {
      amount: Number(amount),
      month,
      proofUrl,
      dueDate: new Date(dueDate),
    });

    res.status(201).json({
      success: true,
      message: "Pago registrado correctamente",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentList = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payments = await getAllPayments();

    res.status(200).json({
      success: true,
      message: "Pagos obtenidos correctamente",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};



export const changePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || Array.isArray(id)) {
      throw new AppError("El id del pago es obligatorio y debe ser válido", 400);
    }

    if (!["PENDING", "APPROVED", "REJECTED", "OVERDUE"].includes(status)) {
      throw new AppError("Estado de pago inválido", 400);
    }

    const payment = await updatePaymentStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Estado de pago actualizado",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProof = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Usuario no autenticado", 401);

    const paymentId = String(req.params.id);
    const userId = String(req.user.userId);
    const { proofUrl } = req.body;

    if (!proofUrl || typeof proofUrl !== "string") {
      throw new AppError("Debes enviar el comprobante", 400);
    }

    const payment = await uploadPaymentProof(
      paymentId,
      userId,
      proofUrl.trim()
    );

    res.json({
      success: true,
      message: "Comprobante enviado correctamente",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};