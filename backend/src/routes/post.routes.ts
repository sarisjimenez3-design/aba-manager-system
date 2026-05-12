import { Router } from "express";
import {
  createPostController,
  getPostList,
} from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener publicaciones del club
 *     description: Retorna la lista de publicaciones institucionales visibles para usuarios autenticados.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Publicaciones obtenidas correctamente
 *       401:
 *         description: Usuario no autenticado o token inválido
 */
router.get("/", authMiddleware, getPostList);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crear una publicación institucional
 *     description: Permite crear publicaciones del club. Solo usuarios con rol ADMIN o COACH pueden usar este endpoint.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Convocatoria entrenamiento
 *               content:
 *                 type: string
 *                 example: Recuerda asistir al entrenamiento del viernes a las 6:00 p.m.
 *     responses:
 *       201:
 *         description: Publicación creada correctamente
 *       400:
 *         description: Título y contenido son obligatorios
 *       401:
 *         description: Usuario no autenticado o token inválido
 *       403:
 *         description: No tienes permisos para crear publicaciones
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "COACH"]),
  createPostController
);

export default router;