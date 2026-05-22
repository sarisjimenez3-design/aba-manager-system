import { NextFunction, Request, Response } from "express";
import {
  getAllPayments,
  getMyPayments,
  updatePaymentStatus,
  uploadPaymentProof,
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

    res.json({
      success: true,
      message: "Pagos obtenidos correctamente",
      data: payments,
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

    res.json({
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
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      throw new AppError("El id del pago es obligatorio", 400);
    }

    const { status } = req.body;

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "OVERDUE"];

    if (!allowedStatuses.includes(status)) {
      throw new AppError("Estado de pago inválido", 400);
    }

    const payment = await updatePaymentStatus(id, status);

    res.json({
      success: true,
      message: "Estado de pago actualizado correctamente",
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
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      throw new AppError("El id del pago es obligatorio", 400);
    }

    const file = req.file;

    if (!file) {
      throw new AppError("Debes enviar una imagen del comprobante", 400);
    }

    const proofUrl = `/uploads/payment-proofs/${file.filename}`;

    const payment = await uploadPaymentProof(id, req.user.userId, proofUrl);

    res.json({
      success: true,
      message: "Comprobante enviado correctamente",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};