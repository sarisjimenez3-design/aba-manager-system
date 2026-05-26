import { Router } from "express";
import { saveExpoPushTokenController, sendPaymentRemindersController } from "../controllers/notification.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/token", authMiddleware, saveExpoPushTokenController);
router.post(
  "/payment-reminders",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  sendPaymentRemindersController
);
export default router;