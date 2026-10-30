const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      userId: parseInt(userId, 10),
    },
    include: {
      schedule: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

module.exports = {
  getUserBookings,
};