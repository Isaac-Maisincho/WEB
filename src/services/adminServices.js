const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

const createSchedule = async (court, startTime, endTime) => {
  if (
    !isNonEmptyString(court) ||
    !isNonEmptyString(startTime) ||
    !isNonEmptyString(endTime)
  ) {
    throw new Error("court, startTime y endTime son obligatorios");
  }
  return prisma.schedule.create({
    data: {
      court: court.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
    },
  });
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: { user: true, schedule: true },
    orderBy: { id: "asc" },
  });
  // Ocultar hash de la contraseña en la respuesta
  return bookings.map(({ user, ...booking }) => {
    const { password, ...safeUser } = user;
    return { ...booking, user: safeUser };
  });
};

module.exports = { createSchedule, getAllBookings };