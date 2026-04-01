// Handler: updates an existing Organization document by ID.
const Organizations = require("../schemas");

// Applies the validated partial body from req.parsedBody to the organization record.
// Returns the updated document or 404 if not found.
async function updateOrganization(req, res) {
  try {
    const updated = await Organizations.findByIdAndUpdate(
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
        .json({ ok: false, message: "Organización no encontrada" });
    }

    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = updateOrganization;
