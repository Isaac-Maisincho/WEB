const { createSchedule, getAllBookings } = require("../services/adminServices");
 
const isAdmin = (req) => req.user && req.user.role === "ADMIN";
 
const addSchedule = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  try {
    const { court, startTime, endTime } = req.body;
    const schedule = await createSchedule(court, startTime, endTime);
    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
 
const listBookings = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  try {
    const bookings = await getAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
 
module.exports = { addSchedule, listBookings };
 