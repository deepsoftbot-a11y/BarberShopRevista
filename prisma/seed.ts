import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar en .env");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin creado: ${email}`);

  // Horario default: Lun-Sáb 9:00-19:00, Dom cerrado
  const defaultSchedule = [
    { weekday: 0, startMin: 540, endMin: 1140, isClosed: true },  // Dom
    { weekday: 1, startMin: 540, endMin: 1140, isClosed: false }, // Lun
    { weekday: 2, startMin: 540, endMin: 1140, isClosed: false }, // Mar
    { weekday: 3, startMin: 540, endMin: 1140, isClosed: false }, // Mié
    { weekday: 4, startMin: 540, endMin: 1140, isClosed: false }, // Jue
    { weekday: 5, startMin: 540, endMin: 1140, isClosed: false }, // Vie
    { weekday: 6, startMin: 540, endMin: 1140, isClosed: false }, // Sáb
  ];

  for (const s of defaultSchedule) {
    await prisma.weeklySchedule.upsert({
      where: { weekday: s.weekday },
      update: s,
      create: s,
    });
  }

  console.log("Horario semanal creado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
