const Users = require("../schemas");

async function readUsers(req, res) {
  try {
    if (req.params.id) {
      const user = await Users.findById(req.params.id).select("-password");
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
