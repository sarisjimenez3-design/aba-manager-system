import { Router } from "express";
import {
  createTrainingController,
  getTrainingList,
} from "../controllers/training.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/trainings:
 *   get:
 *     summary: Obtener lista de entrenamientos
 *     tags:
 *       - Trainings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Entrenamientos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Entrenamientos obtenidos correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1a2b3c
 *                       title:
 *                         type: string
 *                         example: Entrenamiento U15
 *                       day:
 *                         type: string
 *                         example: Lunes y miércoles
 *                       hour:
 *                         type: string
 *                         example: 6:00 p.m.
 *                       place:
 *                         type: string
 *                         example: Coliseo Iván de Bedout
 *                       category:
 *                         type: string
 *                         example: U15
 *                       coachName:
 *                         type: string
 *                         example: Coach Juan
 */
router.get("/", authMiddleware, getTrainingList);

/**
 * @swagger
 * /api/trainings:
 *   post:
 *     summary: Crear entrenamiento
 *     tags:
 *       - Trainings
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
 *               - day
 *               - hour
 *               - place
 *               - category
 *               - coachName
 *             properties:
 *               title:
 *                 type: string
 *                 example: Entrenamiento U17
 *               day:
 *                 type: string
 *                 example: Martes y jueves
 *               hour:
 *                 type: string
 *                 example: 5:30 p.m.
 *               place:
 *                 type: string
 *                 example: Sede Robledo
 *               category:
 *                 type: string
 *                 example: U17
 *               coachName:
 *                 type: string
 *                 example: Coach Carlos
 *     responses:
 *       201:
 *         description: Entrenamiento creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "COACH"]),
  createTrainingController
);

export default router;