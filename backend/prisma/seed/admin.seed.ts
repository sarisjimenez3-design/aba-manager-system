import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log("🌱 Iniciando seed de administrador...");

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: "admin@aba.com",
      },
    });

    if (existingAdmin) {
      console.log("✅ El administrador ya existe.");
      return;
    }

    const passwordHash = await bcrypt.hash("123456", 10);

    const admin = await prisma.user.create({
      data: {
        firstName: "Administrador",
        lastName: "ABA",
        email: "admin@aba.com",
        passwordHash,
        phone: "3000000000",
        role: UserRole.ADMIN,
      },
    });

    console.log("✅ Administrador creado correctamente.");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", "123456");
  } catch (error) {
    console.error("Error ejecutando seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();