const { body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const users = require("../../users/schemas");

const loginValidators = [
  body("username").isString().trim().notEmpty(),
  body("password").isString().trim().notEmpty(),
];

async function login(req, res) {
  const { username, password } = req.parsedBody;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      ok: false,
      message:
        "Configuracion incompleta: falta JWT_SECRET en variables de entorno",
    });
  }

  const user = await users.findOne({ username });

  if (!user || !(await argon2.verify(user.password, password))) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(user.getJWTpayload(), jwtSecret, {
    expiresIn: "1h",
  });

  res.json({ token });
}

module.exports = {
  login,
  loginValidators,
};
