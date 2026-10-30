const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const authorizeBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ error: "ID de reserva inválido" });
    }

    // Buscar la reserva en la base de datos
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    // 404 si la reserva no existe
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Verificar si el usuario es el dueño o ADMIN
    const isOwner = req.user && req.user.id === booking.userId;
    const isAdmin = req.user && req.user.role === "ADMIN";

    // 403 si no es dueño ni ADMIN
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "No tienes permiso sobre esta reserva" });
    }

    // evita consultas repetidas
    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorizeBooking;