const express = require("express");
const jwt = require("jsonwebtoken");

const { login, loginValidators } = require("./handlers/login");
const { bootstrapAdmin, bootstrapAdminValidators } = require("./handlers/bootstrap-admin");
const { verifyToken, checkIsAdmin, validateRequest } = require("../../main.middlewares");
const Users = require("../users/schemas.js");

const AuthRouter = express.Router();

// Debug logging
console.log("login:", typeof login);
console.log("loginValidators:", typeof loginValidators);
console.log("validateRequest:", typeof validateRequest);

// LOGIN ROUTE
AuthRouter.post("/login", ...loginValidators, validateRequest, login);

// BOOTSTRAP-ADMIN ROUTE
AuthRouter.post(
  "/bootstrap-admin",
  ...bootstrapAdminValidators,
  validateRequest,
  bootstrapAdmin
);

// DELETE ACCOUNT ROUTE
AuthRouter.delete('/:id', verifyToken, checkIsAdmin, async (req, res) => {
  const personId = req.params.id;
  try {
    const deletedPerson = await Persons.findByIdAndDelete(personId);
    if (!deletedPerson) return res.status(404).json({ error: 'Person not found' });

    await Users.deleteMany({ fk_person: personId });

    const logout = req.token?.personId === personId;

    res.json({
      message: 'Person and associated users deleted',
      logout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete person and users' });
  }
});

module.exports = AuthRouter;