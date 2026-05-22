import { Router } from "express";
import {
  changePaymentStatus,
  getMyPaymentList,
  getPaymentList,
  uploadProof,
} from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { uploadPaymentProofImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/me", authMiddleware, getMyPaymentList);

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getPaymentList);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  changePaymentStatus
);

router.patch(
  "/:id/proof",
  authMiddleware,
  uploadPaymentProofImage.single("proof"),
  uploadProof
);

export default router;