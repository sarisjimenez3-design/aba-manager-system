import { NextFunction, Request, Response } from "express";
import { getDashboardSummary } from "../services/admin.service";

export const getAdminDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await getDashboardSummary();

    res.json({
      success: true,
      message: "Dashboard obtenido correctamente",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};