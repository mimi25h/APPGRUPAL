const express = require("express");
const { login, loginValidators } = require("./handlers/login");
const { parseBody } = require("../../main.middlewares");

const AuthRouter = express.Router();

AuthRouter.post("/login", loginValidators, parseBody, login);

module.exports = AuthRouter;
