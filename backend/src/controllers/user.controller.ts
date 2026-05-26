import { NextFunction, Request, Response } from "express";
import {
  createInternalUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  updateMyProfile,
  getAthletes
} from "../services/user.service";
import { AppError } from "../utils/app-error";
import { validateUpdateProfileInput } from "../validators/user.validator";
import { validateCreateInternalUserInput } from "../validators/internal-user.validator";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const user = await getMyProfile(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Perfil obtenido correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const validation = validateUpdateProfileInput(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.message || "Datos inválidos", 400);
    }

    const updatedUser = await updateMyProfile(
      req.user.userId,
      validation.data!
    );

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError(
        "El id del usuario es obligatorio y debe ser válido",
        400
      );
    }

    const user = await getUserById(id);

    res.status(200).json({
      success: true,
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createInternal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = validateCreateInternalUserInput(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.message || "Datos inválidos", 400);
    }

    const user = await createInternalUser(validation.data!);

    res.status(201).json({
      success: true,
      message: "Usuario interno creado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAthletesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search) : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await getAthletes({
      search,
      page,
      limit,
    });

    res.json({
      success: true,
      message: "Deportistas obtenidos correctamente",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};