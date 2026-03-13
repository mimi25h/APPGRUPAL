const { body, param } = require("express-validator");

const organizationIdValidator = [
  param("id").isMongoId().withMessage("id debe ser un ObjectId valido"),
];

function nameValidator(isUpdate = false) {
  const validator = body("name");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("name es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("name debe tener entre 2 y 120 caracteres");
}

function shortNameValidator() {
  return body("short_name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("short_name debe tener entre 2 y 30 caracteres");
}

function countryCodeValidator() {
  return body("country_code")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 3 })
    .withMessage("country_code debe tener entre 2 y 3 caracteres")
    .isAlpha()
    .withMessage("country_code solo debe contener letras")
    .toUpperCase();
}

function statusValidator() {
  return body("status")
    .optional()
    .isBoolean()
    .withMessage("status debe ser boolean")
    .toBoolean();
}

function buildOrganizationValidators(isUpdate = false) {
  return [
    nameValidator(isUpdate),
    shortNameValidator(),
    countryCodeValidator(),
    statusValidator(),
  ];
}

const createOrganizationValidator = buildOrganizationValidators();

const updateOrganizationValidator = [
  body()
    .custom((value) => Object.keys(value || {}).length > 0)
    .withMessage("Debe enviar al menos un campo para actualizar"),
  ...buildOrganizationValidators(true),
];

module.exports = {
  createOrganizationValidator,
  organizationIdValidator,
  updateOrganizationValidator,
};
