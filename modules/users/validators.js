const { body } = require("express-validator");

const createUserValidator = [
  body("fk_person")
    .notEmpty()
    .withMessage("fk_person es obligatorio")
    .isMongoId()
    .withMessage("fk_person debe ser un ObjectId valido"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("username es obligatorio")
    .isLength({ min: 3, max: 30 })
    .withMessage("username debe tener entre 3 y 30 caracteres"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password es obligatorio")
    .isLength({ min: 6 })
    .withMessage("password debe tener al menos 6 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email es obligatorio")
    .isEmail()
    .withMessage("email no es valido")
    .normalizeEmail(),

  body("role")
    .trim()
    .isInt()
    .withMessage("role debe ser un numero entero")
    .toInt(),

  body("settings")
    .optional()
    .isObject()
    .withMessage("settings debe ser un objeto"),

  body("settings.language")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("settings.language debe tener entre 2 y 20 caracteres"),

  body("settings.theme")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("settings.theme debe tener entre 3 y 20 caracteres"),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("status debe ser boolean")
    .toBoolean(),
];

module.exports = { createUserValidator };
