const { body } = require("express-validator");

const createPeopleValidator = [
  body("document")
    .trim()
    .notEmpty()
    .withMessage("document es obligatorio")
    .isLength({ min: 7, max: 20 })
    .withMessage("document debe tener entre 7 y 20 caracteres"),

  body("name_01")
    .trim()
    .notEmpty()
    .withMessage("name_01 es obligatorio")
    .isLength({ min: 2, max: 80 })
    .withMessage("name_01 debe tener entre 2 y 80 caracteres"),

  body("name_02")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("name_02 debe tener entre 2 y 80 caracteres"),

  body("surname_01")
    .trim()
    .notEmpty()
    .withMessage("surname_01 es obligatorio")
    .isLength({ min: 2, max: 80 })
    .withMessage("surname_01 debe tener entre 2 y 80 caracteres"),

  body("surname_02")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("surname_02 debe tener entre 2 y 80 caracteres"),

  body("birth_date")
    .notEmpty()
    .withMessage("birth_date es obligatorio")
    .isISO8601()
    .withMessage("birth_date debe tener formato de fecha valido")
    .toDate(),

  body("gender")
    .optional()
    .isInt()
    .withMessage("gender debe ser un numero entero")
    .toInt(),

  body("phone_numbers")
    .optional()
    .isArray()
    .withMessage("phone_numbers debe ser un arreglo"),

  body("phone_numbers.*")
    .optional()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("cada telefono debe tener entre 6 y 20 caracteres"),
];

module.exports = { createPeopleValidator };
