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
const { validateRequest } = require("../../main.middlewares");

const router = express.Router();

router.get("/", readUsers);
router.get("/:id", userIdValidator, validateRequest, readUsers);
router.post("/", createUserValidator, validateRequest, createUser);
router.put(
  "/:id",
  userIdValidator,
  updateUserValidator,
  validateRequest,
  updateUser,
);
router.delete("/:id", userIdValidator, validateRequest, deleteUser);

module.exports = router;
