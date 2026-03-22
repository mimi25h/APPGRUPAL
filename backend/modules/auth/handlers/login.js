// Login handler for the authentication module.
// Validates credentials, verifies the Argon2 password hash, and issues a short-lived JWT on success.
const { body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const users = require("../../users/schemas");

// Input validators: enforce non-empty username and password strings.
const loginValidators = [
  body("username").isString().trim().notEmpty(),
  body("password").isString().trim().notEmpty(),
];

// Looks up the user by username, verifies the password with Argon2,
// and signs a JWT token valid for 1 hour upon successful authentication.
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
    return res.status(401).json({
      ok: false,
      message: "Credenciales inválidas",
    });
  }

  const token = jwt.sign(user.getJWTpayload(), jwtSecret, {
    expiresIn: "1h",
  });

  return res.json({
    ok: true,
    data: { token },
  });
}

module.exports = {
  login,
  loginValidators,
};
