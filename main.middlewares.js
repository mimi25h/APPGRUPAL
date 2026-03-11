const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: "Errores de validacion",
      errors: errors.array(),
    });
  }

  next();
}

module.exports = { validateRequest };
