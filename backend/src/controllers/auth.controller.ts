import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../validators/auth.validator";
import { AppError } from "../utils/app-error";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = validateRegisterInput(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.message || "Datos inválidos", 400);
    }

    const user = await registerUser(validation.data!);

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.message || "Datos inválidos", 400);
    }

    const result = await loginUser(validation.data!);

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};