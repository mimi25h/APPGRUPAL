// Route definitions for the Organization resource.
// All routes are restricted to admin users only.
const express = require("express");
const createOrganization = require("./handlers/create");
const readOrganizations = require("./handlers/read");
const updateOrganization = require("./handlers/update");
const deleteOrganization = require("./handlers/delete");
const {
  createOrganizationValidator,
  organizationIdValidator,
  updateOrganizationValidator,
} = require("./validators");
const { checkIsAdmin, validateRequest } = require("../../main.middlewares");

const router = express.Router();

// All routes below are restricted to admin users only.
router.use(checkIsAdmin);

// GET /api/organizations — list all organizations.
router.get("/", readOrganizations);
// GET /api/organizations/:id — get a single organization by ID.
router.get("/:id", organizationIdValidator, validateRequest, readOrganizations);
// POST /api/organizations — create a new organization.
router.post(
  "/",
  createOrganizationValidator,
  validateRequest,
  createOrganization,
);
// PUT /api/organizations/:id — update an existing organization by ID.
router.put(
  "/:id",
  organizationIdValidator,
  updateOrganizationValidator,
  validateRequest,
  updateOrganization,
);
// DELETE /api/organizations/:id — remove an organization by ID.
router.delete(
  "/:id",
  organizationIdValidator,
  validateRequest,
  deleteOrganization,
);

module.exports = router;
