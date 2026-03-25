// Input validation rules for the Users resource.
// Provides reusable validator builder functions for create and update operations.
const { body, param } = require("express-validator");

// Validates that the :id route parameter is a valid MongoDB ObjectId.
const userIdValidator = [
  param("id").isMongoId().withMessage("id debe ser un ObjectId valido"),
];

// Validates the fk_person field (must be a valid ObjectId; required on create).
function fkPersonValidator(isUpdate = false) {
  const validator = body("fk_person");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("fk_person es obligatorio");
  }

  return validator
    .isMongoId()
    .withMessage("fk_person debe ser un ObjectId valido");
}

// Validates the username field (3-30 chars; required on create).
function usernameValidator(isUpdate = false) {
  const validator = body("username");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("username es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("username debe tener entre 3 y 30 caracteres");
}

// Validates the password field (minimum 6 chars; required on create).
function passwordValidator(isUpdate = false) {
  const validator = body("password");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("password es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 6 })
    .withMessage("password debe tener al menos 6 caracteres");
}

// Validates and normalizes the email field (required on create).
function emailValidator(isUpdate = false) {
  const validator = body("email");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("email es obligatorio");
  }

  return validator
    .trim()
    .isEmail()
    .withMessage("email no es valido")
    .normalizeEmail();
}

// Validates the role field: must be 1 (Admin) or 2 (Viewer); required on create.
function roleValidator(isUpdate = false) {
  const validator = body("role");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("role es obligatorio");
  }

  return validator
    .isInt()
    .withMessage("role debe ser un numero entero")
    .isIn([1, 2])
    .withMessage("role debe ser 1 (Administrador) o 2 (Visor)")
    .toInt();
}

// Validates the optional settings object.
function settingsValidator() {
  return body("settings")
    .optional()
    .isObject()
    .withMessage("settings debe ser un objeto");
}

// Validates the optional language preference within settings (2-20 chars).
function settingsLanguageValidator() {
  return body("settings.language")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("settings.language debe tener entre 2 y 20 caracteres");
}

// Validates the optional theme preference within settings (3-20 chars).
function settingsThemeValidator() {
  return body("settings.theme")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("settings.theme debe tener entre 3 y 20 caracteres");
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
function buildUserValidators(isUpdate = false) {
  return [
    fkPersonValidator(isUpdate),
    usernameValidator(isUpdate),
    passwordValidator(isUpdate),
    emailValidator(isUpdate),
    roleValidator(isUpdate),
    settingsValidator(),
    settingsLanguageValidator(),
    settingsThemeValidator(),
    statusValidator(),
  ];
}

// Validator set for creating a user (all required fields enforced).
const createUserValidator = buildUserValidators();

// Validator set for updating a user (all fields optional, at least one must be present).
const updateUserValidator = [
  body()
    .custom((value) => Object.keys(value || {}).length > 0)
    .withMessage("Debe enviar al menos un campo para actualizar"),
  ...buildUserValidators(true),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
};
