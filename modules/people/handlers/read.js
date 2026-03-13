const People = require("../schemas");

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
