import { NextFunction, Request, Response } from "express";
import { createTraining, getTrainings } from "../services/training.service";

export const getTrainingList = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trainings = await getTrainings();

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
    const training = await createTraining(req.body);

    res.status(201).json({
      success: true,
      message: "Entrenamiento creado correctamente",
      data: training,
    });
  } catch (error) {
    next(error);
  }
};