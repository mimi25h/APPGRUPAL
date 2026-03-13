const Organization = require("../schemas");

async function deleteOrganization(req, res) {
  try {
    const deleted = await Organization.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Organización no encontrada" });
    }

    res.json({ ok: true, data: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = deleteOrganization;
