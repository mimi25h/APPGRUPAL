const express = require("express");
const { login, loginValidators } = require("./handlers/login");
const {
  bootstrapAdmin,
  bootstrapAdminValidators,
} = require("./handlers/bootstrap-admin");
const { parseBody } = require("../../main.middlewares");

const AuthRouter = express.Router();

AuthRouter.post("/login", loginValidators, parseBody, login);
AuthRouter.post(
  "/bootstrap-admin",
  bootstrapAdminValidators,
  parseBody,
  bootstrapAdmin,
);

module.exports = AuthRouter;
