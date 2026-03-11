const jwt = require("jsonwebtoken");
const { validationResult, matchedData } = require("express-validator");

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

function parseBody(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ success: false, errors: result.array() });
    return;
  }
  req.parsedBody = matchedData(req);
  next();
}

module.exports = { verifyToken, checkIsAdmin, parseBody };
