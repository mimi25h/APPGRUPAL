const argon2 = require("argon2");
const Users = require("../schemas");
const People = require("../../people/schemas");

async function createUser(req, res) {
  try {
    const payload = { ...req.parsedBody };

    const person = await People.findById(payload.fk_person);
    if (!person) {
      return res
        .status(404)
        .json({ ok: false, message: "La persona asociada no existe" });
    }

    const duplicated = await Users.findOne({
      $or: [{ username: payload.username }, { email: payload.email }],
    });

    if (duplicated) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un usuario con el username o email enviado",
      });
    }

    const duplicatedPerson = await Users.findOne({
      fk_person: payload.fk_person,
    });
    if (duplicatedPerson) {
      return res.status(409).json({
        ok: false,
        message: "La persona enviada ya tiene un usuario asociado",
      });
    }

    payload.password = await argon2.hash(payload.password);

    const created = await Users.create(payload);
    const createdUser = await Users.findById(created._id).select("-password");

    res.status(201).json({ ok: true, data: createdUser });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createUser;
