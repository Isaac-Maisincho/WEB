const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");
const {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = Router();

// Exigir token JWT en todas las rutas de reservas
router.use(authenticateToken);

router.post("/", createBooking);
router.get("/:id", authorizeBooking, getBooking);
router.put("/:id", authorizeBooking, updateBooking);
router.delete("/:id", authorizeBooking, deleteBooking);

module.exports = router;