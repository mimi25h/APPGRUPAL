const { body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const People = require("../../people/schemas");
const Users = require("../../users/schemas");

const bootstrapAdminValidators = [
  body("person.document")
    .isString()
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("person.document debe tener entre 7 y 20 caracteres"),
  body("person.name_01")
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("person.name_01 debe tener entre 2 y 80 caracteres"),
  body("person.surname_01")
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("person.surname_01 debe tener entre 2 y 80 caracteres"),
  body("person.birth_date")
    .isISO8601()
    .withMessage("person.birth_date debe tener formato de fecha valido")
    .toDate(),
  body("person.name_02")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("person.name_02 debe tener entre 2 y 80 caracteres"),
  body("person.surname_02")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("person.surname_02 debe tener entre 2 y 80 caracteres"),
  body("person.gender")
    .optional()
    .isInt()
    .withMessage("person.gender debe ser un numero entero")
    .toInt(),
  body("person.phone_numbers")
    .optional()
    .isArray()
    .withMessage("person.phone_numbers debe ser un arreglo"),
  body("person.phone_numbers.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("cada telefono debe tener entre 6 y 20 caracteres"),
  body("username")
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("username debe tener entre 3 y 30 caracteres"),
  body("password")
    .isString()
    .trim()
    .isLength({ min: 6 })
    .withMessage("password debe tener al menos 6 caracteres"),
  body("email").isEmail().withMessage("email no es valido").normalizeEmail(),
];

async function bootstrapAdmin(req, res) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        ok: false,
        message:
          "Configuracion incompleta: falta JWT_SECRET en variables de entorno",
      });
    }

    const usersCount = await Users.countDocuments();
    if (usersCount > 0) {
      return res.status(409).json({
        ok: false,
        message:
          "Bootstrap deshabilitado: ya existen usuarios. El alta de usuarios se hace con un Admin autenticado.",
      });
    }

    const payload = req.parsedBody;

    const duplicatedByDocument = await People.findOne({
      document: payload.person.document,
    });

    if (duplicatedByDocument) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe una persona con el documento enviado",
      });
    }

    const duplicatedUser = await Users.findOne({
      $or: [{ username: payload.username }, { email: payload.email }],
    });

    if (duplicatedUser) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un usuario con el username o email enviado",
      });
    }

    const createdPerson = await People.create(payload.person);

    const createdUser = await Users.create({
      fk_person: createdPerson._id,
      username: payload.username,
      password: await argon2.hash(payload.password),
      email: payload.email,
      role: 1,
    });

    const token = jwt.sign(createdUser.getJWTpayload(), jwtSecret, {
      expiresIn: "1h",
    });

    const safeUser = await Users.findById(createdUser._id).select("-password");

    return res.status(201).json({
      ok: true,
      message: "Administrador inicial creado correctamente",
      data: {
        person: createdPerson,
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = {
  bootstrapAdmin,
  bootstrapAdminValidators,
};
