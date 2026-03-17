import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/test-users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      ok: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error consultando usuarios",
    });
  }
});

export default router;