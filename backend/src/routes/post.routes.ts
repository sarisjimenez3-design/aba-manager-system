import { Router } from "express";
import {
  createPostController,
  getPostList,
} from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { uploadPostImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", authMiddleware, getPostList);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "COACH"]),
  uploadPostImage.single("image"),
  createPostController
);

export default router;