const { body, param } = require("express-validator");

const peopleIdValidator = [
  param("id").isMongoId().withMessage("id debe ser un ObjectId valido"),
];

function documentValidator(isUpdate = false) {
  const validator = body("document");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("document es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("document debe tener entre 7 y 20 caracteres");
}

function name01Validator(isUpdate = false) {
  const validator = body("name_01");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("name_01 es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("name_01 debe tener entre 2 y 80 caracteres");
}

function name02Validator() {
  return body("name_02")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("name_02 debe tener entre 2 y 80 caracteres");
}

function surname01Validator(isUpdate = false) {
  const validator = body("surname_01");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("surname_01 es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("surname_01 debe tener entre 2 y 80 caracteres");
}

function surname02Validator() {
  return body("surname_02")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("surname_02 debe tener entre 2 y 80 caracteres");
}

function birthDateValidator(isUpdate = false) {
  const validator = body("birth_date");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("birth_date es obligatorio");
  }

  return validator
    .isISO8601()
    .withMessage("birth_date debe tener formato de fecha valido")
    .toDate();
}

function genderValidator() {
  return body("gender")
    .optional()
    .isInt()
    .withMessage("gender debe ser un numero entero")
    .toInt();
}

function phoneNumbersValidator() {
  return body("phone_numbers")
    .optional()
    .isArray()
    .withMessage("phone_numbers debe ser un arreglo");
}

function phoneNumbersItemValidator() {
  return body("phone_numbers.*")
    .optional()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("cada telefono debe tener entre 6 y 20 caracteres");
}

function buildPeopleValidators(isUpdate = false) {
  return [
    documentValidator(isUpdate),
    name01Validator(isUpdate),
    name02Validator(),
    surname01Validator(isUpdate),
    surname02Validator(),
    birthDateValidator(isUpdate),
    genderValidator(),
    phoneNumbersValidator(),
    phoneNumbersItemValidator(),
  ];
}

const createPeopleValidator = buildPeopleValidators();

const updatePeopleValidator = [
  body()
    .custom((value) => Object.keys(value || {}).length > 0)
    .withMessage("Debe enviar al menos un campo para actualizar"),
  ...buildPeopleValidators(true),
];

module.exports = {
  createPeopleValidator,
  peopleIdValidator,
  updatePeopleValidator,
};
