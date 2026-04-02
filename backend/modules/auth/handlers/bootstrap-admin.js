// Bootstrap admin handler for initial system setup.
// Creates the first admin user (person + user account) when the database has no existing users.
// This endpoint is automatically disabled once any user is present.
const { body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const People = require("../../people/schemas");
const Users = require("../../users/schemas");
const { findById, findOne } = require("../../modules.services");

// Input validators for the full bootstrap-admin request body.
// Validates person fields (document, names, birth date), plus username, password, and email.
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

// Creates the initial admin: checks no users exist, validates no duplicate document/username/email,
// creates the person and user records with a hashed password (role=1), and returns a JWT token.
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

    // Block bootstrap if any user already exists in the database.
    const usersCount = await Users.countDocuments();
    if (usersCount > 0) {
      return res.status(409).json({
        ok: false,
        message:
          "Bootstrap deshabilitado: ya existen usuarios. El alta de usuarios se hace con un Admin autenticado.",
      });
    }

    const payload = req.parsedBody;

    // Check for duplicate person by document number.
    const duplicatedByDocument = await findOne(People, {
      document: payload.person.document,
    });

    if (duplicatedByDocument) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe una persona con el documento enviado",
      });
    }

    // Check for duplicate username or email before creating the user.
    const duplicatedUser = await findOne(Users, {
      $or: [{ username: payload.username }, { email: payload.email }],
    });

    if (duplicatedUser) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un usuario con el username o email enviado",
      });
    }

    // Create the person record and the admin user with a hashed password and role 1 (Admin).
    const createdPerson = await People.create(payload.person);

    const createdUser = await Users.create({
      fk_person: createdPerson._id,
      username: payload.username,
      password: await argon2.hash(payload.password),
      email: payload.email,
      role: 1,
    });

    // Sign a JWT token and return the created records (password field excluded from response).
    const token = jwt.sign(createdUser.getJWTpayload(), jwtSecret, {
      expiresIn: "1h",
    });

    const safeUser = await findById(Users, createdUser._id).select("-password");

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
