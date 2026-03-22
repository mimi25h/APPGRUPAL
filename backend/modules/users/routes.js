// Route definitions for the Users resource.
// All routes are restricted to admin users only.
const express = require("express");
const createUser = require("./handlers/create");
const readUsers = require("./handlers/read");
const updateUser = require("./handlers/update");
const deleteUser = require("./handlers/delete");
const {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
} = require("./validators");
const { checkIsAdmin, validateRequest } = require("../../main.middlewares");

const router = express.Router();

// All routes are restricted to admin users only.
router.use(checkIsAdmin);

// GET /api/users — list all users (passwords excluded).
router.get("/", readUsers);
// GET /api/users/:id — get a single user by ID (password excluded).
router.get("/:id", userIdValidator, validateRequest, readUsers);
// POST /api/users — create a new user linked to an existing person.
router.post("/", createUserValidator, validateRequest, createUser);
// PUT /api/users/:id — update an existing user by ID.
router.put(
  "/:id",
  userIdValidator,
  updateUserValidator,
  validateRequest,
  updateUser,
);
// DELETE /api/users/:id — remove a user by ID.
router.delete("/:id", userIdValidator, validateRequest, deleteUser);

module.exports = router;
