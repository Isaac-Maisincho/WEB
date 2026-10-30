const authorizeUser = (req, res, next) => {
  const paramId = parseInt(req.params.id, 10);

  if (isNaN(paramId)) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  const isOwner = req.user && req.user.id === paramId;
  const isAdmin = req.user && req.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "No tienes permiso para ver este historial" });
  }

  next();
};

module.exports = authorizeUser;