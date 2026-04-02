// Handler: updates an existing User document by ID.
// Validates linked person if changed, checks for duplicate conflicts, and rehashes password if updated.
const argon2 = require("argon2");
const Users = require("../schemas");
const People = require("../../people/schemas");
const { findById, findOne } = require("../../modules.services");

async function updateUser(req, res) {
  try {
    const payload = { ...req.parsedBody };
    // Verify the target user exists before applying any changes.
    const currentUser = await findById(Users, req.params.id);

    if (!currentUser) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    // If fk_person is being changed, validate the new person exists and is not already linked.
    if (payload.fk_person) {
      const person = await findById(People, payload.fk_person);
      if (!person) {
        return res
          .status(404)
          .json({ ok: false, message: "La persona asociada no existe" });
      }

      const duplicatedPerson = await findOne(Users, {
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

    // If username or email is being changed, check for conflicts with other existing users.
    if (payload.username || payload.email) {
      const duplicated = await findOne(Users, {
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

    // If a new password is provided, hash it with Argon2 before saving.
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
