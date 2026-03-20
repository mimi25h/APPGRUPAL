const express = require("express");
const { login, loginValidators } = require("./handlers/login");
const {
  bootstrapAdmin,
  bootstrapAdminValidators,
} = require("./handlers/bootstrap-admin");
const { validateRequest } = require("../../main.middlewares");

const AuthRouter = express.Router();

AuthRouter.post("/login", loginValidators, validateRequest, login);
AuthRouter.post(
  "/bootstrap-admin",
  bootstrapAdminValidators,
  validateRequest,
  bootstrapAdmin,
);

module.exports = AuthRouter;
