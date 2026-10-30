const bookingService = require("../services/bookingService");

const createBooking = async (req, res, next) => {
  try {
    const { date, scheduleId } = req.body;
    if (!date || !scheduleId) {
      return res.status(400).json({ error: "date y scheduleId son obligatorios" });
    }

    const userId = req.user.id;
    const booking = await bookingService.createBooking({ date, scheduleId, userId });
    return res.status(201).json(booking);
  } catch (error) {
    if (error.statusCode === 400 || error.message === "El horario ya está ocupado") {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { date, scheduleId } = req.body;
    if (!date || !scheduleId) {
      return res.status(400).json({ error: "date y scheduleId son obligatorios" });
    }

    const updatedBooking = await bookingService.updateBooking(req.params.id, { date, scheduleId });
    return res.status(200).json(updatedBooking);
  } catch (error) {
    if (error.statusCode === 400 || error.message.includes("ocupado")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
};