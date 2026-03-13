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

router.use(checkIsAdmin);

router.get("/", readOrganizations);
router.get("/:id", organizationIdValidator, validateRequest, readOrganizations);
router.post(
  "/",
  createOrganizationValidator,
  validateRequest,
  createOrganization,
);
router.put(
  "/:id",
  organizationIdValidator,
  updateOrganizationValidator,
  validateRequest,
  updateOrganization,
);
router.delete(
  "/:id",
  organizationIdValidator,
  validateRequest,
  deleteOrganization,
);

module.exports = router;
