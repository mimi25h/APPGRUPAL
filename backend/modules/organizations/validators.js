// Input validation rules for the Organization resource.
// Provides reusable validator builder functions for create and update operations.
const { body, param } = require("express-validator");

// Validates that the :id route parameter is a valid MongoDB ObjectId.
const organizationIdValidator = [
  param("id").isMongoId().withMessage("id debe ser un ObjectId valido"),
];

// Validates the name field (required on create, optional on update; 2-120 chars).
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

// Validates the optional short_name abbreviation (2-30 chars).
function shortNameValidator() {
  return body("short_name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("short_name debe tener entre 2 y 30 caracteres");
}

// Validates the optional country_code (2-3 uppercase alphabetic characters).
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

// Validates the optional status field as a boolean.
function statusValidator() {
  return body("status")
    .optional()
    .isBoolean()
    .withMessage("status debe ser boolean")
    .toBoolean();
}

// Assembles the full array of validators for create or update operations.
function buildOrganizationValidators(isUpdate = false) {
  return [
    nameValidator(isUpdate),
    shortNameValidator(),
    countryCodeValidator(),
    statusValidator(),
  ];
}

// Validator set for creating an organization (all required fields enforced).
const createOrganizationValidator = buildOrganizationValidators();

// Validator set for updating an organization (all fields optional, at least one must be present).
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
