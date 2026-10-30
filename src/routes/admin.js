const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const { addSchedule, listBookings } = require("../controllers/adminController");
 
const router = Router();
 
// authenticateToken → 401 sin token / 403 token inválido; el controlador valida el rol ADMIN (403)
router.post("/schedules", authenticateToken, addSchedule);
router.get("/bookings", authenticateToken, listBookings);
 
module.exports = router;
 