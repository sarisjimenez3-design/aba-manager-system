import { Router } from "express";
import {
  getMe,
  getUser,
  getUsers,
  updateMe,
  createInternal,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
const router = Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 */
router.get("/me", authMiddleware, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 */
router.put("/me", authMiddleware, updateMe);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get("/:id", authMiddleware, roleMiddleware(["ADMIN"]), getUser);

/**
 * @swagger
 * /api/users/internal:
 *   post:
 *     summary: Crear usuario interno
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Usuario interno creado correctamente
 */
router.post("/internal", authMiddleware, roleMiddleware(["ADMIN"]), createInternal);
    
export default router;