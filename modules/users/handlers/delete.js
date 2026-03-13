const Users = require("../schemas");

async function deleteUser(req, res) {
  try {
    const deleted = await Users.findByIdAndDelete(req.params.id).select(
      "-password",
    );
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    res.json({ ok: true, data: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = deleteUser;
