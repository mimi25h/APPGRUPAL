const jwt = require("jsonwebtoken");
const { validationResult, matchedData } = require("express-validator");
const Users = require("./modules/users/schemas");

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: "Errores de validacion",
      errors: errors.array(),
    });
  }

  req.parsedBody = matchedData(req, {
    locations: ["body"],
    includeOptionals: true,
  });

  next();
}

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "No se envió el token" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!Users.findById(decoded.id)) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.token = decoded;
    next();
  });
}

function checkIsAdmin(req, res, next) {
  if (req.token?.role !== 1) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}

function checkCanReadModalitiesList(req, res, next) {
  if (req.token?.role === 1 || req.token?.role === 2) {
    return next();
  }

  return res.status(403).json({ message: "Acceso denegado" });
}

module.exports = {
  validateRequest,
  verifyToken,
  checkIsAdmin,
  checkCanReadModalitiesList,
};
