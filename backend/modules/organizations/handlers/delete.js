// Handler: deletes an Organization document by ID.
const Organizations = require("../schemas");

// Finds and removes the organization from the database.
// Returns the deleted document or 404 if not found.
async function deleteOrganization(req, res) {
  try {
    const deleted = await Organizations.findByIdAndDelete(req.params.id);
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
