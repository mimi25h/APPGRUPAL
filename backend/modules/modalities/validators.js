// Input validation rules for the Modality resource.
// Provides reusable validator builder functions for create and update operations.
const { body, param } = require("express-validator");

// Validates that the :id route parameter is a valid MongoDB ObjectId.
const modalityIdValidator = [
  param("id").isMongoId().withMessage("id debe ser un ObjectId valido"),
];

// Validates the code_meaning field (required on create, optional on update; 2-100 chars).
function codeMeaningValidator(isUpdate = false) {
  const validator = body("code_meaning");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("code_meaning es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("code_meaning debe tener entre 2 y 100 caracteres");
}

// Validates the code_value field (required on create, optional on update; 1-30 chars).
function codeValueValidator(isUpdate = false) {
  const validator = body("code_value");
  if (isUpdate) {
    validator.optional();
  } else {
    validator.notEmpty().withMessage("code_value es obligatorio");
  }

  return validator
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("code_value debe tener entre 1 y 30 caracteres");
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
function buildModalityValidators(isUpdate = false) {
  return [
    codeMeaningValidator(isUpdate),
    codeValueValidator(isUpdate),
    statusValidator(),
  ];
}

// Validator set for creating a modality (all required fields enforced).
const createModalityValidator = buildModalityValidators();

// Validator set for updating a modality (all fields optional, at least one must be present).
const updateModalityValidator = [
  body()
    .custom((value) => Object.keys(value || {}).length > 0)
    .withMessage("Debe enviar al menos un campo para actualizar"),
  ...buildModalityValidators(true),
];

module.exports = {
  createModalityValidator,
  modalityIdValidator,
  updateModalityValidator,
};
