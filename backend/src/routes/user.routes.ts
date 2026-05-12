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
 *     description: Crea usuarios internos del club, como administradores o entrenadores. Solo puede ser usado por usuarios con rol ADMIN.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Carlos
 *               lastName:
 *                 type: string
 *                 example: Ramírez
 *               email:
 *                 type: string
 *                 example: coach@aba.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               phone:
 *                 type: string
 *                 example: "3001234567"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, COACH]
 *                 example: COACH
 *     responses:
 *       201:
 *         description: Usuario interno creado correctamente
 *       400:
 *         description: Datos inválidos o correo ya registrado
 *       401:
 *         description: Token no enviado o inválido
 *       403:
 *         description: No tiene permisos para crear usuarios internos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/internal", authMiddleware, roleMiddleware(["ADMIN"]), createInternal);
    
export default router;