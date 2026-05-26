import { NextFunction, Request, Response } from "express";
import {
  createTraining,
  getTrainings,
} from "../services/training.service";
import { validateCreateTrainingInput } from "../validators/training.validator";
import { AppError } from "../utils/app-error";

export const getTrainingList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startDate = req.query.startDate
      ? String(req.query.startDate)
      : undefined;

    const endDate = req.query.endDate ? String(req.query.endDate) : undefined;

    const trainings = await getTrainings({
      startDate,
      endDate,
    });

    res.json({
      success: true,
      message: "Entrenamientos obtenidos correctamente",
      data: trainings,
    });
  } catch (error) {
    next(error);
  }
};

export const createTrainingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = validateCreateTrainingInput(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.message || "Datos inválidos", 400);
    }

    const training = await createTraining(validation.data!);

    res.status(201).json({
      success: true,
      message: "Entrenamiento creado correctamente",
      data: training,
    });
  } catch (error) {
    next(error);
  }
};