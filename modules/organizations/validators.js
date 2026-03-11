const { body } = require("express-validator");

const createOrganizationValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name es obligatorio")
    .isLength({ min: 2, max: 120 })
    .withMessage("name debe tener entre 2 y 120 caracteres"),

  body("short_name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("short_name debe tener entre 2 y 30 caracteres"),

  body("country_code")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 3 })
    .withMessage("country_code debe tener entre 2 y 3 caracteres")
    .isAlpha()
    .withMessage("country_code solo debe contener letras")
    .toUpperCase(),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("status debe ser boolean")
    .toBoolean(),
];

module.exports = { createOrganizationValidator };
