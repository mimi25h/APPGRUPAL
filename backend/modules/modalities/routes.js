// Route definitions for the Modality resource.
// List access is open to admin and viewer roles; all other operations require admin.
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

// GET /api/modalities — list all modalities (accessible to admin and viewer roles).
router.get("/", checkCanReadModalitiesList, readModalities);

// All routes below are restricted to admin users only.
router.use(checkIsAdmin);

// GET /api/modalities/:id — get a single modality by ID.
router.get("/:id", modalityIdValidator, validateRequest, readModalities);
// POST /api/modalities — create a new modality.
router.post("/", createModalityValidator, validateRequest, createModality);
// PUT /api/modalities/:id — update an existing modality by ID.
router.put(
  "/:id",
  modalityIdValidator,
  updateModalityValidator,
  validateRequest,
  updateModality,
);
// DELETE /api/modalities/:id — remove a modality by ID.
router.delete("/:id", modalityIdValidator, validateRequest, deleteModality);

module.exports = router;
