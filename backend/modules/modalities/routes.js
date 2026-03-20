const express = require("express");
const createModality = require("./handlers/create");
const readModalities = require("./handlers/read");
const updateModality = require("./handlers/update");
const deleteModality = require("./handlers/delete");
const {
  createModalityValidator,
  modalityIdValidator,
  updateModalityValidator,
} = require("./validators");
const {
  checkCanReadModalitiesList,
  checkIsAdmin,
  validateRequest,
} = require("../../main.middlewares");

const router = express.Router();

router.get("/", checkCanReadModalitiesList, readModalities);

router.use(checkIsAdmin);

router.get("/:id", modalityIdValidator, validateRequest, readModalities);
router.post("/", createModalityValidator, validateRequest, createModality);
router.put(
  "/:id",
  modalityIdValidator,
  updateModalityValidator,
  validateRequest,
  updateModality,
);
router.delete("/:id", modalityIdValidator, validateRequest, deleteModality);

module.exports = router;
