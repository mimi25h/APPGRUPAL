// Handler: retrieves one or all User documents from the database (passwords excluded).
const Users = require("../schemas");
const { findById } = require("../../modules/modules.services");

// If req.params.id is present, fetches a single user by ID (no password).
// Otherwise, returns all users sorted by newest first (no passwords).
async function readUsers(req, res) {
  try {
    if (req.params.id) {
      const user = await findById(Users, req.params.id).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ ok: false, message: "Usuario no encontrado" });
      }

      return res.json({ ok: true, data: user });
    }

    const users = await Users.find().select("-password").sort({ _id: -1 });
    res.json({ ok: true, data: users });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = readUsers;
