// Authentication routes module.
// Defines routes for user login, initial admin bootstrapping, and account deletion.
const express = require("express");
const jwt = require("jsonwebtoken");

const { login, loginValidators } = require("./handlers/login");
const {
  bootstrapAdmin,
  bootstrapAdminValidators,
} = require("./handlers/bootstrap-admin");
const {
  verifyToken,
  checkIsAdmin,
  validateRequest,
} = require("../../main.middlewares");
const Users = require("../users/schemas.js");

const AuthRouter = express.Router();

// Temporary debug logging to verify handler imports.
console.log("login:", typeof login);
console.log("loginValidators:", typeof loginValidators);
console.log("validateRequest:", typeof validateRequest);

// Route: POST /auth/login — authenticates a user and returns a signed JWT token.
AuthRouter.post("/login", ...loginValidators, validateRequest, login);

// Route: POST /auth/bootstrap-admin — creates the first admin user when no users exist.
AuthRouter.post(
  "/bootstrap-admin",
  ...bootstrapAdminValidators,
  ...bootstrapAdminValidators,
  validateRequest,
  bootstrapAdmin,
);

// Route: DELETE /auth/:id — deletes a person and all their associated users. Admin only.
// Returns a logout flag if the deleted person matches the currently authenticated user.
AuthRouter.delete("/:id", verifyToken, checkIsAdmin, async (req, res) => {
  const personId = req.params.id;
  try {
    const deletedPerson = await Persons.findByIdAndDelete(personId);
    if (!deletedPerson)
      return res.status(404).json({ error: "Person not found" });

    await Users.deleteMany({ fk_person: personId });

    const logout = req.token?.personId === personId;

    res.json({
      message: "Person and associated users deleted",
      logout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete person and users" });
  }
});

module.exports = AuthRouter;