import { NextFunction, Request, Response } from "express";
import { createPost, getPosts } from "../services/post.service";
import { AppError } from "../utils/app-error";

export const getPostList = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await getPosts();

    res.json({
      success: true,
      message: "Publicaciones obtenidas correctamente",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const { title, content } = req.body;

    if (!title || !content) {
      throw new AppError("Título y contenido son obligatorios", 400);
    }

    const file = req.file;

    const imageUrl = file ? `/uploads/posts/${file.filename}` : undefined;

    const post = await createPost(req.user.userId, {
      title: String(title).trim(),
      content: String(content).trim(),
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Publicación creada correctamente",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};