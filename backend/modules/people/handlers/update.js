// Handler: updates an existing People (person) document by ID.
const People = require("../schemas");

// Applies the validated partial body from req.parsedBody to the person record.
// Returns the updated document or 404 if not found.
async function updatePeople(req, res) {
  try {
    const updated = await People.findByIdAndUpdate(
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
        .json({ ok: false, message: "Persona no encontrada" });
    }

    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = updatePeople;
