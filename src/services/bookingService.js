const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createBooking = async ({ date, scheduleId, userId }) => {
  const parsedScheduleId = parseInt(scheduleId, 10);
  const formattedDate = String(date).trim();

  // Verificar si el horario ya está ocupado 
  const existingBooking = await prisma.booking.findFirst({
    where: {
      date: formattedDate,
      scheduleId: parsedScheduleId,
    },
  });

  if (existingBooking) {
    const error = new Error("El horario ya está ocupado");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.booking.create({
    data: {
      date: formattedDate,
      scheduleId: parsedScheduleId,
      userId: parseInt(userId, 10),
    },
    include: {
      user: true,
      schedule: true,
    },
  });
};

const getBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      user: true,
      schedule: true,
    },
  });
};

const updateBooking = async (id, { date, scheduleId }) => {
  const bookingId = parseInt(id, 10);
  const parsedScheduleId = parseInt(scheduleId, 10);
  const formattedDate = String(date).trim();

  // Verificar si el nuevo horario está ocupado por OTRA reserva 
  const existingBooking = await prisma.booking.findFirst({
    where: {
      date: formattedDate,
      scheduleId: parsedScheduleId,
      NOT: {
        id: bookingId,
      },
    },
  });

  if (existingBooking) {
    const error = new Error("El nuevo horario está ocupado por otra reserva");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: {
      date: formattedDate,
      scheduleId: parsedScheduleId,
    },
    include: {
      user: true,
      schedule: true,
    },
  });
};

const deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: { id: parseInt(id, 10) },
  });
};

module.exports = {
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
};