const { body } = require("express-validator");

const createModalityValidator = [
  body("code_meaning")
    .trim()
    .notEmpty()
    .withMessage("code_meaning es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("code_meaning debe tener entre 2 y 100 caracteres"),

  body("code_value")
    .trim()
    .notEmpty()
    .withMessage("code_value es obligatorio")
    .isLength({ min: 1, max: 30 })
    .withMessage("code_value debe tener entre 1 y 30 caracteres"),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("status debe ser boolean")
    .toBoolean(),
];

module.exports = { createModalityValidator };
