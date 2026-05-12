import { Router } from "express";
import {
  changePaymentStatus,
  createPaymentController,
  getMyPaymentList,
  getPaymentList,
  uploadProof
} from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";


const router = Router();

/**
 * @swagger
 * /api/payments/me:
 *   get:
 *     summary: Obtener mis pagos
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pagos del usuario obtenidos correctamente
 *       401:
 *         description: Usuario no autenticado
 */
router.get("/me", authMiddleware, getMyPaymentList);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Registrar un pago
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - month
 *               - dueDate
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150000
 *               month:
 *                 type: string
 *                 example: Abril 2026
 *               proofUrl:
 *                 type: string
 *                 example: https://mi-comprobante.com/image.jpg
 *               dueDate:
 *                 type: string
 *                 example: 2026-04-30
 *     responses:
 *       201:
 *         description: Pago registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Usuario no autenticado
 */
router.post("/", authMiddleware, createPaymentController);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Obtener todos los pagos
 *     description: Endpoint disponible solo para administradores.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pagos obtenidos correctamente
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos para acceder a este recurso
 */
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getPaymentList);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   patch:
 *     summary: Cambiar estado de un pago
 *     description: Permite al administrador actualizar el estado de un pago.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED, OVERDUE]
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Estado de pago actualizado correctamente
 *       400:
 *         description: Estado de pago inválido
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: No tienes permisos para acceder a este recurso
 *       404:
 *         description: Pago no encontrado
 */
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  changePaymentStatus
);


router.patch("/:id/proof", authMiddleware, uploadProof);

export default router;