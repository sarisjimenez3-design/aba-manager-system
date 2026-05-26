import { Router } from "express";
import { createTicket, getTickets, answerTicket, getMyTickets, deleteTicket } from "../controllers/support.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";


const router = Router();
/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Gestión de soporte y solicitudes
 */

/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Crear una solicitud de soporte
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Problema con el pago
 *               message:
 *                 type: string
 *                 example: Realicé el pago pero aún aparece pendiente.
 *     responses:
 *       201:
 *         description: Solicitud enviada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Usuario no autenticado
 */

router.post("/", authMiddleware, createTicket);

router.get("/me", authMiddleware, getMyTickets);

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Obtener todas las solicitudes de soporte
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitudes obtenidas correctamente
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Acceso denegado
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "COACH"]),
  getTickets
);



router.patch(
  "/:id/answer",
  authMiddleware,
  roleMiddleware(["ADMIN", "COACH"]),
  answerTicket
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "COACH"]),
  deleteTicket
);
export default router;