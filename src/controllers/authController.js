const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Credenciales inválidas") {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  login,
  loginUser: login,
};