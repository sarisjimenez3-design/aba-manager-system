import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../validators/auth.validator";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateRegisterInput(req.body);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    const user = await registerUser(validation.data!);

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al registrar usuario";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.message,
      });
      return;
    }

    const result = await loginUser(validation.data!);

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al iniciar sesión";

    res.status(401).json({
      success: false,
      message,
    });
  }
};