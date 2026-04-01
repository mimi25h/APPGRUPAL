// Login handler for the authentication module.
// Validates credentials, verifies the Argon2 password hash, and issues a short-lived JWT on success.
const { body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const Users = require("../../users/schemas");

// Input validators: enforce non-empty username and password strings.
const loginValidators = [
  body("username").isString().trim().notEmpty(),
  body("password").isString().trim().notEmpty(),
];

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        ok: false,
        message:
          "Configuracion incompleta: falta JWT_SECRET en variables de entorno",
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: "Faltan credenciales",
      });
    }

    const user = await findOne(Users, { username });

    // FIRST check user exists
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    // THEN verify password (safe now)
    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
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
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
}

module.exports = {
  login,
  loginValidators,
};
