// Shared Express middlewares for the application.
// Handles input validation, JWT authentication, and role-based access control.
const jwt = require("jsonwebtoken");
const { validationResult, matchedData } = require("express-validator");
const Users = require("./modules/users/schemas.js");
const { findById } = require("./modules/modules.services");

// Runs express-validator checks on the current request.
// Returns 400 with error details if validation fails.
// On success, attaches the sanitized data to req.parsedBody.
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

// Verifies the JWT Bearer token from the Authorization header.
// Decodes the token and attaches its payload to req.token for downstream handlers.
function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "No se envió el token" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!(await findById(Users, decoded.userId))) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.token = decoded;
    next();
  });
}

// Restricts access to admin users only (role === 1).
// Must be used after verifyToken.
function checkIsAdmin(req, res, next) {
  if (req.token?.role !== 1) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}

// Allows access to the modalities list for admin (role 1) and viewer (role 2) users.
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
