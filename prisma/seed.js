require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const saltRounds = 10;

async function main() {
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();
// Usuarios 
  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: await bcrypt.hash("admin123", saltRounds),
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Pedro Isaac Maisincho Paucar",
      email: "pimaisincho@espe.edu.ec",
      password: await bcrypt.hash("miPassword123", saltRounds),
      role: "USER",
    },
  });

// variante dígito 8
  const schedule1 = await prisma.schedule.create({
    data: { court: "Fútbol 4", startTime: "08:00", endTime: "10:00" },
  });

  const schedule2 = await prisma.schedule.create({
    data: { court: "Básquet 4", startTime: "10:00", endTime: "12:00" },
  });

  // 4) Reservas (fecha de la variante) vinculadas con connect
  const booking1 = await prisma.booking.create({
    data: {
      date: "2026-11-20",
      user: { connect: { id: user.id } },
      schedule: { connect: { id: schedule1.id } },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      date: "2026-11-20",
      user: { connect: { id: user.id } },
      schedule: { connect: { id: schedule2.id } },
    },
  });

  console.log("Seed completado:");
  console.log(`  Admin:    ${admin.email} (id ${admin.id})`);
  console.log(`  Usuario:  ${user.email} (id ${user.id})`);
  console.log(
    `  Horarios: ${schedule1.court} ${schedule1.startTime}-${schedule1.endTime} | ` +
      `${schedule2.court} ${schedule2.startTime}-${schedule2.endTime}`,
  );
  console.log(`  Reservas: #${booking1.id}, #${booking2.id} (${booking1.date})`);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });