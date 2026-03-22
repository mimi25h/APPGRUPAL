// Handler: deletes a Modality document by ID.
const Modality = require("../schemas");

// Finds and removes the modality from the database.
// Returns the deleted document or 404 if not found.
async function deleteModality(req, res) {
  try {
    const deleted = await Modality.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Modalidad no encontrada" });
    }

    res.json({ ok: true, data: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = deleteModality;
