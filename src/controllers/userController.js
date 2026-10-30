const userService = require("../services/userService");

const getUserBookings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookings = await userService.getUserBookings(id);
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookings,
};