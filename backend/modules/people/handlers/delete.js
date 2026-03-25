// Handler: deletes a People (person) document by ID.
// Note: use the route-level inline handler in people/routes.js for cascading user deletion.
const People = require("../schemas");

// Finds and removes the person from the database.
// Returns the deleted document or 404 if not found.
async function deletePeople(req, res) {
  try {
    const deleted = await People.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Persona no encontrada" });
    }

    res.json({ ok: true, data: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = deletePeople;
