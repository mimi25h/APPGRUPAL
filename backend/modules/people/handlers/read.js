// Handler: retrieves one or all People documents from the database.
const People = require("../schemas");

// If req.params.id is present, fetches a single person by ID.
// Otherwise, returns the full list sorted by newest first.
async function readPeople(req, res) {
  try {
    if (req.params.id) {
      const person = await People.findById(req.params.id);
      if (!person) {
        return res
          .status(404)
          .json({ ok: false, message: "Persona no encontrada" });
      }

      return res.json({ ok: true, data: person });
    }

    const people = await People.find().sort({ _id: -1 });
    res.json({ ok: true, data: people });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = readPeople;
