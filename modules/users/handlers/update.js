const argon2 = require("argon2");
const Users = require("../schemas");
const People = require("../../people/schemas");

async function updateUser(req, res) {
  try {
    const payload = { ...req.parsedBody };
    const currentUser = await Users.findById(req.params.id);

    if (!currentUser) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    if (payload.fk_person) {
      const person = await People.findById(payload.fk_person);
      if (!person) {
        return res
          .status(404)
          .json({ ok: false, message: "La persona asociada no existe" });
      }

      const duplicatedPerson = await Users.findOne({
        _id: { $ne: req.params.id },
        fk_person: payload.fk_person,
      });

      if (duplicatedPerson) {
        return res.status(409).json({
          ok: false,
          message: "La persona enviada ya tiene un usuario asociado",
        });
      }
    }

    if (payload.username || payload.email) {
      const duplicated = await Users.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(payload.username ? [{ username: payload.username }] : []),
          ...(payload.email ? [{ email: payload.email }] : []),
        ],
      });

      if (duplicated) {
        return res.status(409).json({
          ok: false,
          message: "Ya existe un usuario con el username o email enviado",
        });
      }
    }

    if (payload.password) {
      payload.password = await argon2.hash(payload.password);
    }

    const updated = await Users.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = updateUser;
