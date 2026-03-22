// Handler: updates an existing Modality document by ID.
const Modality = require("../schemas");

// Applies the validated partial body from req.parsedBody to the modality record.
// Returns the updated document or 404 if not found.
async function updateModality(req, res) {
  try {
    const updated = await Modality.findByIdAndUpdate(
      req.params.id,
      req.parsedBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, message: "Modalidad no encontrada" });
    }

    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = updateModality;
