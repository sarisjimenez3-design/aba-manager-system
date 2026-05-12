import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtener resumen del dashboard administrativo
 *     description: Retorna indicadores generales del club como total de usuarios, deportistas, pagos pendientes y pagos en mora. Solo disponible para administradores.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard obtenido correctamente
 *       401:
 *         description: Usuario no autenticado o token inválido
 *       403:
 *         description: El usuario no tiene permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAdminDashboard
);

export default router;