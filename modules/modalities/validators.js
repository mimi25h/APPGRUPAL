const { body, param } = require("express-validator");

const modalityIdValidator = [
  param("id").isMongoId().withMessage("id debe ser un ObjectId valido"),
];

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

function statusValidator() {
  return body("status")
    .optional()
    .isBoolean()
    .withMessage("status debe ser boolean")
    .toBoolean();
}

function buildModalityValidators(isUpdate = false) {
  return [
    codeMeaningValidator(isUpdate),
    codeValueValidator(isUpdate),
    statusValidator(),
  ];
}

const createModalityValidator = buildModalityValidators();

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
